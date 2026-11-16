<script setup lang="ts">
import { career, type Locale } from '~/data/content'

const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)

// Bars are drawn to scale: their length is the time spent there.
// Computed once on the server and reused on the client, so hydration matches.
const today = useState('career-today', () => {
  const now = new Date()
  return now.getFullYear() + now.getMonth() / 12
}).value
const from = 2011
const span = today - from
const pos = (year: number) => `${((year - from) / span) * 100}%`
const width = (start: number, end: number | null) => `${(((end ?? today) - start) / span) * 100}%`

const ticks = [2011, 2014, 2017, 2020, 2023, 2026]
// Every year gets a mark on the axis and on each bar; the labelled ones are bigger.
const marks = Array.from({ length: Math.floor(today) - from + 1 }, (_, i) => from + i)
// Year labels, leaving room for "today" at the end of the axis
const labels = ticks.filter((y) => today - y > 1.2)
// Big waves for everyone, a little bigger the longer the time there: ~1.35 for a year, ~1.75 for nine.
const swell = (start: number, end: number | null) => Math.min(1.75, 1.3 + ((end ?? today) - start) * 0.05)
const years = Math.floor(today - 2015)
const cicd = Math.round(today - 2018.1)
</script>

<template>
  <section
    id="parcours"
    data-scene="host"
    aria-labelledby="career-heading"
    class="scroll-mt-14"
  >
    <div class="mx-auto max-w-[90rem] px-4 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div>
        <p class="eyebrow">{{ t('career.kicker') }}</p>
        <h2 id="career-heading" data-face="host" class="stretch-in mt-3 whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] uppercase leading-[0.9]">
          {{ t('career.heading') }}
        </h2>
      </div>
      <p class="max-w-[24rem] pb-2 text-[1.25rem] leading-snug text-muted">
        {{ t('career.summary', { years, cicd }) }}
      </p>
    </div>

    <div class="panel mt-14 px-5 pt-2 sm:px-8 md:pt-7">
    <!-- The time axis, aligned with the bars, with a legend -->
    <div aria-hidden="true" class="grid gap-x-8 gap-y-4 pt-5 md:grid-cols-[12rem_minmax(0,1fr)] md:items-end md:pt-0">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
        <span class="flex items-center gap-2"><span class="h-1.5 w-5 rounded-full bg-ink" />{{ t('career.legend_work') }}</span>
        <span class="flex items-center gap-2"><span class="h-1.5 w-5 rounded-full border border-muted" />{{ t('career.legend_school') }}</span>
      </div>
      <div class="relative h-10">
        <span
          v-for="y in labels"
          :key="y"
          class="absolute top-0 -translate-x-1/2 font-mono text-[0.7rem] tabular-nums text-muted"
          :class="{ 'max-lg:hidden': today - y < 4 }"
          :style="{ left: pos(y) }"
        >{{ y }}</span>
        <span class="absolute right-0 top-0 font-mono text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ink">{{ t('career.today') }}</span>
        <span class="absolute inset-x-0 bottom-0 h-px bg-ink/35" />
        <span
          v-for="y in marks"
          :key="`m-${y}`"
          class="absolute bottom-0 w-px"
          :class="ticks.includes(y) ? 'h-3 bg-ink/50' : 'h-1.5 bg-ink/25'"
          :style="{ left: pos(y) }"
        />
        <span class="absolute bottom-0 right-0 size-3 translate-x-1/2 translate-y-1/2 rounded-full bg-[#e0b52a] ring-4 ring-[var(--surface)]" />
      </div>
    </div>

    <ol class="md:mt-3">
      <li
        v-for="step in career"
        :key="step.place"
        class="grid gap-x-8 gap-y-3 border-b border-line py-7 last:border-b-0 md:grid-cols-[12rem_minmax(0,1fr)]"
      >
        <div>
          <p class="font-mono text-[0.78rem] uppercase tracking-[0.06em] text-muted">{{ step.period[lang] }}</p>
          <p v-if="step.kind === 'school'" class="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-muted">
            {{ t('career.school') }}
          </p>
        </div>

        <div>
          <!-- To-scale bar -->
          <div aria-hidden="true" class="surf-track relative mb-5 h-2 rounded-full bg-line/60" :style="{ marginTop: `${Math.round(52 * swell(step.start, step.end) - 8)}px` }">
            <!-- year marks, so each bar reads as a stretch of time -->
            <span v-for="y in marks" :key="y" class="absolute top-1/2 h-3.5 w-px -translate-y-1/2 bg-ink/15" :style="{ left: pos(y) }" />
            <span
              class="grow-bar absolute inset-y-0 rounded-full"
              :class="step.kind === 'work' ? 'bg-ink' : 'border border-muted bg-transparent'"
              :style="{ left: pos(step.start), width: width(step.start, step.end) }"
            />
            <!-- The bar ends in a breaking wave, a surfer on its face: it rides to the end as the bar grows -->
            <span class="pointer-events-none absolute inset-y-0" :style="{ left: pos(step.start), width: width(step.start, step.end) }">
              <span class="surf-rider absolute bottom-0 block -translate-x-[97%]" :style="{ width: `${(106 * swell(step.start, step.end)).toFixed(1)}px` }">
                <svg viewBox="-34 0 106 52" class="block w-full overflow-visible [mask-image:linear-gradient(to_right,transparent,#000_42%)]" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <!-- the wave rising out of the bar: it heaves, its lip curls -->
                  <g class="surf-heave">
                    <path
                      d="M-34 52 L-34 44 C-12 44 6 43 19 37 C31 31 38 18 49 12 C56 8 63.5 8.2 66.5 12.5 C61 20 56 32 57.5 52 Z"
                      :fill="step.kind === 'work' ? 'var(--ink)' : 'var(--surface)'"
                      stroke="var(--ink)"
                      stroke-width="1.6"
                    />
                    <path class="surf-foam" d="M6 45 C22 40 35 30 46 18" stroke-width="1.4" stroke-dasharray="3 5" :stroke="step.kind === 'work' ? 'var(--surface)' : 'var(--ink)'" stroke-opacity="0.45" />
                    <path class="surf-lip" d="M57 9.6 C63.5 7.2 69.2 10.2 69 16 C68.8 21.6 64 24.6 60.9 21.8 C58.6 19.7 60.4 15.9 63.8 16.6" stroke="var(--ink)" stroke-width="3.2" />
                  </g>
                  <!-- spray off the board -->
                  <g fill="var(--ink)">
                    <circle class="surf-spray" cx="22" cy="30" r="1.3" />
                    <circle class="surf-spray" cx="18" cy="27" r="1" style="animation-delay: -0.35s" />
                    <circle class="surf-spray" cx="24" cy="25" r="0.9" style="animation-delay: -0.7s" />
                    <circle class="surf-spray" cx="15" cy="31" r="0.8" style="animation-delay: -1.05s" />
                  </g>
                  <!-- board and surfer, riding the heave -->
                  <g class="surf-bob">
                    <path d="M25.5 33.5 L46.5 23.5" stroke="#e0b52a" stroke-width="3.4" />
                    <g stroke="var(--ink)" stroke-width="2.3">
                      <path d="M31 30.5 L33.6 24.6 L36.4 21 M40.6 26.4 L38.8 22.6 L36.4 21" />
                      <path d="M36.4 21 L38 13" />
                      <path d="M37.6 14.6 L30.6 17.4 M37.6 14.6 L45.6 11.2" />
                    </g>
                    <circle cx="39.6" cy="8.8" r="2.7" fill="var(--ink)" />
                  </g>
                </svg>
              </span>
            </span>
          </div>

          <div class="grid gap-x-8 gap-y-2 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <div>
              <h3 data-face="host" class="text-[1.7rem] leading-tight tracking-[-0.035em]">{{ step.place }}</h3>
              <p class="text-muted">{{ step.title[lang] }}</p>
            </div>
            <div>
              <p class="text-[1.15rem]">{{ step.text[lang] }}</p>
              <p v-if="step.stack" class="mt-2 font-mono text-[0.75rem] text-muted">{{ step.stack }}</p>
            </div>
          </div>
        </div>
      </li>
    </ol>
    </div>
  </div>
  </section>
</template>
