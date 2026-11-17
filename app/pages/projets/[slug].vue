<script setup lang="ts">
import { person, projects, type Locale } from '~/data/content'

/*
 * One project, always laid out the same way so a visitor knows where to look:
 *   path & position → title & tagline → hero visual → what it is / what I did / spec sheet
 *   → more visuals → "a project like this?" → next project.
 * The project's own identity (palette, display face, ornaments) dresses that skeleton:
 * the palette comes from <html data-page-scene>, set server-side.
 */
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => locale.value as Locale)

const index = computed(() => projects.findIndex((p) => p.slug === route.params.slug))
if (index.value < 0) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable', fatal: true })

const p = computed(() => projects[index.value]!)
const next = computed(() => projects[(index.value + 1) % projects.length]!)
const prev = computed(() => projects[(index.value - 1 + projects.length) % projects.length]!)

useHead(() => ({ htmlAttrs: { 'data-page-scene': p.value.id } }))
// Search and sharing: the project's own title, summary and card image, and what it is (schema.org)
const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
useSeoMeta({
  title: () => `${p.value.name[lang.value]} · ${p.value.kind[lang.value]} · Maxime Leclerc`,
  description: () => p.value.summary[lang.value],
  ogTitle: () => `${p.value.name[lang.value]} · Maxime Leclerc`,
  ogDescription: () => `${p.value.tagline[lang.value]} ${p.value.summary[lang.value]}`,
  ogType: 'article',
  ogImage: () => `${site}/og/${p.value.slug}-${lang.value}.png`,
  ogImageAlt: () => `${p.value.name[lang.value]} · ${p.value.tagline[lang.value]}`,
})
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      key: 'ld-project',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        // A game for Kaplouf; otherwise a piece of work (SoftwareApplication would ask for offers and ratings)
        '@type': p.value.id === 'kaplouf' ? 'VideoGame' : 'CreativeWork',
        name: p.value.name[lang.value],
        description: p.value.summary[lang.value],
        about: { '@type': 'Thing', name: p.value.kind[lang.value] },
        ...(p.value.year ? { dateCreated: p.value.year } : {}),
        ...(p.value.url ? { url: p.value.url } : {}),
        image: `${site}/og/${p.value.slug}-${lang.value}.png`,
        author: { '@id': `${site}/#person` },
        creator: { '@type': 'Person', name: 'Maxime Leclerc', url: site },
        keywords: p.value.stack.join(', '),
      }),
    },
    // Home › this project, for the search result's breadcrumb
    {
      type: 'application/ld+json',
      key: 'ld-breadcrumb',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Maxime Leclerc', item: `${site}${localePath('/')}`.replace(/\/$/, '') || site },
          { '@type': 'ListItem', position: 2, name: p.value.name[lang.value], item: `${site}${localePath({ name: 'projets-slug', params: { slug: p.value.slug } })}` },
        ],
      }),
    },
  ],
}))

// The interactive preview from the home page, shown large at the top of the page.
const previews: Partial<Record<string, ReturnType<typeof resolveComponent>>> = {
  taxi: resolveComponent('PreviewTaxi'),
  mariage: resolveComponent('PreviewMariage'),
  noel: resolveComponent('PreviewNoel'),
}
const scenes = {
  taxi: resolveComponent('SceneTaxi'),
  kaplouf: resolveComponent('SceneKaplouf'),
  mariage: resolveComponent('SceneMariage'),
  noel: resolveComponent('SceneNoel'),
}
// Back to the list, at this project's own screen.
const backTo = computed(() => `${localePath('/')}#projet-${p.value.slug}`)
const router = useRouter()
const terminal = useTerminal()
const scrolled = ref(false)
function onScroll() {
  // Shown while reading; hidden at the top and once the "next project" block is reached.
  const end = document.documentElement.scrollHeight - window.innerHeight - 900
  scrolled.value = window.scrollY > 500 && window.scrollY < end
}
function onKey(e: KeyboardEvent) {
  const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))
  if (e.key === 'Escape' && !typing && !terminal.isOpen.value) router.push(backTo.value)
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})

const specRows = computed(() => [
  { label: t('project.for'), value: p.value.for[lang.value] },
  { label: t('page.type'), value: p.value.kind[lang.value] },
  { label: t('page.context'), value: t(`bento.${p.value.origin}`) },
  ...(p.value.year ? [{ label: t('page.year'), value: p.value.year }] : []),
])

const dot = { live: 'bg-[#4ade80]', used: 'bg-accent', wip: 'bg-[#f0c04a]' }
</script>

