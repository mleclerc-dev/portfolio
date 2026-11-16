<script setup lang="ts">
import { projects, type Locale } from '~/data/content'

/*
 * One post: the title on the drafting table, the text on a light sheet (long reading),
 * then the project it tells and a way to get in touch.
 */
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => locale.value as Locale)
const collection = useBlogCollection()
const path = computed(() => route.path.replace(/\/$/, ''))

const { data: note } = await useAsyncData(
  () => `post-${path.value}`,
  () => queryCollection(collection.value).path(path.value).first(),
  { watch: [path] },
)
if (!note.value || (note.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable', fatal: true })
}

const project = computed(() => projects.find((p) => p.slug === note.value?.project))
const minutes = computed(() => note.value?.minutes ?? readingMinutes(note.value?.body))

// Contents: the post's sections, shown beside the text on large screens, the current one highlighted
const toc = computed(() => (note.value?.body as { toc?: { links?: { id: string; text: string }[] } } | undefined)?.toc?.links ?? [])
const prose = ref<HTMLElement | null>(null)
const current = ref('')
// Reading progress, as a thin bar under the header
const progress = ref(0)
let spy: IntersectionObserver | undefined
let raf = 0
function measure() {
  raf = 0
  const el = prose.value
  if (!el) return
  const box = el.getBoundingClientRect()
  const span = box.height - window.innerHeight * 0.6
  progress.value = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - box.top) / (span > 0 ? span : 1)))
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(measure)
}
onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) current.value = e.target.id
    },
    { rootMargin: '-20% 0px -70% 0px' },
  )
  prose.value?.querySelectorAll('h2[id]').forEach((h) => spy!.observe(h))
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
  spy?.disconnect()
})
const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

useBlogFeed()
useSeoMeta({
  title: () => `${note.value?.title} · Maxime Leclerc`,
  description: () => note.value?.description,
  ogTitle: () => note.value?.title,
  ogDescription: () => note.value?.description,
  ogType: 'article',
  ...(note.value?.cover ? { ogImage: `${site}${note.value.cover}` } : {}),
  articlePublishedTime: () => note.value?.date,
  robots: () => (note.value?.draft ? 'noindex' : undefined),
})
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      key: 'ld-post',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: note.value?.title,
        description: note.value?.description,
        datePublished: note.value?.date,
        inLanguage: lang.value === 'fr' ? 'fr-FR' : 'en-GB',
        mainEntityOfPage: `${site}${path.value}`,
        ...(note.value?.cover ? { image: `${site}${note.value.cover}` } : {}),
        author: { '@id': `${site}/#person` },
      }),
    },
  ],
}))
</script>

<template>
  <article v-if="note">
    <div aria-hidden="true" class="pointer-events-none fixed inset-x-0 top-14 z-40 h-[3px] origin-left bg-[var(--yellow)]" :style="{ transform: `scaleX(${progress})` }" />
    <!-- Title on the drafting table -->
    <header data-scene="host" class="mx-auto max-w-[90rem] px-4 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
      <NuxtLink :to="localePath('/blog')" class="inline-flex min-h-11 items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink">
        <span aria-hidden="true">←</span> {{ t('blog.back') }}
      </NuxtLink>
      <p class="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-muted">
        <span class="text-accent">{{ t(`blog.${note.kind}`) }}</span>
        <time :datetime="note.date">{{ formatPostDate(note.date, locale) }}</time>
        <span>{{ t('blog.minutes', { n: minutes }) }}</span>
        <span v-if="note.draft" class="rounded-full bg-[var(--yellow)] px-2 py-0.5 normal-case tracking-normal text-[var(--on-yellow)]">{{ t('blog.draft') }}</span>
      </p>
      <h1 data-face="host" class="mt-5 max-w-[22ch] text-[clamp(2.2rem,5.6vw,4.8rem)] leading-[0.98]">{{ note.title }}</h1>
      <p class="mt-6 max-w-[46rem] text-[clamp(1.15rem,1.6vw,1.35rem)] leading-[1.5] text-ink/85">{{ note.description }}</p>
    </header>

    <!-- The text, on a light sheet -->
    <div class="tone-sheet border-y border-line">
      <div class="mx-auto max-w-[90rem] px-4 py-12 sm:px-8 sm:py-16">
        <img
          v-if="note.cover"
          :src="note.cover"
          :alt="note.coverAlt ?? ''"
          decoding="async"
          width="1600"
          height="900"
          class="mx-auto mb-12 aspect-[16/9] w-full max-w-[60rem] rounded-[14px] border border-line object-cover object-top shadow-[var(--surface-shadow)]"
        >
        <!-- The text, with its contents beside it on large screens -->
        <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_42rem_minmax(0,1fr)] lg:gap-12">
          <div ref="prose" class="lg:col-start-2">
            <ContentRenderer :value="note" class="post-prose mx-auto max-w-[42rem]" />
          </div>
          <nav v-if="toc.length >= 3" :aria-label="t('blog.toc')" class="hidden lg:block">
            <div class="sticky top-24">
              <p class="eyebrow">{{ t('blog.toc') }}</p>
              <ol class="mt-4 space-y-1 border-l border-line">
                <li v-for="l in toc" :key="l.id">
                  <a
                    :href="`#${l.id}`"
                    class="-ml-px block border-l-2 py-1.5 pl-4 text-[0.92rem] leading-snug transition-colors duration-200"
                    :class="current === l.id ? 'border-[var(--yellow)] text-ink' : 'border-transparent text-muted hover:text-ink'"
                    :aria-current="current === l.id ? 'location' : undefined"
                  >{{ l.text }}</a>
                </li>
              </ol>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- What it was, and a way in -->
    <footer data-scene="host" class="mx-auto max-w-[90rem] px-4 py-16 sm:px-8 sm:py-20">
      <div class="flex flex-wrap items-center justify-between gap-6 rounded-[16px] border border-line px-6 py-6 sm:px-8">
        <p class="max-w-[36rem] text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug">{{ t('blog.cta') }}</p>
        <div class="flex flex-wrap gap-3 font-mono text-[0.78rem] uppercase tracking-[0.1em]">
          <NuxtLink v-if="project" :to="localePath({ name: 'projets-slug', params: { slug: project.slug } })" class="inline-flex h-12 items-center gap-2 rounded-full border border-ink/40 bg-ink/[0.07] px-6 transition-colors duration-200 hover:border-ink">
            {{ t('blog.project') }} · {{ project.name[lang] }}
          </NuxtLink>
          <NuxtLink :to="`${localePath('/')}#contact`" class="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--yellow)] px-6 text-[var(--on-yellow)] transition-transform duration-200 hover:-translate-y-0.5">
            {{ t('hero.cta_contact') }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
          </NuxtLink>
        </div>
      </div>
    </footer>
  </article>
</template>
