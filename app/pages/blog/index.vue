<script setup lang="ts">
/*
 * The blog: case studies and client questions, newest first.
 * Drafts only appear in `nuxt dev` (with a badge), never in the built site.
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const collection = useBlogCollection()

const { data: posts } = await useAsyncData(
  () => `blog-${collection.value}`,
  () => queryCollection(collection.value).order('date', 'DESC').all(),
  { watch: [collection] },
)
const visible = computed(() => (posts.value ?? []).filter((n) => showDrafts || !n.draft))

useSeoMeta({
  title: () => t('blog.meta_title'),
  description: () => t('blog.meta_description'),
  ogTitle: () => t('blog.meta_title'),
  ogDescription: () => t('blog.meta_description'),
  // An empty list has nothing to offer a search engine yet
  robots: () => (visible.value.length ? undefined : 'noindex'),
})
</script>

<template>
  <section data-scene="host" aria-labelledby="blog-heading" class="mx-auto max-w-[90rem] px-4 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-32">
    <div class="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <p class="eyebrow">{{ t('blog.kicker') }}</p>
        <h1 id="blog-heading" data-face="host" class="stretch-in mt-3 text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.9]">{{ t('blog.title') }}</h1>
      </div>
      <p class="max-w-[26rem] pb-2 text-[1.2rem] leading-snug text-muted">{{ t('blog.intro') }}</p>
    </div>

    <ul v-if="visible.length" class="grid gap-4 md:grid-cols-2">
      <li v-for="n in visible" :key="n.path">
        <article class="panel group relative flex h-full flex-col overflow-hidden">
          <img
            v-if="n.cover"
            :src="n.cover"
            :alt="n.coverAlt ?? ''"
            loading="lazy"
            decoding="async"
            class="aspect-[2/1] w-full border-b border-line object-cover object-top"
          >
          <div class="flex flex-1 flex-col p-6 sm:p-8">
            <p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-muted">
              <span class="text-accent">{{ t(`blog.${n.kind}`) }}</span>
              <span>{{ formatPostDate(n.date, locale) }}</span>
              <span v-if="n.minutes">{{ t('blog.minutes', { n: n.minutes }) }}</span>
              <span v-if="n.draft" class="rounded-full bg-[var(--yellow)] px-2 py-0.5 normal-case tracking-normal text-[var(--on-yellow)]">{{ t('blog.draft') }}</span>
            </p>
            <h2 class="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-[-0.01em] [font-stretch:88%]">
              <NuxtLink :to="localePath(n.path.replace(/^\/en/, ''))" class="after:absolute after:inset-0 after:content-['']">{{ n.title }}</NuxtLink>
            </h2>
            <p class="mt-3 flex-1 text-[1.05rem] leading-[1.55] text-ink/85">{{ n.description }}</p>
            <p class="mt-6 flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em]">
              {{ t('blog.read') }} <span aria-hidden="true" class="text-accent transition-transform duration-200 group-hover:translate-x-1">→</span>
            </p>
          </div>
        </article>
      </li>
    </ul>
    <p v-else class="panel p-8 text-[1.1rem] text-muted">{{ t('blog.empty') }}</p>
  </section>
</template>
