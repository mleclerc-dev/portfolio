<script setup lang="ts">
import { shots } from '~/data/content'

// Mariage's visuals: the dashboard and a household's invitation, then seating and scenarios.
defineProps<{ part: 'hero' | 'gallery' }>()
const { t } = useI18n()
const s = shots.mariage
</script>

<template>
  <div v-if="part === 'hero'" class="relative mx-auto max-w-[72rem] pb-[8%]">
    <BrowserFrame :shot="s.dashboard" :label="t('mariage.dashboard')" class="reveal relative" />
    <PhoneFrame
      :shot="s.rsvp"
      class="reveal absolute -bottom-[2%] right-[-2%] w-[24%] min-w-[7.5rem] max-w-[15rem] sm:right-[-4%]"
    />
  </div>

  <div v-else class="mx-auto grid max-w-[72rem] gap-6 sm:grid-cols-2 sm:gap-8">
    <BrowserFrame :shot="s.plan" :label="t('mariage.plan')" class="reveal" />
    <BrowserFrame :shot="s.scenarios" :label="t('mariage.scenarios')" class="reveal sm:mt-16" />
  </div>
</template>
