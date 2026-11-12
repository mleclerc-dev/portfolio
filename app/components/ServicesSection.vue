<script setup lang="ts">
import { process, services, type Locale } from '~/data/content'

const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section id="services" data-scene="host" aria-labelledby="services-heading" class="scroll-mt-14 border-t border-line">
    <div class="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 sm:py-28">
    <div class="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
      <p class="eyebrow">{{ t('services.kicker') }}</p>
      <h2 id="services-heading" data-face="host" class="stretch-in mt-3 whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] uppercase leading-[0.9]">
          {{ t('services.heading') }}
        </h2>
      </div>
      <p class="max-w-[24rem] pb-2 text-[1.25rem] leading-snug text-muted">{{ t('services.intro') }}</p>
    </div>

    <ul class="grid gap-px overflow-hidden rounded-[16px] border border-line bg-line md:grid-cols-3">
      <li v-for="s in services" :key="s.title.fr" class="group flex flex-col bg-[var(--surface)] p-6 transition-colors hover:bg-[#1b1b1f] sm:p-8">
        <h3 class="font-display text-[1.6rem] font-bold leading-[1.1] tracking-[-0.01em] [font-stretch:88%]">{{ s.title[lang] }}</h3>
        <p class="mt-4 flex-1 text-[1.1rem] leading-[1.5] text-ink/95">{{ s.text[lang] }}</p>
        <p class="mt-8 flex items-center gap-2 font-mono text-[0.75rem] text-muted transition-colors group-hover:text-ink">
          <span aria-hidden="true" class="text-accent">→</span>{{ s.proof[lang] }}
        </p>
      </li>
    </ul>

    <!-- How a project goes -->
    <h3 class="eyebrow mt-20">{{ t('services.process') }}</h3>
    <ol class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="(step, i) in process" :key="step.title.fr" class="panel relative overflow-hidden p-5 sm:p-6">
        <span aria-hidden="true" class="grow-bar absolute inset-x-0 top-0 h-0.5 bg-accent" />
        <p class="font-mono text-[0.75rem] tabular-nums text-muted">{{ pad(i + 1) }}</p>
        <p class="mt-2 font-display text-[1.35rem] font-bold leading-tight [font-stretch:88%]">{{ step.title[lang] }}</p>
        <p class="mt-2 text-[1.05rem] leading-[1.5] text-ink/90">{{ step.text[lang] }}</p>
      </li>
    </ol>
    </div>
  </section>
</template>
