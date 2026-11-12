<script setup lang="ts">
/**
 * One line of display type sized to fill its container's width.
 * Server-side, the line uses the inherited font-size; once fonts are loaded,
 * it is measured at 100px and scaled to the available width (capped by `max`
 * and by a share of the viewport height, so it never takes over the screen).
 */
const props = withDefaults(defineProps<{ max?: number; vh?: number }>(), { max: 300, vh: 0.3 })

const outer = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)

function fit() {
  const o = outer.value
  const i = inner.value
  if (!o || !i) return
  i.style.fontSize = '100px'
  const w = i.getBoundingClientRect().width
  if (!w) return
  // A little slack, so letters swelling under the cursor (or the touch sweep) never spill over the edge.
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const avail = o.clientWidth * (fine ? 0.975 : 0.93)
  const size = Math.min(props.max, window.innerHeight * props.vh, (100 * avail) / w)
  i.style.fontSize = `${size.toFixed(2)}px`
  fitted = i.getBoundingClientRect().width
}
let fitted = 0

let ro: ResizeObserver | null = null
let onLoaded: (() => void) | null = null
let textRo: ResizeObserver | null = null
onMounted(() => {
  // fonts.ready can resolve before the display face is even requested, and the swap from
  // the fallback face can land a frame after a font reports itself loaded: fit now, and
  // again two frames after each font load.
  const later = () => requestAnimationFrame(() => requestAnimationFrame(fit))
  onLoaded = later
  fit()
  document.fonts.ready.then(later)
  document.fonts.addEventListener('loadingdone', later)
  if (inner.value) document.fonts.load(`700 100px ${getComputedStyle(inner.value).fontFamily}`).then(later, () => {})
  ro = new ResizeObserver(fit)
  // The text's own width changing without us (a late font face swapping in) means a refit.
  textRo = new ResizeObserver(() => {
    if (inner.value && Math.abs(inner.value.getBoundingClientRect().width - fitted) > 1) fit()
  })
  if (inner.value) textRo.observe(inner.value)
  if (outer.value) ro.observe(outer.value)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  textRo?.disconnect()
  if (onLoaded) document.fonts.removeEventListener('loadingdone', onLoaded)
})
</script>

<template>
  <span ref="outer" class="block w-full">
    <span ref="inner" class="inline-block whitespace-nowrap"><slot /></span>
  </span>
</template>
