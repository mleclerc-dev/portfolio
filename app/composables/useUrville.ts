/*
 * Live conditions in Urville-Nacqueville, from Open-Meteo (free, keyless, CORS-open):
 * air, wind, sky, the swell offshore and the tide. One request per visit, shared by the
 * sea under the title, the swell lines behind the projects, the card in "About" and the
 * terminal's `meteo`. The tide is Open-Meteo's modelled sea level: indicative, not a tide table.
 */
export interface UrvilleNow {
  temp: number
  wind: number
  /** Where the wind comes from, in degrees */
  windDeg: number
  sky: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'
  wave: number | null
  period: number | null
  tide: Tide | null
}

export interface Tide {
  /** Sea level now, in metres around mean sea level */
  level: number
  /** 0 at the lowest of the next two days, 1 at the highest */
  ratio: number
  rising: boolean
  /** The next high or low water, local time ("21:40") */
  next: { kind: 'high' | 'low'; time: string } | null
  /** Today's sea level, hour by hour (0 to 24) */
  curve: { h: number; v: number }[]
  /** Today's high and low waters */
  turns: { kind: 'high' | 'low'; h: number; level: number; time: string }[]
  /** Now, in hours since midnight */
  nowH: number
}

const WEATHER =
  'https://api.open-meteo.com/v1/forecast?latitude=49.672&longitude=-1.738&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&wind_speed_unit=kmh&timezone=Europe/Paris'
const MARINE =
  'https://marine-api.open-meteo.com/v1/marine?latitude=49.69&longitude=-1.75&current=wave_height,wave_period,sea_level_height_msl&hourly=sea_level_height_msl&forecast_days=2&timezone=Europe/Paris'

/** Compass point the wind comes from, in the visitor's language. */
export const compass = (deg: number, lang: string) =>
  (lang === 'fr' ? ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])[Math.round(deg / 45) % 8]!

function skyOf(code: number): UrvilleNow['sky'] {
  if (code === 0) return 'clear'
  if (code <= 3) return 'cloudy'
  if (code <= 48) return 'fog'
  if (code <= 67 || (code >= 80 && code <= 82)) return 'rain'
  if (code <= 77 || code === 85 || code === 86) return 'snow'
  return 'storm'
}

/** Where the tide stands, from the hourly sea level around now. */
function tideOf(m: any): Tide | null {
  const level = m?.current?.sea_level_height_msl
  const times: string[] | undefined = m?.hourly?.time
  const raw: (number | null)[] | undefined = m?.hourly?.sea_level_height_msl
  if (typeof level !== 'number' || !times || !raw) return null
  const v = raw.map((x) => (typeof x === 'number' ? x : NaN))
  const finite = v.filter((x) => !Number.isNaN(x))
  if (finite.length < 6) return null
  const lo = Math.min(...finite)
  const hi = Math.max(...finite)
  const nowTime: string = m.current.time
  const hhmm = (t: string) => Number(t.slice(11, 13)) + Number(t.slice(14, 16)) / 60
  const clock = (h: number) => {
    const min = Math.round(((h % 24) + 24) % 24 * 12) * 5
    return `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
  }

  // Every turn of the tide in the data: hour index + offset, refined with a parabola through three points
  const turns: { kind: 'high' | 'low'; at: number; level: number }[] = []
  for (let k = 1; k < v.length - 1; k++) {
    const [a, b, c] = [v[k - 1]!, v[k]!, v[k + 1]!]
    const isHigh = b > a && b >= c
    const isLow = b < a && b <= c
    if (!isHigh && !isLow) continue
    const den = a - 2 * b + c
    const offset = den ? (a - c) / (2 * den) : 0
    turns.push({ kind: isHigh ? 'high' : 'low', at: k + offset, level: b - ((a - c) * offset) / 4 })
  }
  // Hours are counted from the first entry, which is today at 00:00 local
  const day = times[0]!.slice(0, 10)
  const nowAt = (nowTime.slice(0, 10) === day ? 0 : 24) + hhmm(nowTime)
  const nextTurn = turns.find((t) => t.at > nowAt)

  return {
    level,
    ratio: hi > lo ? (level - lo) / (hi - lo) : 0.5,
    rising: nextTurn ? nextTurn.kind === 'high' : false,
    next: nextTurn ? { kind: nextTurn.kind, time: clock(nextTurn.at) } : null,
    curve: v.slice(0, 25).map((x, h) => ({ h, v: x })).filter((p) => !Number.isNaN(p.v)),
    turns: turns.filter((t) => t.at >= 0 && t.at <= 24).map((t) => ({ kind: t.kind, h: t.at, level: t.level, time: clock(t.at) })),
    nowH: nowAt,
  }
}

/** "rising, high water at 21:40" in the visitor's language, or '' without data */
export function tideText(t: (key: string, values?: Record<string, unknown>) => string, tide: Tide | null | undefined, lang: string) {
  if (!tide?.next) return ''
  const time = lang === 'fr' ? tide.next.time.replace(':', ' h ') : tide.next.time
  return t(tide.rising ? 'tide.rising' : 'tide.falling', { time })
}

/** How the sea looks for a surfer, from the wave height. */
export const surfVerdict = (wave: number) => (wave < 0.4 ? 'flat' : wave < 1.2 ? 'small' : wave < 2.5 ? 'good' : 'big')

let pending: Promise<UrvilleNow | null> | null = null

export function fetchUrville(): Promise<UrvilleNow | null> {
  if (pending) return pending
  pending = (async () => {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 6000)
    try {
      const [w, m] = await Promise.all([
        fetch(WEATHER, { signal: ctl.signal }).then((r) => r.json()),
        // The sea can fail on its own; the air still counts.
        fetch(MARINE, { signal: ctl.signal })
          .then((r) => r.json())
          .catch(() => null),
      ])
      const c = w?.current
      if (!c) throw new Error('no data')
      return {
        temp: c.temperature_2m,
        wind: c.wind_speed_10m,
        windDeg: c.wind_direction_10m,
        sky: skyOf(c.weather_code),
        wave: typeof m?.current?.wave_height === 'number' ? m.current.wave_height : null,
        period: typeof m?.current?.wave_period === 'number' ? m.current.wave_period : null,
        tide: tideOf(m),
      }
    } catch {
      pending = null // let a later call try again
      return null
    } finally {
      clearTimeout(timer)
    }
  })()
  return pending
}

/** Reactive version for components: null while loading, false when offline. */
export function useUrville() {
  // Open the connections to both APIs while the page loads, so the first readings arrive sooner
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://api.open-meteo.com', crossorigin: 'anonymous', key: 'pc-meteo' },
      { rel: 'preconnect', href: 'https://marine-api.open-meteo.com', crossorigin: 'anonymous', key: 'pc-marine' },
    ],
  })
  const now = ref<UrvilleNow | null | false>(null)
  onMounted(() => {
    fetchUrville().then((d) => (now.value = d ?? false))
  })
  return now
}
