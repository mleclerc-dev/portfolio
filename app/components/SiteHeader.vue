<script setup lang="ts">
import { person, projects, type Locale } from '~/data/content'

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()
const lang = computed(() => locale.value as Locale)
const terminal = useTerminal()

const other = computed(() => locales.value.find((l) => l.code !== locale.value))
// The other language at the same place on the page. The server never sees the #section,
// so it's added only once the page is live (adding it during render breaks hydration).
const hash = ref('')
onMounted(() => watch(() => route.hash, (h) => (hash.value = h), { immediate: true }))
const otherPath = computed(() => (other.value ? switchLocalePath(other.value.code).split('#')[0] + hash.value : ''))
const home = computed(() => localePath('/'))

// "Notes" joins the menu once a note is published (always in `nuxt dev`, to preview drafts)
const notesCollection = useNotesCollection()
const { data: publishedNotes } = await useAsyncData(
  () => `notes-count-${notesCollection.value}`,
  () => queryCollection(notesCollection.value).where('draft', '=', false).count(),
  { watch: [notesCollection] },
)
const hasNotes = computed(() => showDrafts || (publishedNotes.value ?? 0) > 0)

const links = computed(() => [
  { id: 'projets', to: `${home.value}#projets`, label: t('nav.work') },
  { id: 'services', to: `${home.value}#services`, label: t('nav.services') },
  { id: 'parcours', to: `${home.value}#parcours`, label: t('nav.career') },
  { id: 'a-propos', to: `${home.value}#a-propos`, label: t('nav.about') },
  ...(hasNotes.value ? [{ id: 'notes', to: localePath('/notes'), label: t('nav.notes') }] : []),
  { id: 'contact', to: `${home.value}#contact`, label: t('nav.contact') },
])

// Where we are among the projects: -1 outside a project page.
const current = computed(() => projects.findIndex((p) => p.slug === route.params.slug))

// The active menu item: on a project page, "Projects"; on the home page, the section
// crossing the middle of the screen (watched as you scroll); elsewhere, none.
const inView = ref('')
const onNotes = computed(() => route.path.replace(/^\/en/, '').startsWith('/notes'))
const active = computed(() => (current.value >= 0 ? 'projets' : onNotes.value ? 'notes' : inView.value))
let spy: IntersectionObserver | undefined
function watchSections() {
  spy?.disconnect()
  inView.value = ''
  spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.value = e.target.id
        else if (inView.value === e.target.id) inView.value = ''
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  )
  for (const l of links.value) {
    const el = document.getElementById(l.id)
    if (el) spy.observe(el)
  }
}
onMounted(() => {
  watchSections()
  // the header stays mounted from page to page: look again once the new page is in
  watch(() => route.path, () => nextTick(watchSections))
})
onBeforeUnmount(() => spy?.disconnect())
const pad = (n: number) => String(n).padStart(2, '0')

// The menu on small screens: a full-height sheet under the bar
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const menuPanel = ref<HTMLElement | null>(null)
function toggleMenu(open = !menuOpen.value) {
  menuOpen.value = open
}
watch(menuOpen, async (open) => {
  if (!import.meta.client) return
  // no scrolling the page behind the open menu
  document.documentElement.style.overflow = open ? 'hidden' : ''
  await nextTick()
  if (open) menuPanel.value?.querySelector<HTMLElement>('a')?.focus()
  else menuButton.value?.focus({ preventScroll: true })
})
// Close on navigation and with Escape; reopen never sticks across pages
watch(() => route.fullPath, () => (menuOpen.value = false))
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) toggleMenu(false)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.documentElement.style.overflow = ''
})

