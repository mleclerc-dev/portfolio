<script setup lang="ts">
import { person, projects, services, skills, type Locale } from '~/data/content'

/*
 * A small terminal over the page: ⌘K / Ctrl+K or ` to open, Esc to close.
 * Opens on an identity card (neofetch-style). Commands are grouped in `help`.
 * Ghost completion as you type (Tab or → accepts), history with ↑/↓ kept for the visit,
 * "did you mean…?" on typos, and clickable suggestions so nobody is ever stuck.
 */
const { t, locale, setLocale } = useI18n()
const lang = computed(() => locale.value as Locale)
const localePath = useLocalePath()
const router = useRouter()
const { isOpen, close, toggle } = useTerminal()

type Kind = 'in' | 'out' | 'err' | 'ok' | 'dim' | 'card' | 'table' | 'help'
interface Line { kind: Kind; text?: string; to?: string; href?: string; delay?: number }
const lines = ref<Line[]>([])
const input = ref('')
const field = ref<HTMLInputElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
let history: string[] = []
let cursor = -1
let returnFocus: HTMLElement | null = null
let batch = 0

const GROUPS = [
  { key: 'nav', cmds: ['ls', 'open', 'home'] },
  { key: 'me', cmds: ['whoami', 'dispo', 'services', 'stack', 'cv'] },
  { key: 'contact', cmds: ['contact', 'email', 'github', 'linkedin'] },
  { key: 'system', cmds: ['lang', 'clear', 'help', 'exit'] },
  { key: 'fun', cmds: ['meteo', 'cafe', 'pingouin', 'embauche'] },
] as const
const COMMANDS = GROUPS.flatMap((g) => g.cmds)
const suggestions = ['ls', 'open move-taxi', 'dispo', 'meteo', 'cv', 'contact']
const dot = { live: 'bg-[#4ade80]', used: 'bg-[#f2d04b]', wip: 'bg-[#f2d04b]' }

function out(text: string, kind: Kind = 'out', extra: Partial<Line> = {}) {
  lines.value.push({ kind, text, delay: (batch++) * 22, ...extra })
}

// Live conditions in Urville-Nacqueville (composables/useUrville): air, wind, swell, and a surf verdict.
async function weather() {
  out(t('term.weather_loading'), 'dim')
  const d = await fetchUrville()
  if (!d) return out(t('term.weather_offline'), 'err')
  const num = (n: number, digits = 0) => n.toFixed(digits).replace('.', lang.value === 'fr' ? ',' : '.')
  batch = 0
  out(`${t(`term.sky.${d.sky}`)} · ${Math.round(d.temp)} °C`)
  out(`${t('term.wind')} ${compass(d.windDeg, lang.value)} ${Math.round(d.wind)} km/h`)
  if (d.wave != null) {
    out(`${t('term.swell')} ${num(d.wave, 1)} m${d.period ? ` · ${Math.round(d.period)} s` : ''}`)
    out(t(`term.surf_${surfVerdict(d.wave)}`), 'ok')
  }
  const tide = tideText(t, d.tide, lang.value)
  if (tide) out(`${t('tide.label')} ${tide}`)
  out(t('term.weather_source'), 'dim')
}

// Light-hearted extras. Each command answers in the visitor's language.
const COFFEE = ['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', "   `----'"].join('\n')
const PENGUIN = ['   .--.', '  |o_o |', '  |:_/ |', ' //   \\ \\', '(|     | )', "/'\\_   _/`\\", '\\___)=(___/'].join('\n')

function findProject(arg: string) {
  const a = arg.toLowerCase().trim()
  if (!a) return undefined
  const n = Number(a)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
  return projects.find((p) => p.slug === a || p.id === a || p.name[lang.value].toLowerCase().startsWith(a) || p.slug.startsWith(a))
}

// Closest known command, for "did you mean…?"
function closest(word: string) {
  const dist = (a: string, b: string) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
    for (let j = 1; j <= b.length; j++) d[0]![j] = j
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1))
    return d[a.length]![b.length]!
  }
  const best = COMMANDS.map((c) => [c, dist(word, c)] as const).sort((x, y) => x[1] - y[1])[0]
  return best && best[1] <= 2 ? best[0] : null
}

