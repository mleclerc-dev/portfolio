<script setup lang="ts">
/*
 * Carnet du mariage, interactive, in the product's own colours (ink, paper, wedding red).
 * Left, a couple's notebook as on carnetdumariage.com: the guest count and the households'
 * replies; every other beat, a household answers and the list catches up.
 * Right, the app's "what if" simulator: move the guest count and the cost, cost per guest
 * and tables are recalculated, with the landing page's indicative prices
 * (90 at the meal + 40 at the reception = 17 120 €).
 * On screen, it plays by itself until the visitor grabs the slider.
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
const maxLine = computed(() => Math.max(...lines.value.map((l) => l.value)))

// The notebook, as on the product's home page; "Bande du lycée" (3 people) replies in turn.
const replied = ref(false)
const INVITED = 126
const counts = computed(() => (replied.value ? { yes: 91, wait: 28 } : { yes: 88, wait: 31 }))
const households = computed(() => [
  { initials: 'D', name: t('preview.mariage_h1'), people: 'Julien, Laura, Léo +1', status: 'yes' },
  { initials: 'B', name: t('preview.mariage_h2'), people: 'Chloé, Hugo, Sarah', status: replied.value ? 'yes' : 'wait' },
  { initials: 'L', name: t('preview.mariage_h3'), people: 'Monique, Henri', status: 'yes' },
  { initials: 'C', name: t('preview.mariage_h4'), people: 'Claire, Antoine', status: 'no' },
])
const statusDot = { yes: 'bg-[#1f8a4c]', wait: 'bg-[#f0a020]', no: 'bg-[#c92f37]' } as Record<string, string>
const statusText = { yes: 'text-[#1a1b25]', wait: 'text-[#1a1b25]', no: 'text-[#c92f37]' } as Record<string, string>

const root = ref<HTMLElement | null>(null)
const SCENARIOS = [120, 60, 145, 90]
let k = 0
let cancel = () => {}
const { stopped } = useAutoplay(root, () => {
  cancel()
  replied.value = k % 2 === 0
  cancel = stepTowards(guests, SCENARIOS[k++ % SCENARIOS.length]!, 5, 45)
}, 3600, 900)
watch(stopped, (s) => s && cancel())
onBeforeUnmount(() => cancel())
const eur = (n: number) =>
  new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
</script>

<template>
  <div ref="root" class="cdm grid size-full grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
    <!-- The couple's notebook -->
    <div aria-hidden="true" class="relative hidden flex-col overflow-hidden rounded-[14px] bg-white text-[#1a1b25] shadow-[0_18px_40px_-28px_rgb(26_27_37/0.45)] ring-1 ring-[#dcdfe5] sm:flex">
      <div class="flex items-center gap-2 border-b border-[#eceef2] px-3.5 py-2.5">
        <svg viewBox="0 0 64 64" class="size-5 shrink-0"><rect width="64" height="64" rx="15" fill="#c92f37" /><path d="M32 50.5 15 34a10 10 0 0 1 0-14.2 10 10 0 0 1 14.2 0L32 22.6l2.8-2.8a10 10 0 0 1 14.2 0 10 10 0 0 1 0 14.2z" fill="#fff" /></svg>
        <p class="min-w-0 text-[0.72rem] font-semibold leading-tight">Camille &amp; Alex<span class="block truncate text-[0.6rem] font-normal text-[#636b7b]">{{ t('preview.mariage_date') }}</span></p>
        <p class="ml-auto flex shrink-0 items-center gap-1 text-[0.62rem] font-medium"><span class="size-1.5 rounded-full bg-[#1f8a4c]" />{{ t('preview.mariage_synced') }}</p>
      </div>
      <div class="px-3.5 pt-3">
        <p class="text-[0.66rem] text-[#636b7b]">{{ t('preview.mariage_invited') }}</p>
        <div class="flex items-end justify-between gap-2">
          <p class="text-[1.9rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">{{ INVITED }}</p>
          <p class="text-right text-[0.6rem] leading-tight text-[#636b7b]">{{ t('preview.mariage_split', counts) }}</p>
        </div>
        <div class="mt-2 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-[#eceef2]">
          <span class="pv-grow bg-[#1f8a4c] transition-[width] duration-500" :style="{ width: `${(counts.yes / INVITED) * 100}%` }" />
          <span class="bg-[#f0a020] transition-[width] duration-500" :style="{ width: `${(counts.wait / INVITED) * 100}%` }" />
        </div>
      </div>
      <ul class="m-3.5 mt-3 divide-y divide-[#eceef2] rounded-[10px] ring-1 ring-[#e4e7ec]">
        <li v-for="h in households" :key="h.initials" class="flex items-center gap-2.5 px-2.5 py-2">
          <span class="grid size-6 shrink-0 place-items-center rounded-full ring-1 ring-[#dcdfe5] text-[0.52rem] font-semibold text-[#636b7b]">{{ h.initials }}</span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[0.7rem] font-semibold leading-tight">{{ h.name }}</span>
            <span class="block truncate text-[0.6rem] leading-tight text-[#636b7b]">{{ h.people }}</span>
          </span>
          <span class="flex shrink-0 items-center gap-1 text-[0.6rem] font-medium" :class="statusText[h.status]">
            <span class="size-1.5 rounded-full transition-colors duration-500" :class="statusDot[h.status]" />{{ t(`preview.mariage_${h.status}`) }}
          </span>
        </li>
      </ul>
      <!-- A household has just replied -->
      <div class="mt-auto px-3.5 pb-3.5">
        <p class="cdm-toast flex items-center gap-2 rounded-[10px] bg-white px-2.5 py-2 shadow-[0_10px_24px_-14px_rgb(26_27_37/0.5)] ring-1 ring-[#e4e7ec]" :class="{ 'is-on': replied }">
          <span class="grid size-5 shrink-0 place-items-center rounded-full bg-[#dff3e6] text-[0.6rem] text-[#1f8a4c]">✓</span>
          <span class="min-w-0">
            <span class="block truncate text-[0.66rem] font-semibold leading-tight">{{ t('preview.mariage_toast') }}</span>
            <span class="block text-[0.58rem] leading-tight text-[#636b7b]">{{ t('preview.mariage_toast_sub') }}</span>
          </span>
        </p>
      </div>
    </div>

    <!-- What if: the app's simulator panel -->
    <div class="flex flex-col justify-between gap-4 rounded-[14px] bg-[#1d1e2c] p-4 text-white shadow-[0_18px_40px_-24px_rgb(26_27_37/0.7)]">
      <label class="block">
        <span class="flex items-baseline justify-between text-[0.78rem] font-semibold">
          {{ t('preview.mariage_guests') }}
          <span class="text-[1.15rem] font-extrabold tabular-nums">{{ guests }}</span>
        </span>
        <input v-model.number="guests" type="range" min="20" max="160" step="5" class="pv-range mt-2 w-full">
      </label>
      <div>
        <p class="text-[0.68rem] font-medium text-white/65">{{ t('preview.mariage_cost') }}</p>
        <p class="text-[1.9rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums" aria-live="polite">{{ eur(total) }}</p>
        <p class="mt-1.5 text-[0.68rem] text-[#ff8a80]">{{ t('preview.mariage_meta', { per: eur(perGuest), people: guests + RECEPTION_ONLY, tables }) }}</p>
      </div>
      <ul class="space-y-1.5 border-t border-white/10 pt-3" aria-hidden="true">
        <li v-for="l in lines" :key="l.key">
          <span class="flex justify-between text-[0.66rem] text-white/85"><span>{{ t(`preview.mariage_${l.key}`) }}</span><span class="font-semibold tabular-nums text-white">{{ eur(l.value) }}</span></span>
          <span class="mt-1 block h-1 rounded-full bg-white/10"><span class="block h-full rounded-full bg-[#ff8a80] transition-[width] duration-300 ease-out" :style="{ width: `${(l.value / maxLine) * 100}%` }" /></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.cdm {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
}
@media (prefers-reduced-motion: no-preference) {
  .pv-grow {
    transform-origin: left;
    animation: pv-grow 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
  .cdm-toast {
    transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
}
@keyframes pv-grow {
  from { transform: scaleX(0); }
}
/* Hidden until a household replies */
.cdm-toast:not(.is-on) {
  opacity: 0;
  transform: translateY(0.5rem);
}
.pv-range {
  accent-color: #e5484d;
  height: 1.5rem;
  cursor: pointer;
}
</style>
