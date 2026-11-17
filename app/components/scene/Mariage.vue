<script setup lang="ts">
import { shots } from '~/data/content'

// Carnet du mariage's real screens, from the live site and its open demo:
// the public home page with a household's invitation, then the couple's side of the notebook.
defineProps<{ part: 'hero' | 'gallery' }>()
const s = shots.mariage
const host = 'carnetdumariage.com'
</script>

<template>
  <div v-if="part === 'hero'" class="relative mx-auto max-w-[72rem] pb-[8%]">
    <BrowserFrame :shot="s.landing" :label="host" class="reveal relative" />
    <PhoneFrame
      :shot="s.rsvp"
      class="reveal absolute -bottom-[2%] right-[-2%] w-[24%] min-w-[7.5rem] max-w-[15rem] sm:right-[-4%]"
    />
  </div>

  <div v-else class="mx-auto max-w-[72rem] space-y-16 sm:space-y-24">
    <div class="relative pb-[8%]">
      <BrowserFrame :shot="s.dashboard" :label="`${host}/tableau-de-bord`" class="reveal relative" />
      <PhoneFrame
        :shot="s.site"
        class="reveal absolute -bottom-[2%] left-[-2%] w-[24%] min-w-[7.5rem] max-w-[15rem] sm:left-[-4%]"
      />
    </div>
    <div class="grid gap-6 sm:grid-cols-2 sm:gap-8">
      <BrowserFrame :shot="s.plan" :label="`${host}/plan-de-table`" class="reveal" />
      <BrowserFrame :shot="s.scenarios" :label="`${host}/scenarios`" class="reveal sm:mt-16" />
    </div>
  </div>
</template>
