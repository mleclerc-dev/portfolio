<script setup lang="ts">
import { career, person, projects, skills, type Locale } from '~/data/content'

/*
 * The CV, built from the same data as the site, laid out as one A4 page.
 * It is exported to /public/cv/*.pdf; it can also be printed from the browser.
 */
definePageMeta({ layout: false })
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)

useHead({ htmlAttrs: { class: 'cv-page' }, meta: [{ name: 'robots', content: 'noindex' }] })
useSeoMeta({ title: () => t('cv.title') })

const work = career.filter((c) => c.kind === 'work')
const school = career.filter((c) => c.kind === 'school')
const links = person.links.filter((l) => l.href)
// "Projet perso : game design…" → "Game design…" (the provenance is already on the line above)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const host = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
</script>

<template>
  <main class="cv mx-auto bg-white text-[#111]">
    <!-- Header -->
    <header class="flex items-start justify-between gap-8 border-b-2 border-[#111] pb-5">
      <div>
        <h1 class="font-display text-[34pt] font-black uppercase leading-[0.9] tracking-[-0.01em] [font-stretch:88%]">{{ person.name }}</h1>
        <p class="mt-2 text-[13pt] font-medium">{{ t('cv.role') }} · Vue, Nuxt, Laravel</p>
        <p class="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f2d04b] px-3 py-1 text-[9pt] font-semibold">{{ t('cv.available') }}</p>
      </div>
      <ul class="shrink-0 space-y-1 text-right font-mono text-[8.5pt] leading-relaxed">
        <li>{{ person.email }}</li>
        <li v-for="l in links" :key="l.label">{{ host(l.href) }}</li>
        <li>{{ person.location }} · {{ t('about.photo_caption').split(', ')[1] }}</li>
      </ul>
    </header>

    <div class="mt-6 grid grid-cols-[1fr_15rem] gap-8">
      <div>
        <!-- Profile -->
        <section>
          <h2 class="cv-h">{{ t('cv.profile') }}</h2>
          <p class="text-[9.5pt] leading-[1.55]">{{ t('about.p1') }} {{ t('about.p2') }}</p>
        </section>

        <!-- Experience -->
        <section class="mt-6">
          <h2 class="cv-h">{{ t('cv.experience') }}</h2>
          <ol class="space-y-3.5">
            <li v-for="c in work" :key="c.place" class="grid grid-cols-[6.5rem_1fr] gap-3">
              <p class="font-mono text-[8pt] text-[#555]">{{ c.period[lang] }}</p>
              <div>
                <p class="text-[10.5pt] font-bold">{{ c.place }} <span class="font-normal text-[#555]">· {{ c.title[lang] }}</span></p>
                <p class="mt-0.5 text-[9.5pt] leading-snug">{{ c.text[lang] }}</p>
                <p v-if="c.stack" class="mt-0.5 font-mono text-[7.5pt] text-[#555]">{{ c.stack }}</p>
              </div>
            </li>
          </ol>
        </section>

        <!-- Projects -->
        <section class="mt-6">
          <h2 class="cv-h">{{ t('cv.projects') }}</h2>
          <ul class="space-y-3">
            <li v-for="p in projects" :key="p.id">
              <p class="text-[10.5pt] font-bold">
                {{ p.name[lang] }}
                <span class="font-normal text-[#555]">· {{ t(`bento.${p.origin}`) }} · {{ p.status[lang] }}</span>
              </p>
              <p class="mt-0.5 text-[9.5pt] leading-snug">{{ p.tagline[lang] }} {{ capitalize(p.role[lang].replace(/^[^:]+:\s*/, '')) }}</p>
              <p class="mt-0.5 font-mono text-[7.5pt] text-[#555]">{{ p.stack.join(' · ') }}<template v-if="p.url"> · {{ host(p.url) }}</template></p>
            </li>
          </ul>
        </section>
      </div>

      <aside>
        <!-- Skills -->
        <section>
          <h2 class="cv-h">{{ t('cv.skills') }}</h2>
          <dl class="space-y-2.5">
            <div v-for="s in skills" :key="s.group.fr">
              <dt class="font-mono text-[8pt] uppercase tracking-[0.06em] text-[#555]">{{ s.group[lang] }}</dt>
              <dd class="text-[9.5pt] leading-snug">{{ s.items.join(', ') }}</dd>
            </div>
          </dl>
        </section>

        <!-- Education -->
        <section class="mt-6">
          <h2 class="cv-h">{{ t('cv.education') }}</h2>
          <ol class="space-y-2.5">
            <li v-for="c in school" :key="c.place">
              <p class="font-mono text-[8pt] text-[#555]">{{ c.period[lang] }}</p>
              <p class="text-[9.5pt] font-bold leading-snug">{{ c.title[lang] }}</p>
              <p class="text-[9pt] text-[#555]">{{ c.place }} · {{ c.text[lang] }}</p>
            </li>
          </ol>
        </section>

        <!-- Beyond work -->
        <section class="mt-6">
          <h2 class="cv-h">{{ t('about.heading') }}</h2>
          <p class="text-[9pt] leading-[1.5]">{{ t('about.p3') }}</p>
        </section>
      </aside>
    </div>

    <p class="no-print mt-10 text-center">
      <button type="button" class="rounded-full bg-[#111] px-5 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-white" onclick="window.print()">{{ t('cv.print') }}</button>
    </p>
  </main>
</template>

<style scoped>
.cv {
  width: 210mm;
  min-height: 297mm;
  padding: 16mm 16mm 14mm;
}
.cv-h {
  margin-bottom: 0.6rem;
  font-family: var(--font-mono);
  font-size: 8pt;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.3rem;
}
@media print {
  .cv {
    min-height: 0;
    height: 296mm;
    padding-bottom: 8mm;
    overflow: hidden;
  }
  .no-print {
    display: none;
  }
}
</style>