const isMac = ref(true)
onMounted(() => (isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper">
    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
    >
      {{ t('nav.skip') }}
    </a>
    <div class="mx-auto grid h-14 max-w-[90rem] grid-cols-[1fr_auto] items-center gap-6 px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
      <div class="flex items-center gap-5">
        <NuxtLink :to="home" class="text-[1.75rem] text-ink transition-opacity duration-200 hover:opacity-80"><BrandMark aria-hidden="true" /><span class="sr-only">{{ t('nav.home') }}</span></NuxtLink>
      </div>

      <!-- Where you are -->
      <p class="hidden font-mono text-[0.75rem] text-ink/75 md:block">
        <template v-if="current >= 0">
          <span class="tabular-nums">{{ pad(current + 1) }}/{{ pad(projects.length) }}</span>
          <span class="mx-2" aria-hidden="true">·</span>
          <span class="text-ink">{{ projects[current]!.name[lang] }}</span>
        </template>
      </p>

      <nav :aria-label="t('nav.label')" class="flex items-center justify-end gap-5 font-mono text-[0.75rem] uppercase tracking-[0.08em]">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :aria-current="active === link.id ? 'location' : undefined"
          class="relative hidden text-ink transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-[19px] after:h-0.5 after:origin-left after:bg-[var(--yellow)] after:transition-transform after:duration-300 hover:text-accent lg:inline"
          :class="active === link.id ? 'after:scale-x-100' : 'after:scale-x-0'"
        >
          {{ link.label }}
        </NuxtLink>
        <button
          type="button"
          class="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 normal-case tracking-normal transition-colors duration-200 hover:border-ink"
          :aria-label="`${t('term.open')}, ${isMac ? '⌘K' : 'Ctrl K'}`"
          aria-keyshortcuts="Meta+K Control+K"
          aria-haspopup="dialog"
          @click="terminal.open()"
        >
          <span aria-hidden="true" class="text-accent">›_</span>
          <kbd class="hidden font-mono text-[0.68rem] text-muted sm:inline">{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd>
        </button>
        <NuxtLink
          v-if="other"
          :to="otherPath"
          :hreflang="other.language"
          :lang="other.code"
          :aria-label="`${other.code.toUpperCase()}, ${t('nav.language')} (${other.name})`"
          class="grid h-10 min-w-10 place-items-center rounded-full border border-line px-3 transition-colors duration-200 hover:border-ink"
        >
          {{ other.code }}
        </NuxtLink>
        <button
          ref="menuButton"
          type="button"
          class="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 transition-colors duration-200 hover:border-ink lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="menu-mobile"
          @click="toggleMenu()"
        >
          <span class="relative block h-2.5 w-4" aria-hidden="true">
            <span class="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300" :class="{ 'translate-y-[5px] rotate-45': menuOpen }" />
            <span class="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300" :class="{ '-translate-y-[4px] -rotate-45': menuOpen }" />
          </span>
          {{ menuOpen ? t('nav.close') : t('nav.menu') }}
        </button>
      </nav>
    </div>

    <!-- Small screens: the menu, full height under the bar -->
    <Transition name="menu">
      <div
        v-show="menuOpen"
        id="menu-mobile"
        ref="menuPanel"
        class="fixed inset-x-0 bottom-0 top-14 overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <nav :aria-label="t('nav.label')" class="mx-auto flex min-h-full max-w-[90rem] flex-col px-4 pb-8 pt-6 sm:px-8">
          <ol class="border-t border-line">
            <li v-for="(link, i) in links" :key="link.to" class="menu-item border-b border-line" :style="{ '--i': i }">
              <NuxtLink
                :to="link.to"
                :aria-current="active === link.id ? 'location' : undefined"
                class="flex items-baseline gap-4 py-4 transition-colors duration-200 hover:text-[var(--yellow)]"
                :class="active === link.id ? 'text-[var(--yellow)]' : 'text-ink'"
                @click="toggleMenu(false)"
              >
                <span class="font-mono text-[0.72rem] tabular-nums" :class="active === link.id ? 'text-[var(--yellow)]' : 'text-muted'">{{ pad(i + 1) }}</span>
                <span data-face="host" class="text-[clamp(2rem,9vw,3.2rem)] uppercase leading-none">{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ol>
          <div class="mt-auto grid gap-3 pt-10 font-mono text-[0.78rem] uppercase tracking-[0.08em]">
            <a :href="`mailto:${person.email}`" class="flex h-12 items-center justify-between rounded-full bg-[var(--yellow)] px-6 text-[var(--on-yellow)]">
              {{ t('hero.cta_contact') }} <span aria-hidden="true">→</span>
            </a>
            <a :href="person.cv[lang]" download class="flex h-12 items-center justify-between rounded-full border border-line px-6 text-ink">
              {{ t('about.cv') }} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </nav>
      </div>
    </Transition>

  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}
@media (prefers-reduced-motion: no-preference) {
  .menu-enter-active .menu-item {
    animation: menu-item 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i) * 45ms + 60ms);
  }
}
@keyframes menu-item {
  from { opacity: 0; transform: translateY(0.75rem); }
}
</style>
