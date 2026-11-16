<script setup lang="ts">
const { t, locale } = useI18n()
const nextSlot = useNextSlot()

// The live sea under the title
const now = useUrville()
const sea = computed(() => (now.value ? now.value : null))
const seaLabel = computed(() => {
  const d = sea.value
  if (!d || d.wave == null) return ''
  const num = (n: number, digits = 0) => n.toFixed(digits).replace('.', locale.value === 'fr' ? ',' : '.')
  const tide = tideText(t, d.tide, locale.value) && `${t('tide.label').toLowerCase()} ${tideText(t, d.tide, locale.value)}`
  return [t('hero.sea', { wave: num(d.wave, 1) }), tide].filter(Boolean).join(' · ')
})
</script>

<template>
  <!-- One screen tall, whatever the screen: the content in the middle, the sea (and the surfer) at the bottom -->
  <section data-scene="host" class="flex min-h-[100svh] flex-col">
  <div class="hero-top mx-auto my-auto w-full max-w-[90rem] px-4 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-24">
    <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
      <!-- Who: name and trade, readable at a glance -->
      <p class="font-sans text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold normal-case leading-tight tracking-[-0.01em] text-ink">
        Maxime Leclerc<span class="text-[var(--yellow)]">,</span>&#32;<span class="font-normal text-ink/80">{{ t('hero.role') }}</span>
        <span class="mt-1 block font-mono text-[0.72rem] font-normal uppercase tracking-[0.1em] text-muted">{{ t('hero.where') }}</span>
      </p>
      <a href="#contact" class="group inline-flex items-center gap-2 rounded-full border border-[#4ade80]/35 bg-[#4ade80]/[0.08] px-3 py-1.5 text-[0.74rem] tracking-[0.08em] text-ink transition-colors duration-200 hover:border-[#4ade80]">
        <span class="relative flex size-2">
          <span class="absolute inset-0 animate-ping rounded-full bg-[#4ade80] motion-reduce:hidden" />
          <span class="blink relative size-2 rounded-full bg-[#4ade80]" />
        </span>
        {{ t('hero.available') }}<span v-if="nextSlot" class="hidden md:inline"> · {{ nextSlot }}</span>
      </a>
    </div>

    <!-- The title fills the width; letters swell under the cursor while the line keeps its length. -->
    <h1 class="hero-h1 mt-6 font-display uppercase leading-[0.84]">
      <span class="sr-only">{{ t('hero.title') }}</span>
      <span aria-hidden="true" class="block text-[clamp(2.6rem,13vw,13rem)]">
        <span class="rise block"><FitLine :vh="0.21" :max="150"><KineticText :text="t('hero.line_1')" conserve /></FitLine></span>{{ ' ' }}
        <span class="rise block [--rise-delay:120ms]">
          <FitLine :vh="0.21" :max="150"><KineticText :text="t('hero.line_2')" conserve />&#32;<KineticText :text="t('hero.someone')" conserve class="text-[var(--yellow)]" /></FitLine>
        </span>
      </span>
    </h1>

    <div class="hero-lede rise mt-10 grid items-end gap-x-10 gap-y-8 [--rise-delay:240ms] lg:grid-cols-[minmax(0,1fr)_auto]">
      <p class="max-w-[34rem] font-display text-[clamp(1.15rem,1.55vw,1.4rem)] font-medium leading-[1.3] tracking-[-0.005em] [font-stretch:92%]">
        {{ t('hero.lede') }}
      </p>
      <div class="flex flex-wrap gap-3 font-mono text-[0.78rem] uppercase tracking-[0.1em] max-sm:gap-2">
        <a href="#projets" class="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--yellow)] px-6 max-sm:w-full max-sm:justify-center max-sm:text-[0.75rem] text-[var(--on-yellow)] transition-transform duration-200 hover:-translate-y-0.5">
          {{ t('hero.cta_work') }} <span aria-hidden="true" class="transition-transform group-hover:translate-y-0.5">↓</span>
        </a>
        <a href="#contact" class="group inline-flex h-12 items-center gap-2 rounded-full border border-ink/40 bg-ink/[0.07] px-6 backdrop-blur-sm max-sm:w-full max-sm:justify-center max-sm:text-[0.75rem] transition-colors duration-200 hover:border-ink hover:bg-ink/[0.12]">
          {{ t('hero.cta_contact') }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  </div>

  <!-- The sea off Urville, live: the same drawing as the About card, full width -->
  <p v-if="seaLabel" class="hero-sea-label mx-auto flex w-full max-w-[90rem] shrink-0 items-start gap-2 px-4 pb-1 font-mono text-[0.7rem] leading-relaxed text-muted sm:hidden">
    <span class="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[#4ade80] blink" />{{ seaLabel }}
  </p>
  <div class="hero-sea relative h-36 shrink-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] sm:h-44">
    <SeaCanvas :wave="sea?.wave" :period="sea?.period" :wind="sea?.wind" :tide="sea?.tide?.ratio" :sky="sea?.sky" :rider="t('hero.me')" :splash="t('hero.splash')" :trick="t('hero.trick')" />
    <div v-if="seaLabel" class="pointer-events-none absolute inset-x-0 top-0 hidden sm:block">
      <p class="mx-auto flex max-w-[90rem] items-center justify-end gap-2 px-8 font-mono text-[0.7rem] text-muted">
        <span class="size-1.5 rounded-full bg-[#4ade80] blink" />{{ seaLabel }}
        <MotionToggle compact class="ml-1 text-muted" />
      </p>
    </div>
  </div>
  </section>
</template>

<style scoped>
/* Short screens (small laptops, landscape tablets, small phones): tighten, so the sea still shows */
@media (max-height: 820px) and (min-width: 640px) {
  .hero-top {
    padding-top: 4.5rem;
    padding-bottom: 1rem;
  }
  .hero-h1 {
    margin-top: 0.75rem;
  }
  .hero-lede {
    margin-top: 1.5rem;
  }
  .hero-sea {
    height: 8rem;
  }
}
@media (max-height: 760px) and (max-width: 639px) {
  .hero-top {
    padding-top: 4.25rem;
  }
  .hero-lede {
    margin-top: 1rem;
    row-gap: 1.25rem;
  }
  .hero-sea {
    height: 6.5rem;
  }
  .hero-sea-label {
    display: none;
  }
}
</style>
