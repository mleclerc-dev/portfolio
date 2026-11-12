<script setup lang="ts">
import { shots } from '~/data/content'

// Move Taxi Moto's visuals: the live site with its mobile view, then booking and rates.
defineProps<{ part: 'hero' | 'gallery' }>()
const { t } = useI18n()
const s = shots.taxi
</script>

<template>
  <div v-if="part === 'hero'" class="relative mx-auto max-w-[76rem] pb-[8%]">
    <BrowserFrame :shot="s.home" :label="t('taxi.home')" class="reveal relative" />
    <PhoneFrame
      :shot="s.mobile"
      class="reveal absolute -bottom-[2%] left-[-2%] w-[24%] min-w-[7.5rem] max-w-[15rem] sm:left-[-4%]"
    />
  </div>

  <div v-else class="mx-auto grid max-w-[76rem] gap-6 sm:grid-cols-2 sm:gap-8">
    <BrowserFrame :shot="s.booking" :label="t('taxi.booking')" class="reveal sm:mt-16" />
    <BrowserFrame :shot="s.pricing" :label="t('taxi.pricing')" class="reveal" />
  </div>
</template>
