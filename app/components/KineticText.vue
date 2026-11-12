<script setup lang="ts">
/**
 * Text whose letters swell under the cursor: each letter's weight and width
 * (Anybody's variable axes) follow its distance to the pointer, eased so they
 * trail behind it. On touch screens a slow sweep crosses the text instead.
 * Purely decorative: give the readable text to assistive tech elsewhere.
 */
const props = withDefaults(
  defineProps<{
    text: string
    /** [weight, width] at rest */
    base?: [number, number]
    /** [weight, width] right under the cursor */
    peak?: [number, number]
    /** Reach of the effect, in px */
    radius?: number
    /** Sweep across the text on touch screens */
    sweep?: boolean
    /** Keep the line's overall width: letters near the cursor widen, the others narrow */
    conserve?: boolean
  }>(),
  { base: () => [760, 92], peak: () => [900, 140], radius: 240, sweep: true, conserve: false },
)

const root = ref<HTMLElement | null>(null)
const words = computed(() => props.text.split(' ').map((w) => [...w]))

let chars: HTMLElement[] = []
let state: { w: number; s: number }[] = []
let raf = 0
let visible = false
let touch = false
let px = -1e4
let py = -1e4
let started = 0

function frame(now: number) {
  raf = 0
  if (!root.value) return

  if (touch && props.sweep) {
    // A virtual cursor crossing the text, then a pause, then again.
    const box = root.value.getBoundingClientRect()
    const p = ((now - started) / 3600) % 1.6
    px = box.left - box.width * 0.2 + p * box.width * 1.4
    py = box.top + box.height / 2
  }

  const n = chars.length
  const tws = new Array<number>(n)
  const tss = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    const r = chars[i]!.getBoundingClientRect()
    const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py)
    let k = Math.max(0, 1 - d / props.radius)
    k = k * k * (3 - 2 * k)
    tws[i] = props.base[0] + (props.peak[0] - props.base[0]) * k
    tss[i] = props.base[1] + (props.peak[1] - props.base[1]) * k
  }
  if (props.conserve && n) {
    // Same average width as at rest, so the line keeps its length.
    const shift = props.base[1] - tss.reduce((a, b) => a + b, 0) / n
    for (let i = 0; i < n; i++) tss[i] = Math.min(150, Math.max(50, tss[i]! + shift))
  }

  let moving = false
  for (let i = 0; i < n; i++) {
    const el = chars[i]!
    const tw = tws[i]!
    const ts = tss[i]!
    const c = state[i]!
    c.w += (tw - c.w) * 0.16
    c.s += (ts - c.s) * 0.16
    if (Math.abs(tw - c.w) > 0.4 || Math.abs(ts - c.s) > 0.15) moving = true
    el.style.fontVariationSettings = `"wght" ${c.w.toFixed(1)}, "wdth" ${c.s.toFixed(1)}`
  }

  if (visible && (moving || (touch && props.sweep))) raf = requestAnimationFrame(frame)
}

function kick() {
  if (!raf && visible && !motionOff()) raf = requestAnimationFrame(frame)
}

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  chars = [...root.value.querySelectorAll<HTMLElement>('[data-c]')]
  state = chars.map(() => ({ w: props.base[0], s: props.base[1] }))
  touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  started = performance.now()

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    px = e.clientX
    py = e.clientY
    kick()
  }
  const onLeave = () => {
    px = py = -1e4
    kick()
  }
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    kick()
  })

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', kick, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  io.observe(root.value)

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('scroll', kick)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    io.disconnect()
    cancelAnimationFrame(raf)
  })
})
</script>

<template>
  <span
    ref="root"
    class="kinetic"
    aria-hidden="true"
    :style="{ '--k-wght': base[0], '--k-wdth': base[1] }"
  ><template v-for="(word, wi) in words" :key="wi"><span class="inline-block whitespace-nowrap"><span v-for="(c, ci) in word" :key="ci" data-c>{{ c }}</span></span>{{ wi < words.length - 1 ? ' ' : '' }}</template></span>
</template>
