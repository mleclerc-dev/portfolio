<script setup lang="ts">
import { shots } from '~/data/content'

// Le Noël des copains' visuals: one spin of the wheel then the gift tag, under the app's string of lights;
// then the home page.
defineProps<{ part: 'hero' | 'gallery' }>()
const { t } = useI18n()
const s = shots.noel
const bulbs = ['#d7263d', '#f2b134', '#ffc2cf', '#6ad19a']
</script>

<template>
  <div v-if="part === 'hero'" class="relative">
    <svg aria-hidden="true" class="absolute inset-x-[-50vw] -top-10 h-10 w-[200vw]" preserveAspectRatio="none">
      <defs>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="garland" width="224" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 4 Q28 22 56 4 Q84 22 112 4 Q140 22 168 4 Q196 22 224 4" fill="none" stroke="#0a2a20" stroke-width="2" />
          <g filter="url(#glow)">
            <ellipse v-for="(c, i) in bulbs" :key="c" :cx="28 + i * 56" cy="20" rx="4.5" ry="6.5" :fill="c" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="40" fill="url(#garland)" />
    </svg>

    <div class="relative mx-auto flex max-w-[48rem] items-start justify-center gap-6 pt-16 sm:gap-14 sm:pt-20">
      <figure class="reveal w-[44%] max-w-[17rem] -rotate-3">
        <PhoneFrame :shot="s.wheel" />
      </figure>
      <div aria-hidden="true" class="absolute left-1/2 top-6 z-10 -translate-x-[15%] text-center text-[var(--noel-accent)]">
        <span class="block whitespace-nowrap font-hand text-[clamp(1.3rem,2.2vw,1.8rem)] font-semibold leading-none">{{ t('noel.spin') }}</span>
        <svg class="mx-auto mt-1 h-10 w-24" viewBox="0 0 96 40" fill="none">
          <path d="M4 10 C 30 34, 60 34, 88 14" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          <path d="M76 10 L 90 13 L 83 26" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <figure class="reveal mt-24 w-[44%] max-w-[17rem] rotate-3">
        <PhoneFrame :shot="s.tag" />
      </figure>
    </div>
  </div>

  <div v-else class="mx-auto max-w-[72rem]">
    <BrowserFrame :shot="s.home" :label="t('noel.home')" class="reveal" />
  </div>
</template>
