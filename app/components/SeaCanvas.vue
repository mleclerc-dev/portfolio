<script setup lang="ts">
/*
 * The sea off Urville, drawn from the live data:
 * - the swell: wave height sets how tall it is, the period sets its rhythm (one crest every
 *   `period` seconds, as out there) and its length;
 * - the wind adds chop on top, and foam on the crests when it blows hard;
 * - the tide raises or lowers the whole sea;
 * - the sky: rain, drizzle under a storm, fog, snow;
 * - and the visitor: the pointer (or a finger) leaves a wake that spreads and settles;
 * - with `rider`, a little surfer rides the yellow wave, with a hand-drawn arrow and that label:
 *   he surfs towards the pointer (turning round when he goes back), does a 360 when clicked or
 *   tapped, wipes out when swept across quickly (then paddles back and stands up), and goes out
 *   on his paddle board when the sea is flat (under 40 cm of swell).
 * Canvas, ~30 fps while on screen; a still frame under reduced motion (no wake).
 */
import type { UrvilleNow } from '~/composables/useUrville'

const props = defineProps<{
  wave?: number | null
  period?: number | null
  wind?: number | null
  /** 0 = low water, 1 = high water */
  tide?: number | null
  sky?: UrvilleNow['sky'] | null
  /** Label for the surfer riding the yellow wave ("moi"); no surfer without it */
  rider?: string
  /** What the label says while the surfer is in the water ("plouf") */
  splash?: string
  /** What the label says during a trick ("360 !") */
  trick?: string
}>()
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // The label is drawn in the hand-written face. It is only a word or two, so it waits for the
  // page to finish loading (a fallback face stands in until then) instead of competing with
  // the fonts and scripts the first paint needs.
  if (props.rider) {
    const loadHand = () => document.fonts.load('600 24px Caveat').then(() => draw(reduced ? 0 : performance.now()), () => {})
    const whenIdle = () => ('requestIdleCallback' in window ? requestIdleCallback(loadHand, { timeout: 2000 }) : setTimeout(loadHand, 300))
    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })
  }
  let w = 0
  let h = 0
  let raf = 0
  let last = 0
  let visible = false

  // The wipeout: when it started (ms), how long before he can fall again, and how many so far
  let fallAt = -1e9
  const FALL_COOLDOWN = 4200
  let ploufs = 0
  // The trick: when it started
  let trickAt = -1e9
  const T_TRICK = 950
  // Where he surfs: towards the pointer while it's over the sea, home otherwise
  let riderX = Number.NaN
  let targetX: number | null = null
  let facing = 1
  // The wake: where the pointer crossed, when, and how fast
  const wakes: { x: number; t: number; s: number }[] = []
  let lastX = -1
  let lastT = 0
  const still = () => reduced || motionOff()
  function onPointer(e: PointerEvent) {
    if (still()) return
    const r = el!.getBoundingClientRect()
    const x = e.clientX - r.left
    const now = performance.now()
    if (now - lastT < 35) return
    const yPtr = e.clientY - r.top
    if (props.rider && rider) {
      const busy = now - fallAt < T_STAND || now - trickAt < T_TRICK
      const near = Math.abs(x - rider.x) < 22 * rider.k && Math.abs(yPtr - (rider.y - 12 * rider.k)) < 26 * rider.k
      el!.style.cursor = near && !busy ? 'pointer' : ''
      if (e.type === 'pointerdown' && near && !busy) trickAt = now
      targetX = Math.min(w * 0.9, Math.max(w * 0.08, x))
    }
    if (now - lastT < 35 && e.type !== 'pointerdown') return
    const speed = lastX < 0 ? 0.6 : Math.abs(x - lastX) / Math.max(16, now - lastT)
    // A quick flick right across the surfer: wipeout, unless he's busy or still recovering
    if (props.rider && rider && e.type !== 'pointerdown' && now - fallAt > FALL_COOLDOWN && now - trickAt > T_TRICK && Math.abs(x - rider.x) < 26 * rider.k && speed > 1.1) {
      fallAt = now
      ploufs++
    }
    wakes.push({ x, t: now, s: Math.min(1.6, 0.45 + speed * 0.9) })
    if (wakes.length > 28) wakes.shift()
    lastX = x
    lastT = now
    kick()
  }
  function onLeave() {
    lastX = -1
    targetX = null
    el!.style.cursor = ''
  }
  el.addEventListener('pointermove', onPointer, { passive: true })
  el.addEventListener('pointerdown', onPointer, { passive: true })
  el.addEventListener('pointerleave', onLeave)

  function size() {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    w = el!.clientWidth
    h = el!.clientHeight
    el!.width = Math.round(w * dpr)
    el!.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // Cheap, stable pseudo-random numbers for the rain and snow
  const rnd = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }

  // Back to front: further rows are smaller, slower and dimmer.
  const ROWS = 5
  function draw(ms: number) {
    const s = ms / 1000
    const height = Math.min(3.5, props.wave ?? 0.8)
    const period = Math.min(16, Math.max(3, props.period ?? 6))
    const wind = Math.min(70, props.wind ?? 15)
    const amp = Math.min(h * 0.24, 3 + height * h * 0.09)
    // longer swell on a wide band, so it reads as swell rather than chop
    const length = Math.min(w * 0.9, Math.max(60 + period * 22, w * 0.2))
    const omega = (Math.PI * 2) / period
    const chop = (wind / 60) * Math.min(3, h * 0.03)
    // high water lifts the whole sea, low water lowers it
    const tideShift = ((props.tide ?? 0.5) - 0.5) * h * 0.22
    // wakes older than 2.4 s have settled
    while (wakes.length && ms - wakes[0]!.t > 2400) wakes.shift()
    ctx!.clearRect(0, 0, w, h)

    const wake = (x: number, depth: number) => {
      let d = 0
      for (const p of wakes) {
        const age = (ms - p.t) / 1000
        const dist = Math.abs(x - p.x)
        d += p.s * Math.exp(-age * 1.7) * Math.exp(-dist / (36 + age * 150)) * Math.sin(dist * 0.085 - age * 9)
      }
      return d * h * 0.05 * (0.35 + depth * 0.65)
    }

    for (let r = 0; r < ROWS; r++) {
      const depth = r / (ROWS - 1) // 0 far, 1 near
      const base = h * (0.22 + depth * 0.62) - tideShift
      const a = amp * (0.45 + depth * 0.55)
      const k = (Math.PI * 2) / (length * (0.6 + depth * 0.4))
      const phase = r * 1.7
      const y = (x: number) =>
        base +
        // the swell: a sharpened sine (crests pointier than troughs)
        -a * Math.pow((Math.sin(k * x - omega * s + phase) + 1) / 2, 1.6) * 2 + a +
        a * 0.25 * Math.sin(k * 2.3 * x - omega * 1.6 * s + phase * 2) +
        // the wind's chop
        chop * (0.5 + depth * 0.5) * Math.sin(k * 4.5 * x - omega * 2.2 * s + r) +
        (wakes.length ? wake(x, depth) : 0)

      const ys: number[] = []
      for (let x = 0; x <= w + 3; x += 3) ys.push(y(x))

      ctx!.beginPath()
      ctx!.moveTo(0, h)
      ys.forEach((yy, i) => ctx!.lineTo(i * 3, yy))
      ctx!.lineTo(w, h)
      ctx!.closePath()
      ctx!.fillStyle = `rgb(${14 + depth * 14} ${15 + depth * 15} ${17 + depth * 17})`
      ctx!.fill()

      ctx!.beginPath()
      ys.forEach((yy, i) => (i ? ctx!.lineTo(i * 3, yy) : ctx!.moveTo(0, yy)))
      ctx!.strokeStyle = r === 2 ? 'rgba(242, 208, 75, 0.8)' : `rgba(242, 242, 239, ${0.08 + depth * 0.32})`
      ctx!.lineWidth = 1.2 + depth * 0.6
      ctx!.stroke()

      // The surfer rides the yellow wave, drawn before the nearer rows so they can hide his feet
      if (r === 2 && props.rider) drawRider(y, s)

      // Foam on the crests when the wind is up
      if (wind > 35 && r > 1) {
        ctx!.fillStyle = 'rgba(242, 242, 239, 0.55)'
        ys.forEach((yy, i) => {
          const x = i * 3
          if (yy < base - a * 0.75 && (x * 13 + r * 7) % 9 < 3) ctx!.fillRect(x, yy - 1.5, 1.5, 1.5)
        })
      }
    }

    if (props.rider && rider) drawLabel()

    // The sky over it
    const sky = props.sky
    if (sky === 'rain' || sky === 'storm') {
      const n = Math.round((w / (sky === 'storm' ? 5 : 9)) * Math.min(1.4, h / 120))
      const slant = 0.25 + wind / 120
      ctx!.strokeStyle = 'rgba(242, 242, 239, 0.22)'
      ctx!.lineWidth = 1
      ctx!.beginPath()
      for (let i = 0; i < n; i++) {
        const speed = 0.9 + rnd(i) * 0.6
        const yy = ((rnd(i + 7) * (h + 30) + s * 120 * speed) % (h + 30)) - 20
        const xx = (rnd(i + 3) * (w + 40) - yy * slant + w) % (w + 40)
        ctx!.moveTo(xx, yy)
        ctx!.lineTo(xx - 7 * slant, yy + 7)
      }
      ctx!.stroke()
    } else if (sky === 'snow') {
      ctx!.fillStyle = 'rgba(242, 242, 239, 0.6)'
      const n = Math.round(w / 12)
      for (let i = 0; i < n; i++) {
        const yy = ((rnd(i + 5) * (h + 10) + s * 18 * (0.6 + rnd(i))) % (h + 10)) - 5
        const xx = (rnd(i + 9) * w + Math.sin(s * 0.8 + i) * 6 + w) % w
        ctx!.fillRect(xx, yy, 1.8, 1.8)
      }
    } else if (sky === 'fog') {
      const g = ctx!.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, 'rgba(242, 242, 239, 0.16)')
      g.addColorStop(0.55, 'rgba(242, 242, 239, 0.06)')
      g.addColorStop(1, 'rgba(242, 242, 239, 0)')
      ctx!.fillStyle = g
      ctx!.fillRect(0, 0, w, h)
    }
  }

  // Where the surfer is, for the label drawn on top of everything
  let rider: { x: number; y: number; k: number } | null = null
  function drawFigure(c: CanvasRenderingContext2D) {
    // knees bent, arms out
    c.strokeStyle = '#f2f2ef'
    c.lineWidth = 2.3
    c.beginPath()
    c.moveTo(-6, -1.5); c.lineTo(-3.5, -7.5); c.lineTo(0, -11)
    c.moveTo(6, -2); c.lineTo(4, -7); c.lineTo(0, -11)
    c.moveTo(0, -11); c.lineTo(2, -20)
    c.moveTo(1.6, -17); c.lineTo(-7.5, -14.5)
    c.moveTo(1.6, -17); c.lineTo(10.5, -19.5)
    c.stroke()
    c.fillStyle = '#f2f2ef'
    c.beginPath()
    c.arc(3.6, -24, 2.7, 0, Math.PI * 2)
    c.fill()
  }
  function drawBoard(c: CanvasRenderingContext2D) {
    c.strokeStyle = '#f2d04b'
    c.lineWidth = 3.4
    c.beginPath()
    c.moveTo(-15, 0.5)
    c.lineTo(15, -1)
    c.stroke()
  }
  // Wipeout timeline (ms since the fall): tumble, under, paddle back, stand up
  const T_TUMBLE = 650
  const T_UNDER = 1700
  const T_PADDLE = 2500
  const T_STAND = 2950
  let falling = false
  function drawRider(y: (x: number) => number, s: number) {
    const c = ctx!
    const since = performance.now() - fallAt
    falling = since < T_STAND
    const trick = performance.now() - trickAt
    const tricking = trick < T_TRICK
    // He drifts gently around his spot, or surfs towards the pointer
    const home = w * (w < 640 ? 0.26 : 0.3) + Math.sin(s * 0.35) * w * 0.03
    if (Number.isNaN(riderX)) riderX = home
    const before = riderX
    if (!falling) riderX += ((targetX ?? home) - riderX) * 0.045
    const vx = riderX - before
    if (vx < -0.7) facing = -1
    else if (vx > 0.7 || (targetX === null && Math.abs(vx) < 0.2)) facing = 1
    const x = riderX
    const yy = y(x) - 1.5
    const angle = Math.atan2(y(x + 5) - y(x - 5), 10)
    const k = w < 640 ? 1.15 : 1.45
    rider = { x, y: yy, k }
    const flat = (props.wave ?? 0.8) < 0.4
    c.save()
    c.translate(x, yy)
    c.rotate(angle)
    c.lineCap = 'round'
    c.lineJoin = 'round'
    if (tricking) {
      // a 360 in the air: up, round, and back down on the wave
      const p = trick / T_TRICK
      const ease = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p)
      c.translate(0, -Math.sin(Math.PI * p) * 30 * k)
      c.rotate(ease * Math.PI * 2 * facing)
    }
    c.scale(k * facing, k)

    if (tricking) {
      drawBoard(c)
      drawFigure(c)
    } else if (flat && !falling) {
      // flat sea: out on the paddle board instead, standing, paddling
      const ph = s * 2.4
      const stroke = (Math.sin(ph) + 1) / 2 // 1 = blade forward (catch), 0 = blade back (exit)
      c.strokeStyle = '#f2d04b'
      c.lineWidth = 3.6
      c.beginPath()
      c.moveTo(-21, 0.5)
      c.lineTo(21, -0.5)
      c.stroke()
      const top = { x: 2 + stroke * 3, y: -23 }
      const blade = { x: -7 + stroke * 20, y: 5 }
      c.strokeStyle = '#f2f2ef'
      c.lineWidth = 2.3
      c.beginPath()
      // legs, a little bent; torso; arms on the shaft
      c.moveTo(-4, -1); c.lineTo(-2.5, -6.5); c.lineTo(-0.5, -12)
      c.moveTo(4, -1); c.lineTo(2.5, -6.5); c.lineTo(-0.5, -12)
      c.moveTo(-0.5, -12); c.lineTo(0.5 + stroke * 1.5, -20.5)
      c.moveTo(0.5 + stroke * 1.5, -18.5); c.lineTo(top.x, top.y + 1)
      c.moveTo(0.5 + stroke * 1.5, -18.5); c.lineTo(top.x + (blade.x - top.x) * 0.35, top.y + (blade.y - top.y) * 0.35)
      c.stroke()
      c.fillStyle = '#f2f2ef'
      c.beginPath()
      c.arc(1.6 + stroke * 1.5, -24.5, 2.7, 0, Math.PI * 2)
      c.fill()
      // the paddle: shaft and blade
      c.lineWidth = 1.9
      c.beginPath()
      c.moveTo(top.x - 2, top.y)
      c.lineTo(top.x + 2, top.y)
      c.moveTo(top.x, top.y)
      c.lineTo(blade.x, blade.y)
      c.stroke()
      const ang = Math.atan2(blade.y - top.y, blade.x - top.x)
      c.strokeStyle = '#f2d04b'
      c.lineWidth = 4.6
      c.beginPath()
      c.moveTo(blade.x - Math.cos(ang) * 7, blade.y - Math.sin(ang) * 7)
      c.lineTo(blade.x, blade.y)
      c.stroke()
    } else if (!falling) {
      // spray off the tail
      c.fillStyle = 'rgba(242, 242, 239, 0.7)'
      for (let i = 0; i < 4; i++) {
        const t = (s * 2.2 + i * 0.25) % 1
        c.globalAlpha = 1 - t
        c.fillRect(-16 - t * 12 - i * 2, -2 - t * 9 + i, 1.6, 1.6)
      }
      c.globalAlpha = 1
      drawBoard(c)
      drawFigure(c)
    } else if (since < T_TUMBLE) {
      // tumble: the board kicks out forward, he goes over backwards
      const p = since / T_TUMBLE
      c.save()
      c.translate(p * 16, -p * 12 + p * p * 14)
      c.rotate(p * 2.6)
      drawBoard(c)
      c.restore()
      c.save()
      c.translate(-p * 5, p * 20)
      c.rotate(-p * 2)
      c.globalAlpha = 1 - p * 0.7
      drawFigure(c)
      c.restore()
      c.globalAlpha = 1
    } else if (since < T_UNDER) {
      // under: the board floats, a few bubbles
      c.save()
      c.translate(14, 1)
      c.rotate(0.15)
      drawBoard(c)
      c.restore()
      c.fillStyle = 'rgba(242, 242, 239, 0.6)'
      for (let i = 0; i < 3; i++) {
        const t = ((since - T_TUMBLE) / 500 + i * 0.33) % 1
        c.globalAlpha = 1 - t
        c.beginPath()
        c.arc(-3 + i * 3, 2 - t * 12, 1.3, 0, Math.PI * 2)
        c.fill()
      }
      c.globalAlpha = 1
    } else if (since < T_PADDLE) {
      // back on the board, lying down, paddling
      drawBoard(c)
      c.strokeStyle = '#f2f2ef'
      c.lineWidth = 2.3
      const a = Math.sin(since / 90) * 3
      c.beginPath()
      c.moveTo(-9, -3); c.lineTo(5, -3.5)
      c.moveTo(3, -3.5); c.lineTo(5 + a, 1.5)
      c.stroke()
      c.fillStyle = '#f2f2ef'
      c.beginPath()
      c.arc(8, -4.5, 2.7, 0, Math.PI * 2)
      c.fill()
    } else {
      // pop-up: from crouched to standing
      const q = (since - T_PADDLE) / (T_STAND - T_PADDLE)
      drawBoard(c)
      c.save()
      c.scale(1, 0.35 + 0.65 * q)
      drawFigure(c)
      c.restore()
    }

    // the splash, right where he went in
    if (falling && since > 150 && since < 1050) {
      const p = (since - 150) / 900
      c.fillStyle = '#f2f2ef'
      c.globalAlpha = 1 - p
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI * (0.1 + (i / 7) * 0.8)
        const r = 4 + p * 18
        c.fillRect(Math.cos(a) * r - 1, Math.sin(a) * r * 1.2 + p * p * 10 - 2, 2, 2)
      }
      c.globalAlpha = 1
    }
    c.restore()
  }
  function drawLabel() {
    const c = ctx!
    const { x, y, k } = rider!
    // the label sits up and to the right, kept inside the sea
    const lx = Math.min(w - 64, x + 30 + 26 * k)
    const ly = y - 20 - 10 * k
    c.strokeStyle = '#f2d04b'
    c.fillStyle = '#f2d04b'
    c.lineWidth = 1.6
    c.lineCap = 'round'
    // a hand-drawn arrow, from the label to the surfer's head
    const ex = x + 8 * k
    const ey = y - 25 * k
    c.beginPath()
    c.moveTo(lx - 6, ly - 2)
    c.quadraticCurveTo(lx - 14, ly - 22, ex + 4, ey - 4)
    c.stroke()
    const ang = Math.atan2(ey - 4 - (ly - 22), ex + 4 - (lx - 14))
    c.beginPath()
    c.moveTo(ex + 4, ey - 4)
    c.lineTo(ex + 4 - 7 * Math.cos(ang - 0.5), ey - 4 - 7 * Math.sin(ang - 0.5))
    c.moveTo(ex + 4, ey - 4)
    c.lineTo(ex + 4 - 7 * Math.cos(ang + 0.5), ey - 4 - 7 * Math.sin(ang + 0.5))
    c.stroke()
    c.font = '600 24px Caveat, "Comic Sans MS", cursive'
    c.textBaseline = 'middle'
    // in the water, the label says so (until he's back on the board)
    const now = performance.now()
    const inWater = falling && now - fallAt < T_PADDLE
    const text =
      inWater && props.splash
        ? `${props.splash}${ploufs > 1 ? ` ×${ploufs}` : ''}`
        : now - trickAt < T_TRICK + 400 && props.trick
          ? props.trick
          : props.rider!
    c.fillText(text, lx, ly + 2)
  }

  function loop(now: number) {
    raf = 0
    if (still()) return
    if (now - last > 33) {
      last = now
      draw(now)
    }
    if (visible) raf = requestAnimationFrame(loop)
  }
  function kick() {
    if (visible && !still() && !raf) raf = requestAnimationFrame(loop)
  }
  // The visitor paused or resumed the animations
  const onMotion = () => (still() ? draw(performance.now()) : kick())
  window.addEventListener('motionchange', onMotion)

  const io = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting
    kick()
  })
  const ro = new ResizeObserver(() => {
    size()
    draw(reduced ? 0 : performance.now())
  })
  if (motionOff()) draw(performance.now())
  ro.observe(el)
  io.observe(el)
  // New data: redraw the still frame (the loop picks it up by itself).
  watch(
    () => [props.wave, props.period, props.wind, props.tide, props.sky],
    () => reduced && draw(0),
  )

  onBeforeUnmount(() => {
    io.disconnect()
    ro.disconnect()
    cancelAnimationFrame(raf)
    el.removeEventListener('pointermove', onPointer)
    el.removeEventListener('pointerdown', onPointer)
    el.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('motionchange', onMotion)
  })
})
</script>

<template>
  <!-- Out of the flow, so its pixel size never feeds back into the layout (the parent sets the size).
       touch-action: pan-y keeps vertical scrolling on phones while a finger draws a wake. -->
  <canvas ref="canvas" aria-hidden="true" class="absolute inset-0 block size-full touch-pan-y" />
</template>