async function run(raw: string) {
  const cmd = raw.trim()
  batch = 0
  out(cmd, 'in')
  if (!cmd) return
  history = [cmd, ...history.filter((h) => h !== cmd)].slice(0, 50)
  try {
    sessionStorage.setItem('term-history', JSON.stringify(history))
  } catch {}
  cursor = -1
  const [name = '', ...rest] = cmd.split(/\s+/)
  const arg = rest.join(' ')

  switch (name.toLowerCase()) {
    case 'help':
    case 'aide':
      lines.value.push({ kind: 'help', delay: 0 })
      break
    case 'whoami':
    case 'neofetch':
    case 'about':
      lines.value.push({ kind: 'card', delay: 0 })
      break
    case 'ls':
    case 'projects':
    case 'projets':
      lines.value.push({ kind: 'table', delay: 0 })
      out(t('term.ls_hint'), 'dim')
      break
    case 'open':
    case 'cd': {
      if (arg === '~' || arg === '..' || arg === '') {
        if (!arg) {
          out(t('term.open_usage'), 'err')
          break
        }
        return goHome()
      }
      const p = findProject(arg)
      if (!p) {
        out(t('term.not_found', { arg }), 'err')
        break
      }
      out(t('term.opening', { name: p.name[lang.value] }), 'ok')
      setTimeout(async () => {
        close()
        await router.push(localePath(`/projets/${p.slug}`))
      }, 350)
      break
    }
    case 'home':
      return goHome()
    case 'dispo':
      out(t('contact.availability'), 'ok')
      out(t('term.dispo_hint'), 'dim')
      break
    case 'services':
      services.forEach((s) => out(`→ ${s.title[lang.value]}  ·  ${s.proof[lang.value]}`))
      break
    case 'stack':
      skills.forEach((s) => out(`${s.group[lang.value].padEnd(14)} ${s.items.join(', ')}`))
      break
    case 'cv':
      out(t('term.cv_done'), 'ok')
      window.open(person.cv[lang.value], '_blank', 'noopener')
      break
    case 'contact':
      out(person.email, 'out', { href: `mailto:${person.email}` })
      person.links.filter((l) => l.href).forEach((l) => out(l.href, 'out', { href: l.href }))
      out(t('term.contact_hint'), 'dim')
      break
    case 'email':
    case 'mail':
      try {
        await navigator.clipboard.writeText(person.email)
        out(t('term.copied', { email: person.email }), 'ok')
      } catch {
        out(person.email, 'out', { href: `mailto:${person.email}` })
      }
      break
    case 'github':
    case 'linkedin': {
      const l = person.links.find((x) => x.label.toLowerCase() === name.toLowerCase())
      if (l?.href) {
        out(t('term.opening', { name: l.label }), 'ok')
        window.open(l.href, '_blank', 'noopener')
      }
      break
    }
    case 'lang': {
      const code = arg.toLowerCase()
      if (code !== 'fr' && code !== 'en') {
        out(t('term.lang_usage'), 'err')
        break
      }
      await setLocale(code)
      out(t('term.lang_done'), 'ok')
      break
    }
    case 'sudo':
      out(t('term.sudo'), 'err')
      break
    case 'cafe':
    case 'café':
    case 'coffee':
      out(COFFEE, 'dim')
      out(t('term.coffee'), 'ok')
      break
    case 'pingouin':
    case 'penguin':
      out(PENGUIN, 'dim')
      out(t('term.penguin'), 'ok')
      break
    case 'meteo':
    case 'météo':
    case 'weather':
    case 'surf':
      await weather()
      break
    case 'embauche':
    case 'hire':
      out(t('term.hire'), 'ok')
      out(person.email, 'out', { href: `mailto:${person.email}` })
      break
    case 'rm':
      out(t('term.rm'), 'err')
      break
    case 'vim':
    case 'vi':
    case 'nano':
      out(t('term.vim'), 'dim')
      break
    case '42':
      out(t('term.42'), 'ok')
      break
    case 'ping':
      out('pong', 'ok')
      break
    case 'date':
      out(new Date().toLocaleString(lang.value === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: 'full', timeStyle: 'short' }))
      break
    case 'bonjour':
    case 'hello':
      out(t('term.hello'), 'ok')
      break
    case 'clear':
      lines.value = []
      break
    case 'exit':
    case 'quit':
      close()
      break
    default: {
      const guess = closest(name.toLowerCase())
      out(guess ? t('term.did_you_mean', { cmd: name, guess }) : t('term.unknown', { cmd: name }), 'err')
    }
  }
}

async function goHome() {
  close()
  await router.push(localePath('/'))
}

async function submit() {
  const value = input.value
  input.value = ''
  await run(value)
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' })
}

