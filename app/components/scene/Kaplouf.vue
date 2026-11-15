<script setup lang="ts">
import { shots, type Locale } from '~/data/content'

// Kaplouf's visuals: the battle from above with a soldier breaking out of the frame, then the game on a phone.
defineProps<{ part: 'hero' | 'gallery' }>()
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
const s = shots.kaplouf
</script>

<template>
  <div v-if="part === 'hero'" class="relative">
    <div class="relative aspect-[4/5] overflow-hidden rounded-[10px] sm:aspect-[2/1]">
      <img
        :src="s.battle.src"
        :width="s.battle.width"
        :height="s.battle.height"
        :alt="s.battle.alt[lang]"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover object-[60%_50%]"
      >
      <div aria-hidden="true" class="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--paper)_100%)]" />
    </div>
    <img
      :src="s.soldier.src"
      :srcset="srcsetOf(s.soldier.src, s.soldier.width)"
      sizes="(min-width: 640px) min(32vw, 30rem), 52vw"
      alt=""
      aria-hidden="true"
      width="1200"
      height="1200"
      decoding="async"
      class="drift pointer-events-none absolute -bottom-[14%] right-[-4%] z-10 w-[52%] max-w-[30rem] drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)] sm:w-[32%]"
      style="--tilt: -4deg"
    >
  </div>

  <div v-else class="mx-auto flex max-w-[56rem] items-start justify-center gap-5 sm:gap-10">
    <figure class="reveal w-[46%] max-w-[17rem]">
      <PhoneFrame :shot="s.ginette" />
      <figcaption class="eyebrow mt-4 text-center">{{ t('kaplouf.village') }}</figcaption>
    </figure>
    <figure class="reveal mt-20 w-[46%] max-w-[17rem]">
      <PhoneFrame :shot="s.island" />
      <figcaption class="eyebrow mt-4 text-center">{{ t('kaplouf.battle') }}</figcaption>
    </figure>
  </div>
</template>
