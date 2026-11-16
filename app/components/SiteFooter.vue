<script setup lang="ts">
import { person } from '~/data/content'

const { t } = useI18n()
const localePath = useLocalePath()
const links = person.links.filter((l) => l.href)
// On the home page the footer is the sea again; on a project page it stays in the project's colours.
const route = useRoute()
const onHome = computed(() => !route.params.slug)

// "Right now in Urville": the local time
const { locale } = useI18n()
const time = ref('')
onMounted(() => {
  const fmt = new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })
  time.value = fmt.format(new Date())
})
const live = computed(() => (time.value ? t('footer.live', { time: time.value }) : ''))
</script>

<template>
  <footer class="border-t border-line">
    <p aria-hidden="true" class="mx-auto max-w-[90rem] overflow-hidden whitespace-nowrap px-4 pt-12 font-display text-[clamp(2.4rem,8.6vw,8.5rem)] uppercase leading-[0.9] sm:px-8">
      <KineticText text="Maxime Leclerc" :base="[820, 96]" :peak="[900, 145]" :radius="260" :sweep="false" />
    </p>
    <div class="mx-auto grid max-w-[90rem] gap-6 px-4 py-8 font-mono text-[0.72rem] leading-relaxed text-muted sm:px-8 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-10">
      <p class="max-w-[70ch]">{{ t('footer.colophon') }}</p>
      <p class="flex flex-wrap gap-x-5 [&>a]:py-2.5">
        <a :href="`mailto:${person.email}`" class="link-underline">{{ person.email }}</a>
        <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="me noopener" class="link-underline">{{ l.label }}</a>
      </p>
      <p class="flex flex-wrap items-center gap-x-5 [&>*]:py-2.5">
        <span v-if="live" class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-[#4ade80] blink" />{{ live }}</span>
        <NuxtLink :to="localePath('mentions-legales')" class="link-underline">{{ t('footer.legal') }}</NuxtLink>
        <MotionToggle class="link-underline text-muted" />
        <a href="#top" class="link-underline shrink-0">{{ t('footer.top') }} ↑</a>
      </p>
    </div>
  </footer>
</template>
