<script setup lang="ts">
/*
 * Today's tide at Urville, as a curve: the sea level hour by hour, the high and low waters
 * with their times, and a dot for now that moves along it. Open-Meteo's modelled sea level:
 * indicative, not an official tide table.
 */
import type { Tide } from '~/composables/useUrville'

const props = defineProps<{ tide: Tide }>()
const { t } = useI18n()

const W = 240
const H = 96
const TOP = 18
const BOTTOM = 76
const range = computed(() => {
  const vs = props.tide.curve.map((p) => p.v)
  return { lo: Math.min(...vs), hi: Math.max(...vs) }
})
const X = (h: number) => (h / 24) * W
const Y = (v: number) => BOTTOM - ((v - range.value.lo) / (range.value.hi - range.value.lo || 1)) * (BOTTOM - TOP)

// A smooth line through the hourly points (Catmull-Rom turned into Bézier curves)
const line = computed(() => {
  const p = props.tide.curve.map((q) => [X(q.h), Y(q.v)] as const)
  if (p.length < 2) return ''
  let d = `M${p[0]![0]} ${p[0]![1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const [p0, p1, p2, p3] = [p[i - 1] ?? p[i]!, p[i]!, p[i + 1]!, p[i + 2] ?? p[i + 1]!]
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`
  }
  return d
})
const area = computed(() => (line.value ? `${line.value} L${W} ${H} L0 ${H} Z` : ''))
// Where now sits on the curve
const now = computed(() => {
  const h = Math.min(24, Math.max(0, props.tide.nowH))
  const c = props.tide.curve
  const i = Math.min(c.length - 2, Math.floor(h))
  const a = c[i]!
  const b = c[i + 1]!
  return { x: X(h), y: Y(a.v + (b.v - a.v) * (h - a.h)) }
})
</script>

<template>
  <figure class="absolute inset-0 m-0">
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="absolute inset-0 size-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="tide-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2f2ef" stop-opacity="0.14" />
          <stop offset="1" stop-color="#f2f2ef" stop-opacity="0.02" />
        </linearGradient>
        <clipPath id="tide-past"><rect x="0" y="0" :width="now.x" :height="H" /></clipPath>
      </defs>
      <g stroke="#f2f2ef" stroke-opacity="0.08" vector-effect="non-scaling-stroke">
        <path v-for="h in [6, 12, 18]" :key="h" :d="`M${X(h)} 4 V${H}`" vector-effect="non-scaling-stroke" />
      </g>
      <path :d="area" fill="url(#tide-fill)" />
      <path :d="line" fill="none" stroke="#f2f2ef" stroke-opacity="0.35" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      <!-- the day so far, in yellow -->
      <path :d="line" fill="none" stroke="#f2d04b" stroke-width="2" vector-effect="non-scaling-stroke" clip-path="url(#tide-past)" />
      <path :d="`M${now.x} 4 V${H}`" stroke="#f2d04b" stroke-opacity="0.45" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" />
    </svg>
    <!-- HTML on top, so text and dots keep their shape whatever the card's width -->
    <span class="tide-now absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2d04b]" :style="{ left: `${(now.x / W) * 100}%`, top: `${(now.y / H) * 100}%` }" />
    <span
      v-for="turn in tide.turns"
      :key="turn.h"
      class="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[0.6rem] tabular-nums text-[#b4b4ba]"
      :class="turn.kind === 'high' ? '-translate-y-[130%]' : 'translate-y-[30%]'"
      :style="{ left: `${Math.min(88, Math.max(12, (X(turn.h) / W) * 100))}%`, top: `${(Y(turn.level) / H) * 100}%` }"
    >{{ t(turn.kind === 'high' ? 'tide.hw' : 'tide.lw') }} {{ turn.time }}</span>
    <figcaption class="sr-only">{{ t('tide.chart') }}</figcaption>
  </figure>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  .tide-now {
    box-shadow: 0 0 0 0 rgb(242 208 75 / 0.6);
    animation: tide-now 2s ease-out infinite;
  }
}
@keyframes tide-now {
  to { box-shadow: 0 0 0 10px rgb(242 208 75 / 0); }
}
</style>