<template>
  <article :data-scene="p.id" class="scene" :aria-labelledby="`${p.id}-title`">
    <!-- Where you are -->
    <div class="mx-auto max-w-[90rem] px-4 pt-24 sm:px-8 sm:pt-28">
      <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4 font-mono text-[0.75rem] text-muted">
        <p class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <NuxtLink
            :to="backTo"
            class="group inline-flex items-center gap-2 rounded-full border border-ink/30 px-3.5 py-1.5 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <span aria-hidden="true" class="transition-transform group-hover:-translate-x-0.5">←</span>
            {{ t('page.back') }}
            <kbd class="hidden rounded border border-current/30 px-1 text-[0.65rem] opacity-60 sm:inline">esc</kbd>
          </NuxtLink>
        </p>
        <p class="flex items-center gap-4">
          <span class="flex items-center gap-2"><span class="size-1.5 rounded-full" :class="dot[p.state]" />{{ p.status[lang] }}</span>
        </p>
      </div>
    </div>

    <!-- Title, with the interactive preview beside it on wide screens -->
    <div
      class="mx-auto max-w-[90rem] px-4 pt-12 sm:px-8 sm:pt-16"
      :class="previews[p.id] ? 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-12' : ''"
    >
    <header class="pb-12 sm:pb-16" :class="previews[p.id] ? 'lg:col-span-6 lg:pb-0' : ''">
      <p class="eyebrow">{{ t('project.for') }} {{ p.for[lang] }} · {{ p.kind[lang] }}</p>
      <h1
        :id="`${p.id}-title`"
        :data-face="p.id"
        class="mt-5 leading-[0.9]"
        :class="previews[p.id] ? 'text-[clamp(3.2rem,11vw,7rem)] lg:text-[clamp(4rem,6.6vw,7rem)]' : 'text-[clamp(3rem,10vw,9.5rem)]'"
        :style="{ viewTransitionName: `project-${p.id}` }"
      >
        {{ p.name[lang] }}
      </h1>
      <p
        class="mt-6 max-w-[32ch] text-[clamp(1.3rem,2.6vw,2rem)] leading-[1.2]"
        :class="'text-accent'"
        :data-face="p.id === 'taxi' || p.id === 'kaplouf' ? p.id : undefined"
      >
        {{ p.tagline[lang] }}
      </p>
      <p v-if="p.id === 'noel'" class="mt-4 -rotate-2 font-hand text-[clamp(1.8rem,3.6vw,3rem)] font-semibold text-[var(--noel-candy)]">
        {{ t('noel.hand') }}
      </p>
    </header>

    <div v-if="previews[p.id]" class="lg:col-span-6">
      <div
        :class="({ mariage: 'rounded-[20px] bg-[#e2e5ea] p-4 sm:p-6', noel: 'min-h-[30rem] rounded-[20px] bg-[#0b3326] p-5 sm:h-[32rem] sm:p-8', taxi: 'h-[26rem] sm:h-[32rem]' } as Record<string, string>)[p.id]"
      >
        <component :is="previews[p.id]" />
      </div>
      <p class="mt-4 flex items-center justify-center gap-2 font-mono text-[0.75rem] text-muted">
        <span aria-hidden="true" class="size-1.5 rounded-full bg-accent blink" />{{ t('page.try') }}
      </p>
    </div>
    </div>

    <div v-if="!previews[p.id]" class="mx-auto max-w-[90rem] overflow-x-clip px-4 sm:px-8">
      <component :is="scenes[p.id]" part="hero" />
    </div>

    <!-- What it is, what I did, the spec sheet -->
    <section class="mx-auto mt-20 grid max-w-[90rem] gap-14 px-4 sm:mt-28 sm:px-8 lg:grid-cols-12 lg:gap-10" :aria-label="t('page.about')">
      <div class="lg:col-span-7">
        <h2 class="eyebrow">{{ t('page.what') }}</h2>
        <p class="mt-4 max-w-[38rem] text-[1.35rem] leading-[1.45] sm:text-[1.55rem]">{{ p.pitch[lang] }}</p>

        <h2 class="eyebrow mt-12">{{ t('page.role') }}</h2>
        <p class="mt-4 max-w-[38rem] text-[1.2rem] leading-[1.5]">{{ p.role[lang] }}</p>

        <ul class="mt-8 max-w-[38rem] border-t border-line">
          <li v-for="(f, i) in p.features" :key="i" class="flex gap-4 border-b border-line py-3.5 text-[1.05rem] leading-snug">
            <span aria-hidden="true" class="mt-[0.55em] h-px w-4 shrink-0 bg-accent" />
            {{ f[lang] }}
          </li>
        </ul>
      </div>

      <aside class="lg:col-span-4 lg:col-start-9">
        <!-- The spec sheet, in the project's own colours -->
        <div class="spec overflow-hidden rounded-[18px] lg:sticky lg:top-24">
          <div class="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <h2 class="eyebrow">{{ t('page.spec') }}</h2>
            <p class="flex items-center gap-2 font-mono text-[0.75rem]"><span class="size-1.5 rounded-full" :class="dot[p.state]" />{{ p.status[lang] }}</p>
          </div>
          <dl class="px-6">
            <div v-for="row in specRows" :key="row.label" class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-line py-3.5 last:border-b-0">
              <dt class="pt-0.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">{{ row.label }}</dt>
              <dd class="text-[0.98rem] leading-snug">{{ row.value }}</dd>
            </div>
          </dl>
          <div class="border-t border-line px-6 py-5">
            <p class="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">{{ t('project.stack') }}</p>
            <ul class="mt-3 flex flex-wrap gap-1.5">
              <li v-for="s in p.stack" :key="s" class="spec-chip rounded-full px-3 py-1 text-[0.82rem] font-medium">{{ s }}</li>
            </ul>
          </div>
          <a
            v-if="p.url"
            :href="p.url"
            target="_blank"
            rel="noopener"
            class="group flex items-center justify-between bg-accent px-6 py-4 font-mono text-[0.78rem] uppercase tracking-[0.1em] text-paper transition-[filter] hover:brightness-110"
          >
            {{ t('project.visit') }}
            <span aria-hidden="true" class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </a>
        </div>
      </aside>
    </section>

    <!-- The real screens -->
    <section class="mx-auto mt-20 max-w-[90rem] overflow-x-clip px-4 sm:mt-28 sm:px-8" :aria-label="t('page.screens')">
      <h2 class="eyebrow mb-8 border-t border-line pt-6">{{ t('page.screens') }}</h2>
      <div class="space-y-16 sm:space-y-24">
        <component :is="scenes[p.id]" v-if="previews[p.id]" part="hero" />
        <component :is="scenes[p.id]" part="gallery" />
      </div>
    </section>

    <!-- A project like this? -->
    <section class="mx-auto mt-20 max-w-[90rem] px-4 sm:mt-28 sm:px-8">
      <div class="flex flex-wrap items-center justify-between gap-6 rounded-[10px] border border-line px-6 py-6 sm:px-8">
        <p class="max-w-[36rem] text-[1.3rem] leading-snug">{{ t('page.cta') }}</p>
        <a :href="`mailto:${person.email}`" class="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-[0.78rem] uppercase tracking-[0.1em] text-paper">
          {{ t('page.cta_button') }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </section>

    <!-- Next -->
    <nav :aria-label="t('page.more')" class="mx-auto mt-24 max-w-[90rem] px-4 pb-32 sm:mt-32 sm:px-8 sm:pb-40">
      <div class="flex items-center justify-between border-b border-line pb-3 font-mono text-[0.75rem] text-muted">
        <NuxtLink :to="localePath({ name: 'projets-slug', params: { slug: prev.slug } })" class="flex min-h-11 items-center transition-colors hover:text-ink">
          <span class="sr-only">{{ t('page.prev') }} :</span>← {{ prev.name[lang] }}
        </NuxtLink>
        <span>{{ t('page.next') }} →</span>
      </div>
      <NuxtLink :to="localePath({ name: 'projets-slug', params: { slug: next.slug } })" :data-swatch="next.id" class="group mt-8 flex items-end justify-between gap-6">
        <span
          :data-face="next.id"
          class="leading-[0.95] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-3"
          :class="next.id === 'kaplouf' ? 'text-[clamp(2.2rem,7vw,6rem)]' : 'text-[clamp(2.6rem,9vw,8rem)]'"
          :style="{ viewTransitionName: `project-${next.id}` }"
        >{{ next.name[lang] }}</span>
        <span aria-hidden="true" class="font-display text-[clamp(2rem,6vw,5rem)] transition-transform duration-500 group-hover:translate-x-2">→</span>
      </NuxtLink>
    </nav>
    <!-- Always a way back to the list -->
    <Transition name="back">
      <NuxtLink
        v-if="scrolled"
        :to="backTo"
        class="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-paper shadow-[0_14px_30px_-12px_rgb(0_0_0/0.55)]"
      >
        <span aria-hidden="true" class="transition-transform group-hover:-translate-x-0.5">←</span>
        {{ t('page.back') }}
      </NuxtLink>
    </Transition>
  </article>
</template>

<style scoped>
/* The museum label, as on the home page */
/* The spec sheet: a surface in the project's own palette */
.spec {
  background: color-mix(in oklab, var(--paper), var(--ink) 7%);
  border: 1px solid var(--line);
  box-shadow: 0 24px 50px -36px rgb(0 0 0 / 0.6);
}
/* On a light page, lift with white rather than darken */
[data-scene='mariage'] .spec {
  background: #fff;
  box-shadow: 0 24px 50px -36px rgb(0 0 0 / 0.3);
}
.spec-chip {
  background: color-mix(in oklab, var(--accent) 16%, transparent);
  border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
}
.back-enter-active,
.back-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.back-enter-from,
.back-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