// Ghost completion: the rest of the only command or project that matches what is typed.
const ghost = computed(() => {
  const v = input.value
  if (!v || v.endsWith(' ')) return ''
  const [name = '', ...rest] = v.split(' ')
  if (!rest.length) {
    const m = COMMANDS.filter((c) => c.startsWith(name.toLowerCase()))
    return m.length === 1 && m[0] !== name ? m[0]!.slice(name.length) : ''
  }
  if ((name === 'open' || name === 'cd') && rest.length === 1) {
    const m = projects.filter((p) => p.slug.startsWith(rest[0]!.toLowerCase()))
    return m.length === 1 && m[0]!.slug !== rest[0] ? m[0]!.slug.slice(rest[0]!.length) : ''
  }
  return ''
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
    cursor = Math.max(-1, Math.min(history.length - 1, cursor + (e.key === 'ArrowUp' ? 1 : -1)))
    input.value = cursor >= 0 ? history[cursor]! : ''
  } else if (e.key === 'Tab' || (e.key === 'ArrowRight' && ghost.value && field.value?.selectionStart === input.value.length)) {
    if (e.key === 'Tab') e.preventDefault()
    if (ghost.value) {
      input.value += ghost.value
      if (!input.value.includes(' ') && input.value === 'open') input.value += ' '
    }
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault()
    lines.value = []
  }
}

function suggest(cmd: string) {
  input.value = cmd
  submit()
  field.value?.focus()
}

watch(isOpen, async (open) => {
  if (open) {
    returnFocus = document.activeElement as HTMLElement | null
    if (!lines.value.length) {
      batch = 0
      lines.value.push({ kind: 'card', delay: 0 })
      out(t('term.welcome_hint'), 'dim')
    }
    await nextTick()
    field.value?.focus()
  } else {
    returnFocus?.focus?.()
  }
})

// Global shortcuts
function onGlobalKey(e: KeyboardEvent) {
  const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggle()
  } else if (e.key === '`' && !typing) {
    e.preventDefault()
    toggle()
  } else if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}
