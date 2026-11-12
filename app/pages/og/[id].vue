<script setup lang="ts">
import { projects, type Locale } from '~/data/content'

/*
 * The share cards (Open Graph images), 1200 × 630, one per page and language: drawn here,
 * then screenshotted into public/og/ (see the og script). Not meant for visitors: noindex,
 * and kept out of the sitemap.
 */
definePageMeta({ layout: false })
const route = useRoute()
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
const p = computed(() => projects.find((x) => x.slug === route.params.id) ?? null)
useHead(() => ({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  htmlAttrs: p.value ? { 'data-page-scene': p.value.id } : {},
}))
const previews: Partial<Record<string, ReturnType<typeof resolveComponent>>> = {
  taxi: resolveComponent('PreviewTaxi'),
  mariage: resolveComponent('PreviewMariage'),
  noel: resolveComponent('PreviewNoel'),
}
// A still sea for the bottom of the home card (no canvas: the screenshot must be predictable)
const wave = (y: number, a: number, len: number, phase: number) => {
  let d = `M0 ${y}`
  for (let x = 0; x <= 1200; x += 10) d += ` L${x} ${(y + Math.sin(x / len + phase) * a).toFixed(1)}`
  return d
}
</script>

<template>
  <div class="og relative overflow-hidden" :data-scene="p?.id ?? 'host'" :class="p ? 'scene' : 'blueprint'">
    <!-- Home -->
    <template v-if="!p">
      <div class="absolute inset-x-[72px] top-[64px] flex items-center justify-between font-mono text-[18px] uppercase tracking-[0.12em] text-[#b4b4ba]">
        <span class="text-[44px] normal-case tracking-normal text-[#f2f2ef]"><BrandMark /></span>
        <span class="flex items-center gap-3 rounded-full border border-[#4ade80]/40 bg-[#4ade80]/10 px-5 py-2 text-[#f2f2ef]"><span class="size-2.5 rounded-full bg-[#4ade80]" />{{ t('hero.available') }}</span>
      </div>
      <p data-face="host" class="absolute inset-x-[72px] top-[170px] text-[112px] uppercase leading-[0.86] text-[#f2f2ef]">
        {{ t('hero.line_1') }}<br>{{ t('hero.line_2') }} <span class="text-[#f2d04b]">{{ t('hero.someone') }}</span>
      </p>
      <p class="absolute left-[72px] top-[420px] text-[30px] font-semibold text-[#f2f2ef]">
        Maxime Leclerc<span class="text-[#f2d04b]">,</span> <span class="font-normal text-[#f2f2ef]/80">{{ t('hero.role') }}</span>
      </p>
      <svg viewBox="0 0 1200 140" class="absolute inset-x-0 bottom-0 h-[140px] w-full" fill="none">
        <path :d="`${wave(40, 9, 70, 0)} L1200 140 L0 140 Z`" fill="#141416" />
        <path :d="wave(40, 9, 70, 0)" stroke="#f2f2ef" stroke-opacity="0.2" stroke-width="2" />
        <path :d="`${wave(66, 12, 90, 1.4)} L1200 140 L0 140 Z`" fill="#18181b" />
        <path :d="wave(66, 12, 90, 1.4)" stroke="#f2d04b" stroke-width="2.4" />
        <path :d="`${wave(98, 10, 80, 2.6)} L1200 140 L0 140 Z`" fill="#1d1d21" />
        <path :d="wave(98, 10, 80, 2.6)" stroke="#f2f2ef" stroke-opacity="0.35" stroke-width="2" />
      </svg>
    </template>

    <!-- A project -->
    <template v-else>
      <div class="absolute inset-y-[64px] left-[72px] flex w-[560px] flex-col">
        <p class="font-mono text-[18px] uppercase tracking-[0.12em] text-muted">{{ t(`bento.${p.origin}`) }} · {{ p.kind[lang] }}</p>
        <p :data-face="p.id" class="mt-6 text-[96px] leading-[0.92]" :class="{ 'text-[84px]': p.id === 'noel' || p.id === 'taxi' }">{{ p.name[lang] }}</p>
        <p class="mt-6 text-[32px] leading-[1.2] text-accent">{{ p.tagline[lang] }}</p>
        <p class="mt-auto flex items-center gap-4 text-[24px]">
          <span class="text-[36px]"><BrandMark /></span>
          <span>Maxime Leclerc <span class="text-muted">· {{ t('hero.role') }}</span></span>
        </p>
      </div>
      <div class="absolute inset-y-[56px] right-[56px] w-[500px]">
        <component :is="previews[p.id]" v-if="previews[p.id]" />
        <img v-else src="/projects/kaplouf-soldier.webp" alt="" class="absolute inset-0 m-auto w-[440px] drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]">
      </div>
    </template>
  </div>
</template>

<style scoped>
.og {
  width: 1200px;
  height: 630px;
}
</style>
