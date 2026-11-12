<script setup lang="ts">
// Pause / resume every animation on the site (see useMotion). `compact`: icon only.
defineProps<{ compact?: boolean }>()
const { t } = useI18n()
const { off, toggle } = useMotion()
const label = computed(() => (off.value ? t('motion.resume') : t('motion.pause')))
</script>

<template>
  <button
    type="button"
    class="pointer-events-auto inline-flex items-center gap-2 transition-colors duration-200 hover:text-ink"
    :class="compact ? 'size-6 justify-center rounded-full border border-line' : ''"
    :aria-pressed="off"
    :aria-label="compact ? label : undefined"
    :title="compact ? label : undefined"
    @click="toggle"
  >
    <svg aria-hidden="true" viewBox="0 0 12 12" class="size-2.5" fill="currentColor">
      <path v-if="off" d="M3 1.5 L10.5 6 L3 10.5 Z" />
      <template v-else><rect x="2.2" y="1.5" width="2.6" height="9" rx="0.6" /><rect x="7.2" y="1.5" width="2.6" height="9" rx="0.6" /></template>
    </svg>
    <span v-if="!compact">{{ label }}</span>
  </button>
</template>
