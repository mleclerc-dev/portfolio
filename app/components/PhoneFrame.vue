<script setup lang="ts">
import type { Locale, Shot } from '~/data/content'

// A phone around a screenshot, or around a looping clip when the shot has one.
// The clip only plays while on screen, and never on its own under reduced motion.
const props = defineProps<{ shot: Shot; eager?: boolean }>()
const { locale } = useI18n()
const lang = computed(() => locale.value as Locale)

const video = ref<HTMLVideoElement | null>(null)
const reduced = ref(false)

onMounted(() => {
  const v = video.value
  if (!v) return
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) return
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) v.play().catch(() => {})
    else v.pause()
  }, { rootMargin: '200px' })
  io.observe(v)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <div class="phone">
    <video
      v-if="props.shot.video"
      ref="video"
      :poster="shot.src"
      :width="shot.width"
      :height="shot.height"
      :aria-label="shot.alt[lang]"
      :controls="reduced"
      muted
      loop
      playsinline
      preload="none"
    >
      <source :src="props.shot.video" type="video/mp4">
    </video>
    <img
      v-else
      :src="shot.src"
      :width="shot.width"
      :height="shot.height"
      :alt="shot.alt[lang]"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
    >
  </div>
</template>