onMounted(() => {
  window.addEventListener('keydown', onGlobalKey)
  try {
    history = JSON.parse(sessionStorage.getItem('term-history') || '[]')
  } catch {}
})
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <Transition name="term">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 backdrop-blur-[3px] sm:items-center sm:px-4"
      @click.self="close()"
    >
      <div
        role="dialog"
        aria-modal="true"
        :aria-label="t('term.title')"
        class="term-window flex max-h-[88svh] w-full flex-col overflow-hidden rounded-t-[16px] border border-white/10 bg-[#0d0d0f] font-mono text-[0.86rem] sm:text-[0.92rem] leading-relaxed text-[#e9e8e3] shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] sm:h-[min(44rem,80vh)] sm:max-h-[80vh] sm:max-w-[62rem] sm:rounded-[14px]"
      >
        <!-- Title bar -->
        <div class="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 text-[0.72rem] text-white/70">
          <span aria-hidden="true" class="flex gap-1.5">
            <button type="button" tabindex="-1" class="size-3 rounded-full bg-[#ff5f57]" @click="close()" />
            <span class="size-3 rounded-full bg-[#febc2e]" /><span class="size-3 rounded-full bg-[#28c840]" />
          </span>
          <span class="mx-auto min-w-0 truncate sm:-translate-x-6">visiteur@maxime: ~/portfolio<span class="hidden sm:inline"> — zsh</span></span>
          <button type="button" class="grid h-7 place-items-center rounded px-2 hover:bg-white/10 hover:text-white" :aria-label="t('term.close')" @click="close()">esc</button>
        </div>

        <!-- Output -->
        <div ref="scroller" class="min-h-[18rem] flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5" aria-live="polite">
          <div v-for="(l, i) in lines" :key="i" class="line" :style="{ animationDelay: `${l.delay ?? 0}ms` }">
            <!-- Identity card -->
            <div v-if="l.kind === 'card'" class="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
              <div aria-hidden="true" class="grid size-[5.5rem] shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.04] text-[2.6rem] text-white"><BrandMark /></div>
              <dl class="grid flex-1 grid-cols-[6.5rem_1fr] gap-x-3 gap-y-0.5">
                <dt class="col-span-2 mb-1 text-[#f2d04b]">{{ person.name.toLowerCase().replace(' ', '') }}@portfolio</dt>
                <dt class="text-white/60">{{ t('term.card.role') }}</dt><dd>{{ t('cv.role') }}</dd>
                <dt class="text-white/60">{{ t('term.card.place') }}</dt><dd>{{ person.location }}, Cotentin</dd>
                <dt class="text-white/60">{{ t('term.card.dispo') }}</dt><dd class="flex items-center gap-2"><span class="size-2 shrink-0 rounded-full bg-[#4ade80]" />{{ t('hero.available') }}</dd>
                <dt class="text-white/60">{{ t('term.card.stack') }}</dt><dd>Vue · Nuxt · Laravel · TypeScript</dd>
                <dt class="text-white/60">{{ t('term.card.since') }}</dt><dd>2015</dd>
                <dt class="text-white/60">{{ t('term.card.projects') }}</dt><dd>{{ projects.map((p) => p.name[lang]).join(', ') }} <span class="text-white/40">({{ t('term.card.ls') }})</span></dd>
              </dl>
            </div>

            <!-- Help -->
            <div v-else-if="l.kind === 'help'" class="my-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="g in GROUPS" :key="g.key">
                <p class="mb-1 text-[0.68rem] uppercase tracking-[0.12em] text-white/40">{{ t(`term.groups.${g.key}`) }}</p>
                <p v-for="c in g.cmds" :key="c" class="flex gap-3">
                  <button type="button" class="w-24 shrink-0 text-left text-[#f2d04b] hover:underline" @click="suggest(c === 'open' ? 'open 1' : c === 'lang' ? (lang === 'fr' ? 'lang en' : 'lang fr') : c)">{{ c }}</button>
                  <span class="text-white/65">{{ t(`term.help.${c}`) }}</span>
                </p>
              </div>
            </div>

            <!-- Projects table -->
            <div v-else-if="l.kind === 'table'" class="my-1">
              <NuxtLink
                v-for="(p, j) in projects"
                :key="p.id"
                :to="localePath(`/projets/${p.slug}`)"
                class="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded px-1 py-0.5 hover:bg-white/[0.06] sm:grid-cols-[2rem_11rem_1fr_9rem]"
                @click="close()"
              >
                <span class="text-white/40">{{ String(j + 1).padStart(2, '0') }}</span>
                <span class="text-[#f2d04b]">{{ p.slug }}</span>
                <span class="hidden truncate text-white/70 sm:block">{{ p.kind[lang] }}</span>
                <span class="flex items-center gap-2 text-white/60"><span class="size-1.5 rounded-full" :class="dot[p.state]" />{{ p.status[lang] }}</span>
              </NuxtLink>
            </div>

            <!-- Plain lines -->
            <p
              v-else
              class="whitespace-pre-wrap break-words"
              :class="{ 'mt-2 text-white': l.kind === 'in', 'text-[#ff8a80]': l.kind === 'err', 'text-[#7ee2a8]': l.kind === 'ok', 'text-white/60': l.kind === 'dim' }"
            >
              <template v-if="l.kind === 'in'"><span aria-hidden="true"><span class="text-[#f2d04b]">visiteur@maxime</span><span class="text-white/40">:~$</span>&nbsp;</span></template>
              <a v-if="l.href" :href="l.href" target="_blank" rel="noopener" class="underline decoration-white/25 underline-offset-2 hover:decoration-white">{{ l.text }}</a>
              <template v-else>{{ l.text }}</template>
            </p>
          </div>
        </div>

        <!-- Prompt -->
        <form class="flex items-center gap-2 border-t border-white/10 px-4 py-3 sm:px-5" @submit.prevent="submit">
          <span aria-hidden="true" class="shrink-0"><span class="text-[#f2d04b]">visiteur@maxime</span><span class="text-white/40">:~$</span></span>
          <label for="term-input" class="sr-only">{{ t('term.prompt') }}</label>
          <div class="relative flex-1">
            <!-- Ghost completion, drawn behind the input with the same metrics -->
            <span aria-hidden="true" class="pointer-events-none absolute inset-0 whitespace-pre text-white/30"><span class="invisible">{{ input }}</span>{{ ghost }}</span>
            <input
              id="term-input"
              ref="field"
              v-model="input"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              enterkeyhint="go"
              class="term-input relative w-full bg-transparent caret-[#f2d04b] outline-none placeholder:text-white/40"
              :placeholder="t('term.placeholder')"
              @keydown="onKey"
            >
          </div>
          <kbd class="hidden shrink-0 rounded border border-white/15 px-1.5 text-[0.65rem] text-white/40 sm:inline">tab</kbd>
        </form>
        <div class="flex flex-wrap gap-2 border-t border-white/10 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-5">
          <button
            v-for="s in suggestions"
            :key="s"
            type="button"
            class="h-8 rounded-full border border-white/15 px-3 text-[0.72rem] text-white/70 transition-colors hover:border-[#f2d04b] hover:text-[#f2d04b]"
            @click="suggest(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* The prompt is already framed by the window: no focus ring on the input itself. */
.term-input:focus-visible {
  outline: none;
}

.term-enter-active,
.term-leave-active {
  transition: opacity 0.2s ease;
}
.term-enter-active .term-window {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.term-leave-active .term-window {
  transition: transform 0.18s ease-in, opacity 0.15s ease-in;
}
.term-enter-from,
.term-leave-to {
  opacity: 0;
}
.term-enter-from .term-window,
.term-leave-to .term-window {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
@media (max-width: 639px) {
  .term-enter-from .term-window,
  .term-leave-to .term-window {
    transform: translateY(100%);
  }
}
@media (prefers-reduced-motion: no-preference) {
  .line {
    animation: line-in 0.22s ease-out both;
  }
}
@keyframes line-in {
  from { opacity: 0; transform: translateY(4px); }
}
</style>
