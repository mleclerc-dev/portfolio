<script setup lang="ts">
import { projects, type Locale } from '~/data/content'

/*
 * One note: the title on the drafting table, the text on a light sheet (long reading),
 * then the project it tells and a way to get in touch.
 */
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => locale.value as Locale)
const collection = useNotesCollection()
const path = computed(() => route.path.replace(/\/$/, ''))

const { data: note } = await useAsyncData(
  () => `note-${path.value}`,
  () => queryCollection(collection.value).path(path.value).first(),
  { watch: [path] },
)
if (!note.value || (note.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Note introuvable', fatal: true })
}

const project = computed(() => projects.find((p) => p.slug === note.value?.project))
const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

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
      key: 'ld-note',
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
    <!-- Title on the drafting table -->
    <header data-scene="host" class="mx-auto max-w-[90rem] px-4 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
      <NuxtLink :to="localePath('/notes')" class="inline-flex min-h-11 items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink">
        <span aria-hidden="true">←</span> {{ t('notes.back') }}
      </NuxtLink>
      <p class="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-muted">
        <span class="text-accent">{{ t(`notes.${note.kind}`) }}</span>
        <time :datetime="note.date">{{ formatNoteDate(note.date, locale) }}</time>
        <span v-if="note.minutes">{{ t('notes.minutes', { n: note.minutes }) }}</span>
        <span v-if="note.draft" class="rounded-full bg-[var(--yellow)] px-2 py-0.5 normal-case tracking-normal text-[var(--on-yellow)]">{{ t('notes.draft') }}</span>
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
          class="mx-auto mb-12 w-full max-w-[60rem] rounded-[14px] border border-line object-cover shadow-[var(--surface-shadow)]"
        >
        <ContentRenderer :value="note" class="note-prose mx-auto max-w-[42rem]" />
      </div>
    </div>

    <!-- What it was, and a way in -->
    <footer data-scene="host" class="mx-auto max-w-[90rem] px-4 py-16 sm:px-8 sm:py-20">
      <div class="flex flex-wrap items-center justify-between gap-6 rounded-[16px] border border-line px-6 py-6 sm:px-8">
        <p class="max-w-[36rem] text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug">{{ t('notes.cta') }}</p>
        <div class="flex flex-wrap gap-3 font-mono text-[0.78rem] uppercase tracking-[0.1em]">
          <NuxtLink v-if="project" :to="localePath(`/projets/${project.slug}`)" class="inline-flex h-12 items-center gap-2 rounded-full border border-ink/40 bg-ink/[0.07] px-6 transition-colors duration-200 hover:border-ink">
            {{ t('notes.project') }} · {{ project.name[lang] }}
          </NuxtLink>
          <NuxtLink :to="`${localePath('/')}#contact`" class="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--yellow)] px-6 text-[var(--on-yellow)] transition-transform duration-200 hover:-translate-y-0.5">
            {{ t('hero.cta_contact') }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
          </NuxtLink>
        </div>
      </div>
    </footer>
  </article>
</template>
