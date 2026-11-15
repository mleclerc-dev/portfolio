<script setup lang="ts">
import type { Locale, Shot } from '~/data/content'

defineProps<{ shot: Shot; label: string }>()
const { locale } = useI18n()
const lang = computed(() => locale.value as Locale)
</script>

<template>
  <figure class="browser">
    <figcaption class="flex h-9 items-center gap-3 border-b border-black/[0.07] bg-[#f1f0ed] px-4 sm:h-10">
      <span aria-hidden="true" class="flex gap-1.5">
        <span class="size-2.5 rounded-full bg-[#ff5f57]" />
        <span class="size-2.5 rounded-full bg-[#febc2e]" />
        <span class="size-2.5 rounded-full bg-[#28c840]" />
      </span>
      <span class="mx-auto -translate-x-6 truncate rounded-md bg-white/80 px-3 py-0.5 font-mono text-[0.68rem] tracking-[0.02em] text-[#55575c]">
        {{ label }}
      </span>
    </figcaption>
    <img
      :src="shot.src"
      :srcset="srcsetOf(shot.src, shot.width)"
      sizes="(min-width: 1024px) 60vw, 100vw"
      :width="shot.width"
      :height="shot.height"
      :alt="shot.alt[lang]"
      loading="lazy"
      decoding="async"
      class="block h-auto w-full"
    >
  </figure>
</template>
