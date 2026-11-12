<script setup lang="ts">
import type { NuxtError } from '#app'

/*
 * Lost at sea: the page doesn't exist (or something broke). The same sea as the home page,
 * the surfer still out there, and two ways back.
 */
const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const lost = computed(() => props.error?.statusCode === 404)
useSeoMeta({ title: () => (lost.value ? t('error.title_404') : t('error.title')), robots: 'noindex' })
const sea = useUrville()
const data = computed(() => (sea.value ? sea.value : null))
const home = () => clearError({ redirect: localePath('/') })
const work = () => clearError({ redirect: `${localePath('/')}#projets` })
</script>

<template>
  <NuxtLayout>
    <section data-scene="host" class="blueprint flex min-h-[100svh] flex-col">
      <div class="mx-auto my-auto w-full max-w-[90rem] px-4 pb-8 pt-24 sm:px-8">
        <p class="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-muted">{{ t('error.code', { code: error?.statusCode ?? 500 }) }}</p>
        <h1 data-face="host" class="mt-4 text-[clamp(3rem,11vw,9rem)] uppercase leading-[0.88]">
          {{ lost ? t('error.heading_404') : t('error.heading') }}
        </h1>
        <p class="mt-6 max-w-[34rem] text-[1.2rem] leading-[1.5] text-ink/90">{{ lost ? t('error.text_404') : t('error.text') }}</p>
        <div class="mt-8 flex flex-wrap gap-3 font-mono text-[0.78rem] uppercase tracking-[0.1em]">
          <button type="button" class="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--yellow)] px-6 text-[var(--on-yellow)] transition-transform duration-200 hover:-translate-y-0.5" @click="home">
            ← {{ t('error.home') }}
          </button>
          <button type="button" class="inline-flex h-12 items-center gap-2 rounded-full border border-ink/40 px-6 transition-colors duration-200 hover:border-ink" @click="work">
            {{ t('hero.cta_work') }}
          </button>
        </div>
      </div>
      <div class="relative h-40 shrink-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] sm:h-48">
        <SeaCanvas :wave="data?.wave" :period="data?.period" :wind="data?.wind" :tide="data?.tide?.ratio" :sky="data?.sky" :rider="t('error.rider')" :splash="t('hero.splash')" :trick="t('hero.trick')" />
      </div>
    </section>
  </NuxtLayout>
</template>
