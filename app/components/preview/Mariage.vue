<script setup lang="ts">
/*
 * Mariage, interactive: the countdown card, and a "what if" slider. Move the guest count
 * and the estimated cost, cost per guest and tables are recalculated, with the same
 * indicative prices as the app's landing page (90 at the meal + 40 at the reception = 17 120 €).
 * On screen, the slider moves by itself (numbers rolling) until the visitor grabs it.
 */
const { t, locale } = useI18n()
const guests = ref(90)
const RECEPTION_ONLY = 40
const tables = computed(() => Math.ceil(guests.value / 8))
const total = computed(() => 5000 + 85 * guests.value + 15 * (guests.value + RECEPTION_ONLY) + 20 * guests.value + 60 * tables.value)
const perGuest = computed(() => Math.round(total.value / (guests.value + RECEPTION_ONLY)))
// Every line of the estimate, as in the app's simulator: they add up to the total.
const lines = computed(() => [
  { key: 'catering', value: 85 * guests.value },
  { key: 'venue', value: 5000 },
  { key: 'drinks', value: 20 * guests.value },
  { key: 'reception', value: 15 * (guests.value + RECEPTION_ONLY) },
  { key: 'tables', value: 60 * tables.value },
])
// Replies so far, as on the app's dashboard
const rsvp = { yes: 74, no: 9, wait: 47 }
const invited = rsvp.yes + rsvp.no + rsvp.wait
const maxLine = computed(() => Math.max(...lines.value.map((l) => l.value)))
const root = ref<HTMLElement | null>(null)
const SCENARIOS = [120, 60, 145, 90]
let k = 0
let cancel = () => {}
const { stopped } = useAutoplay(root, () => {
  cancel()
  cancel = stepTowards(guests, SCENARIOS[k++ % SCENARIOS.length]!, 5, 45)
}, 3600, 900)
watch(stopped, (s) => s && cancel())
onBeforeUnmount(() => cancel())
const eur = (n: number) =>
  new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
</script>

<template>
  <div ref="root" class="grid size-full grid-cols-1 gap-3 font-[Plus_Jakarta_Sans,sans-serif] sm:grid-cols-[0.9fr_1.1fr]">
    <!-- Countdown card -->
    <div aria-hidden="true" class="relative hidden flex-col overflow-hidden rounded-[14px] bg-[#18181b] p-4 text-white sm:flex">
      <svg viewBox="0 0 120 80" class="absolute -right-6 -top-4 w-32 opacity-25" fill="none">
        <circle cx="44" cy="40" r="26" stroke="#fff" stroke-width="5" /><circle cx="76" cy="40" r="26" stroke="#fff" stroke-width="5" />
      </svg>
      <p class="pr-14 text-[0.68rem] text-white/75">{{ t('preview.mariage_date') }}</p>
      <p class="mt-3 text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums">233 <span class="text-[1rem] font-semibold tracking-normal">{{ t('preview.mariage_days') }}</span></p>
      <div class="mt-4 flex justify-between text-[0.68rem] text-white/75"><span>{{ t('preview.mariage_prep') }}</span><span>16 %</span></div>
      <div class="mt-1.5 h-1.5 rounded-full bg-white/15"><div class="pv-grow h-full w-[16%] rounded-full bg-[#3fbf94]" /></div>

      <!-- Next to-dos, as on the app's dashboard: they fill the card when it stretches -->
      <div class="mt-5 border-t border-white/10 pt-4">
        <p class="text-[0.68rem] text-white/75">{{ t('preview.mariage_todo') }}</p>
        <ul class="mt-2 space-y-1.5 text-[0.7rem]">
          <li class="flex items-center gap-2"><span class="grid size-3.5 place-items-center rounded-[4px] bg-[#3fbf94] text-[0.55rem] font-bold text-[#18181b]">✓</span><span class="text-white/60 line-through decoration-white/30">{{ t('preview.mariage_todo_1') }}</span></li>
          <li class="flex items-center gap-2"><span class="size-3.5 rounded-[4px] border border-white/30" />{{ t('preview.mariage_todo_2') }}</li>
          <li class="flex items-center gap-2"><span class="size-3.5 rounded-[4px] border border-white/30" />{{ t('preview.mariage_todo_3') }}</li>
        </ul>
      </div>

      <div class="mt-auto border-t border-white/10 pt-4">
        <p class="flex items-baseline justify-between text-[0.68rem] text-white/75">
          {{ t('preview.mariage_rsvp') }}
          <span class="text-[1.1rem] font-extrabold text-white tabular-nums">{{ rsvp.yes + rsvp.no }}<span class="text-[0.7rem] font-semibold text-white/60">/{{ invited }}</span></span>
        </p>
        <div class="mt-2 flex h-2 gap-0.5 overflow-hidden rounded-full">
          <span class="pv-grow bg-[#3fbf94]" :style="{ width: `${(rsvp.yes / invited) * 100}%` }" />
          <span class="bg-[#e0796b]" :style="{ width: `${(rsvp.no / invited) * 100}%` }" />
          <span class="flex-1 bg-white/15" />
        </div>
        <ul class="mt-2.5 space-y-1 text-[0.66rem] text-white/75">
          <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-[#3fbf94]" />{{ t('preview.mariage_yes') }}<span class="ml-auto tabular-nums text-white">{{ rsvp.yes }}</span></li>
          <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-[#e0796b]" />{{ t('preview.mariage_no') }}<span class="ml-auto tabular-nums text-white">{{ rsvp.no }}</span></li>
          <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-white/30" />{{ t('preview.mariage_wait') }}<span class="ml-auto tabular-nums text-white">{{ rsvp.wait }}</span></li>
        </ul>
      </div>
    </div>

    <!-- What if -->
    <div class="flex flex-col justify-between gap-4 rounded-[14px] border border-[#e2e1de] bg-white p-4 text-[#18181b]">
      <label class="block">
        <span class="flex items-baseline justify-between text-[0.8rem] font-semibold">
          {{ t('preview.mariage_guests') }}
          <span class="text-[1.15rem] font-extrabold tabular-nums">{{ guests }}</span>
        </span>
        <input v-model.number="guests" type="range" min="20" max="160" step="5" class="pv-range mt-2 w-full">
      </label>
      <div>
        <p class="text-[0.7rem] font-semibold text-[#5f5e66]">{{ t('preview.mariage_cost') }}</p>
        <p class="text-[1.9rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums" aria-live="polite">{{ eur(total) }}</p>
        <p class="mt-1.5 text-[0.7rem] text-[#5f5e66]">{{ t('preview.mariage_meta', { per: eur(perGuest), people: guests + RECEPTION_ONLY, tables }) }}</p>
      </div>
      <ul class="space-y-1.5 border-t border-[#efeeec] pt-3" aria-hidden="true">
        <li v-for="l in lines" :key="l.key">
          <span class="flex justify-between text-[0.68rem]"><span>{{ t(`preview.mariage_${l.key}`) }}</span><span class="font-semibold tabular-nums">{{ eur(l.value) }}</span></span>
          <span class="mt-1 block h-1 rounded-full bg-[#efeeec]"><span class="block h-full rounded-full bg-[#13856b] transition-[width] duration-300 ease-out" :style="{ width: `${(l.value / maxLine) * 100}%` }" /></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  .pv-grow {
    transform-origin: left;
    animation: pv-grow 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
}
@keyframes pv-grow {
  from { transform: scaleX(0); }
}
.pv-range {
  accent-color: #13856b;
  height: 1.5rem;
  cursor: pointer;
}
</style>
