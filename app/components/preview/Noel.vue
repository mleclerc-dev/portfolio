<script setup lang="ts">
/*
 * Le Noël des copains, interactive: spin the wheel, it stops on a name, and the gift tag
 * shows who you give to. The sender stays hidden, as in the app. On screen, it spins by
 * itself every few seconds until the visitor takes over.
 */
const { t } = useI18n()
const names = ['Lucie', 'Paul', 'Inès', 'Hugo', 'Jo', 'Marc']
const colors = ['#d7263d', '#1b5a43', '#f2b134', '#d7263d', '#1b5a43', '#f2b134']
const R = 46
const step = 360 / names.length
const slice = (i: number) => {
  const a0 = (i / names.length) * Math.PI * 2 - Math.PI / 2
  const a1 = ((i + 1) / names.length) * Math.PI * 2 - Math.PI / 2
  return `M50 50 L${50 + R * Math.cos(a0)} ${50 + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${50 + R * Math.cos(a1)} ${50 + R * Math.sin(a1)} Z`
}
const label = (i: number) => (i + 0.5) * step - 90
// Names on the left half are flipped so they read the right way up when the wheel is still.
const flip = (i: number) => label(i) > 90 && label(i) < 270
const labelTransform = (i: number) =>
  flip(i) ? `rotate(${label(i) + 180} 50 50) translate(-21 1.8)` : `rotate(${label(i)} 50 50) translate(21 1.8)`
const winner = ref<number | null>(null)

const rotation = ref(0)
const spinning = ref(false)
const result = ref<string | null>(null)
let last = -1
const root = ref<HTMLElement | null>(null)

function spin() {
  if (spinning.value) return
  let i = Math.floor(Math.random() * names.length)
  if (i === last) i = (i + 1) % names.length
  last = i
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // The pointer is at the top: bring slice i's centre there, after a few full turns.
  const target = (360 - (i + 0.5) * step + 360) % 360
  const current = ((rotation.value % 360) + 360) % 360
  rotation.value += (reduced ? 0 : 4 * 360) + ((target - current + 360) % 360)
  result.value = null
  winner.value = null
  spinning.value = true
  setTimeout(() => {
    spinning.value = false
    winner.value = i
    result.value = names[i]!
  }, reduced ? 0 : 3200)
}
useAutoplay(root, spin, 6800, 600)
</script>

<template>
  <div ref="root" class="@container size-full">
  <div class="relative flex size-full flex-col items-center justify-center gap-6 @md:flex-row @md:gap-8">
    <!-- Wheel -->
    <div class="relative w-[min(80%,17rem)] shrink-0 @md:w-[50%] @md:max-w-[22rem]">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        class="w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)]"
        :style="{ transform: `rotate(${rotation}deg)`, transition: 'transform 3.2s cubic-bezier(0.15, 0.85, 0.25, 1)' }"
      >
        <circle cx="50" cy="50" r="49" fill="#f4f7f5" />
        <path
          v-for="(n, i) in names"
          :key="n"
          :d="slice(i)"
          :fill="colors[i]"
          stroke="#f4f7f5"
          stroke-width="0.8"
        />
        <!-- Once drawn, the other names go into the shade -->
        <path
          v-for="(n, i) in names"
          :key="`s-${n}`"
          :d="slice(i)"
          fill="#06180f"
          class="transition-opacity duration-300"
          :opacity="winner === null || winner === i ? 0 : 0.55"
        />
        <text
          v-for="(n, i) in names"
          :key="`t-${n}`"
          x="50"
          y="50"
          :transform="labelTransform(i)"
          :text-anchor="flip(i) ? 'end' : 'start'"
          fill="#fffdf7"
          font-size="5.6"
          font-weight="700"
          font-family="Bricolage Grotesque, sans-serif"
        >{{ n }}</text>
        <circle cx="50" cy="50" r="7" fill="#fffdf7" /><circle cx="50" cy="50" r="3" fill="#b01c30" />
      </svg>
      <svg v-if="result" :key="`spark-${result}`" aria-hidden="true" viewBox="0 0 60 30" class="pv-spark absolute -top-5 left-1/2 w-[28%] -translate-x-1/2" fill="#f2b134">
        <path d="M10 18l1.6-4 1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6z" /><path d="M48 12l1.2-3 1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2z" /><circle cx="30" cy="6" r="1.8" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 16" class="absolute -top-1 left-1/2 w-[9%] min-w-5 -translate-x-1/2 drop-shadow-[0_2px_2px_rgb(0_0_0/0.4)]" :class="{ 'pv-tick': spinning }"><path d="M2 0 H18 L10 14 Z" fill="#fffdf7" /></svg>
    </div>

    <div class="flex w-full max-w-[16rem] flex-col items-center gap-4 @md:w-[44%] @md:max-w-[15rem] @md:items-start">
      <!-- Gift tag -->
      <div :key="result ?? '?'" :class="{ 'pv-pop': result }" class="relative w-full rotate-2 bg-[#fffdf7] py-3.5 pl-9 pr-3 text-[#13211a] shadow-[0_20px_30px_-18px_rgb(0_0_0/0.6)] [clip-path:polygon(1.6rem_0,100%_0,100%_100%,1.6rem_100%,0_50%)]">
        <span aria-hidden="true" class="absolute left-[0.75rem] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#b01c30] ring-[3px] ring-[#f2b134]" />
        <span class="block font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#55655c]">{{ t('preview.noel_for') }}</span>{{ ' ' }}
        <span data-face="noel" class="block truncate text-[clamp(1.5rem,6cqw,2.2rem)] leading-none text-[#b01c30]" aria-live="polite">{{ result ?? '?' }}</span>{{ ' ' }}
        <span class="mt-1.5 flex items-center gap-1.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-[#55655c]">{{ t('preview.noel_from') }} <span class="inline-block h-1.5 w-10 rounded-sm bg-[#13211a]" /></span>
      </div>
      <button
        type="button"
        class="h-11 cursor-pointer rounded-full bg-[#fffdf7] px-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[#0f3d2e] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        :disabled="spinning"
        @click="spin"
      >
        {{ spinning ? t('preview.noel_spinning') : result ? t('preview.noel_again') : t('preview.noel_spin') }}
      </button>
    </div>
  </div>
  </div>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  .pv-pop {
    animation: pv-pop 0.5s cubic-bezier(0.3, 1.5, 0.5, 1) both;
  }
  .pv-spark {
    animation: pv-spark 1.2s ease-out both;
  }
  /* fast at first, slowing down with the wheel */
  .pv-tick {
    transform-origin: 50% 0;
    animation: pv-tick 3.2s linear both;
  }
}
@keyframes pv-tick {
  0%, 4%, 8%, 12%, 16%, 20%, 25%, 31%, 38%, 46%, 56%, 68%, 84% { transform: rotate(0deg); }
  2%, 6%, 10%, 14%, 18%, 22%, 28%, 34%, 42%, 51%, 62%, 76%, 92% { transform: rotate(-22deg); }
  100% { transform: rotate(0deg); }
}
@keyframes pv-pop {
  /* Tailwind's rotate-2 / -translate-x-1/2 use the individual properties, so only transform here */
  from { transform: scale(0.85) translateY(6px); opacity: 0.4; }
  to { transform: none; opacity: 1; }
}
@keyframes pv-spark {
  0% { opacity: 0; transform: translateY(6px) scale(0.6); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-8px) scale(1.1); }
}
</style>
