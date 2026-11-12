<script setup lang="ts">
import { career, companyWork, type Locale } from '~/data/content'

/*
 * Under the four projects: the applications built for employers, which can't be shown
 * on screen. One card per company, from the career data, each with a small drawing of
 * its field, and a way to the full career.
 */
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
// Years on the job, same count as the career section
const years = Math.floor(useState<number>('career-today', () => new Date().getFullYear() + new Date().getMonth() / 12).value - 2015)
const jobs = career.filter((s) => s.kind === 'work' && companyWork[s.place])
</script>

<template>
  <div class="mt-20 sm:mt-28">
    <div class="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div>
        <p class="eyebrow">{{ t('work.kicker') }}</p>
        <h3 data-face="host" class="mt-3 text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95]">{{ t('work.heading') }}</h3>
      </div>
      <p class="max-w-[30rem] pb-1 text-[1.1rem] leading-snug text-muted">{{ t('work.intro', { years }) }}</p>
    </div>

    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="job in jobs" :key="job.place" class="panel group flex flex-col overflow-hidden">
        <!-- A drawing of the field -->
        <div aria-hidden="true" class="relative h-28 border-b border-line bg-[#101013]">
          <svg viewBox="0 0 240 112" class="absolute inset-0 size-full" fill="none" stroke-linecap="round">
            <template v-if="companyWork[job.place]!.art === 'ledger'">
              <g stroke="#34343a"><path v-for="i in 5" :key="i" :d="`M24 ${16 + i * 16} H216`" /></g>
              <g fill="#f2f2ef" fill-opacity="0.85">
                <rect v-for="(h, i) in [30, 46, 38, 62, 54, 74]" :key="i" class="cw-bar" :style="{ animationDelay: `${i * 90}ms` }" :x="40 + i * 28" :y="96 - h" width="14" :height="h" rx="2" />
              </g>
              <path d="M47 60 L75 48 L103 54 L131 32 L159 38 L187 20" stroke="#f2d04b" stroke-width="2" class="cw-draw" />
            </template>
            <template v-else-if="companyWork[job.place]!.art === 'routes'">
              <path d="M20 86 C 70 86, 80 30, 130 30 S 200 70, 222 26" stroke="#34343a" stroke-width="6" />
              <path d="M20 86 C 70 86, 80 30, 130 30 S 200 70, 222 26" stroke="#f2d04b" stroke-width="2" stroke-dasharray="6 7" class="cw-dash" />
              <circle cx="20" cy="86" r="6" fill="#f2f2ef" /><circle cx="130" cy="30" r="5" fill="#f2f2ef" fill-opacity="0.6" /><circle cx="222" cy="26" r="6" fill="#f2d04b" />
              <rect x="150" y="70" width="34" height="18" rx="3" fill="#f2f2ef" fill-opacity="0.85" /><rect x="184" y="75" width="12" height="13" rx="2" fill="#f2f2ef" fill-opacity="0.6" />
              <circle cx="160" cy="91" r="3.5" fill="#101013" stroke="#f2f2ef" stroke-width="2" /><circle cx="188" cy="91" r="3.5" fill="#101013" stroke="#f2f2ef" stroke-width="2" />
            </template>
            <template v-else>
              <rect x="30" y="22" width="180" height="70" rx="8" stroke="#34343a" stroke-width="2" />
              <g v-for="i in 3" :key="i">
                <rect :x="42 + (i - 1) * 56" y="34" width="44" height="30" rx="4" fill="#f2f2ef" fill-opacity="0.12" />
                <path :d="`M${57 + (i - 1) * 56} 49 h14 M${64 + (i - 1) * 56} 42 v14`" stroke="#f2f2ef" stroke-opacity="0.7" stroke-width="3" />
                <rect :x="42 + (i - 1) * 56" y="70" width="28" height="6" rx="3" fill="#f2f2ef" fill-opacity="0.35" />
              </g>
              <g class="cw-cart"><path d="M176 70 h8 l6 14 h18 l4 -10 h-26" stroke="#f2d04b" stroke-width="2.4" stroke-linejoin="round" /><circle cx="193" cy="89" r="2.4" fill="#f2d04b" /><circle cx="205" cy="89" r="2.4" fill="#f2d04b" /></g>
            </template>
          </svg>
        </div>
        <div class="flex flex-1 flex-col p-5 sm:p-6">
          <p class="flex items-baseline justify-between gap-3">
            <span data-face="host" class="text-[1.5rem] leading-none tracking-[-0.03em]">{{ job.place }}</span>
            <span class="shrink-0 font-mono text-[0.72rem] text-muted">{{ job.period[lang] }}</span>
          </p>
          <p class="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--yellow)]">{{ companyWork[job.place]!.field[lang] }}</p>
          <p class="mt-4 flex-1 text-[0.98rem] leading-[1.55] text-ink/90">{{ companyWork[job.place]!.text[lang] }}</p>
          <p class="mt-5 font-mono text-[0.72rem] text-muted">{{ job.stack }}</p>
        </div>
      </li>

      <!-- The way to the full career -->
      <li class="sm:col-span-2 lg:col-span-1">
        <a
          href="#parcours"
          class="group flex h-full min-h-40 flex-col justify-between rounded-[16px] border border-dashed border-line p-6 transition-colors duration-200 hover:border-[var(--yellow)]"
        >
          <span class="text-[1.1rem] leading-snug text-ink/90">{{ t('work.more') }}</span>
          <span class="mt-6 flex items-center justify-between font-mono text-[0.75rem] uppercase tracking-[0.1em]">
            {{ t('work.career') }}
            <span aria-hidden="true" class="grid size-10 place-items-center rounded-full bg-[var(--yellow)] text-[var(--on-yellow)] transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  .cw-dash {
    animation: cw-dash 1.2s linear infinite;
  }
  @supports (animation-timeline: view()) {
    .cw-bar {
      transform-box: fill-box;
      transform-origin: bottom;
      animation: cw-bar linear both;
      animation-timeline: view();
      animation-range: entry 20% cover 35%;
    }
    .cw-draw {
      stroke-dasharray: 200;
      animation: cw-draw linear both;
      animation-timeline: view();
      animation-range: entry 30% cover 45%;
    }
  }
  .group:hover .cw-cart {
    transform: translateX(-6px);
  }
  .cw-cart {
    transition: transform 0.4s ease;
  }
}
@keyframes cw-dash {
  to { stroke-dashoffset: -13; }
}
@keyframes cw-bar {
  from { transform: scaleY(0); }
}
@keyframes cw-draw {
  from { stroke-dashoffset: 200; }
  to { stroke-dashoffset: 0; }
}
</style>
