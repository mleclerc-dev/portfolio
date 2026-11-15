<script setup lang="ts">
import { career, coreSkills, person, projects, skills, type Locale } from '~/data/content'

/*
 * The CV, built from the same data as the site, laid out as one A4 page in the site's look:
 * a grey gridded sheet column (photo, contact, skills, education) and a light sheet
 * (name, hook, profile, experience, projects). Real text throughout, so applicant-tracking
 * tools can read the PDF. It is exported to /public/cv/*.pdf; it can also be printed.
 */
definePageMeta({ layout: false })
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)

useHead({ htmlAttrs: { class: 'cv-page' }, meta: [{ name: 'robots', content: 'noindex' }] })
useSeoMeta({ title: () => t('cv.title') })

const work = career.filter((c) => c.kind === 'work')
const school = career.filter((c) => c.kind === 'school')
const links = person.links.filter((l) => l.href)
const site = useRuntimeConfig().public.siteUrl
// "Projet perso : game design…" → "Game design…" (the provenance is already on the line above)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const host = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const live = (p: (typeof projects)[number]) => p.status.en === 'Live'
// Years in web development, for the first key figure (as in the About section)
const years = new Date().getFullYear() - 2015
// "novembre 2026": when this version of the CV was built
const updated = computed(() => new Intl.DateTimeFormat(lang.value === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' }).format(new Date()))
</script>

<template>
  <main class="cv mx-auto grid grid-cols-[66mm_1fr] bg-[#fafaf8] text-[#111]">
    <!-- The drafting table: who, how to reach me, what I work with -->
    <aside class="cv-side flex flex-col gap-[7mm] bg-[#ededea] px-[8mm] py-[11mm] text-[#111]">
      <img v-if="person.photo" :src="person.photo" :alt="t('about.photo_alt')" width="640" height="800" class="aspect-square w-[34mm] rounded-[10px] object-cover object-[50%_30%] grayscale">

      <section>
        <h2 class="cv-h cv-h-dark">{{ t('cv.contact') }}</h2>
        <ul class="space-y-[1.4mm] font-mono text-[7.6pt] leading-snug">
          <li><a :href="`mailto:${person.email}`">{{ person.email }}</a></li>
          <li><a :href="site">{{ host(site) }}</a></li>
          <li v-for="l in links" :key="l.label"><a :href="l.href">{{ host(l.href) }}</a></li>
          <li class="text-[#4a4a4f]">{{ person.location }}, Cotentin</li>
        </ul>
        <p class="mt-[3mm] rounded-[6px] bg-[#f2d04b] px-[3mm] py-[2mm] text-[8pt] font-semibold leading-snug text-[#0b0b0c]">{{ t('cv.available') }}</p>
      </section>

      <section>
        <h2 class="cv-h cv-h-dark">{{ t('cv.skills') }}</h2>
        <dl class="space-y-[2.6mm]">
          <div v-for="s in skills" :key="s.group.fr">
            <dt class="mb-[1.2mm] font-mono text-[6.8pt] uppercase tracking-[0.1em] text-[#4a4a4f]">{{ s.group[lang] }}</dt>
            <dd>
              <ul class="flex flex-wrap gap-[1.2mm]">
                <li
                  v-for="item in s.items"
                  :key="item"
                  class="rounded-full border px-[2mm] py-[0.5mm] text-[7.4pt] leading-tight"
                  :class="coreSkills.has(item) ? 'border-[#f2d04b] bg-[#f2d04b] font-semibold text-[#0b0b0c]' : 'border-black/20 text-[#111]/85'"
                >
                  {{ item }}
                </li>
              </ul>
            </dd>
          </div>
        </dl>
        <p class="mt-[2.4mm] flex items-center gap-[1.6mm] font-mono text-[6.6pt] uppercase tracking-[0.1em] text-[#4a4a4f]">
          <span class="size-[2mm] rounded-full bg-[#f2d04b]" />{{ t('about.skills_core') }}
        </p>
      </section>

      <section>
        <h2 class="cv-h cv-h-dark">{{ t('cv.education') }}</h2>
        <ol class="space-y-[2.4mm]">
          <li v-for="c in school" :key="c.place">
            <p class="font-mono text-[7pt] text-[#4a4a4f]">{{ c.period[lang] }}</p>
            <p class="text-[8.6pt] font-semibold leading-snug">{{ c.title[lang] }}</p>
            <p class="text-[7.8pt] leading-snug text-[#4a4a4f]">{{ c.place }} · {{ c.text[lang] }}</p>
          </li>
        </ol>
      </section>

      <section class="mt-auto">
        <h2 class="cv-h cv-h-dark">{{ t('cv.beyond') }}</h2>
        <p class="text-[8pt] leading-[1.5] text-[#111]/80">{{ t('about.p4') }}</p>
      </section>
    </aside>

    <!-- The sheet -->
    <div class="flex flex-col px-[12mm] py-[11mm]">
      <header>
        <p class="font-mono text-[7.6pt] uppercase tracking-[0.12em] text-[#4a4a4f]">{{ t('cv.role') }} · Vue, Nuxt, Laravel</p>
        <h1 class="mt-[2mm] flex items-baseline font-display text-[33pt] font-black uppercase leading-[0.88] tracking-[-0.01em] [font-stretch:92%]">
          {{ person.name }}<span aria-hidden="true" class="ml-[1.2mm] inline-block size-[3mm] rounded-full bg-[#f2d04b]" />
        </h1>
        <p class="mt-[4mm] text-[12.5pt] font-semibold leading-snug">
          <span class="box-decoration-clone bg-[linear-gradient(transparent_58%,#f2d04b_58%,#f2d04b_94%,transparent_94%)] px-[0.6mm]">{{ t('about.lead') }}</span>
        </p>
      </header>

      <!-- The same four key figures as the About section -->
      <dl class="mt-[6mm] grid grid-cols-4 gap-[2.4mm]">
        <div v-for="i in 4" :key="i" class="rounded-[7px] border border-[#e2e1dc] bg-white px-[3mm] py-[2.4mm]">
          <dt class="font-display text-[11pt] font-extrabold leading-tight [font-stretch:90%]">{{ t(`about.fact${i - 1}_value`, { years }) }}</dt>
          <dd class="mt-[0.6mm] text-[7.4pt] leading-snug text-[#4a4a4f]">{{ t(`about.fact${i - 1}_label`) }}</dd>
        </div>
      </dl>

      <section class="mt-[6mm]">
        <h2 class="cv-h">{{ t('cv.profile') }}</h2>
        <p class="text-[9.2pt] leading-[1.55]">{{ t('about.p1') }}</p>
        <p class="mt-[1.6mm] text-[9.2pt] leading-[1.55]">{{ t('about.p3') }}</p>
      </section>

      <section class="mt-[6mm]">
        <h2 class="cv-h">{{ t('cv.experience') }}</h2>
        <ol class="relative ml-[1.2mm] space-y-[3.4mm] border-l border-[#d9d9d4] pl-[5mm]">
          <li v-for="(c, i) in work" :key="c.place" class="relative">
            <span aria-hidden="true" class="absolute -left-[6.45mm] top-[1mm] size-[2.5mm] rounded-full ring-[0.6mm] ring-[#fafaf8]" :class="i === 0 ? 'bg-[#f2d04b] outline outline-1 outline-[#0b0b0c]' : 'bg-[#0b0b0c]'" />
            <p class="flex flex-wrap items-baseline gap-x-[2mm]">
              <span class="text-[10.4pt] font-bold">{{ c.place }}</span>
              <span class="text-[9pt] text-[#4a4a4f]">{{ c.title[lang] }}</span>
              <span class="ml-auto font-mono text-[7.4pt] text-[#4a4a4f]">{{ c.period[lang] }}</span>
            </p>
            <p class="mt-[0.6mm] text-[9pt] leading-snug">{{ c.text[lang] }}</p>
            <p v-if="c.stack" class="mt-[0.6mm] font-mono text-[7.2pt] text-[#4a4a4f]">{{ c.stack }}</p>
          </li>
        </ol>
      </section>

      <section class="mt-[6mm]">
        <h2 class="cv-h">{{ t('cv.projects') }}</h2>
        <ul class="grid grid-cols-2 gap-[2.6mm]">
          <li v-for="p in projects" :key="p.id" class="rounded-[7px] border border-[#e2e1dc] bg-white px-[3.2mm] py-[2.8mm]">
            <p class="flex items-center justify-between gap-[2mm]">
              <span class="text-[10pt] font-bold leading-tight">{{ p.name[lang] }}</span>
              <span class="flex shrink-0 items-center gap-[1.2mm] font-mono text-[6.6pt] uppercase tracking-[0.06em] text-[#4a4a4f]">
                <span class="size-[1.8mm] rounded-full" :class="live(p) ? 'bg-[#22a35a]' : 'bg-[#f2d04b] outline outline-1 outline-[#0b0b0c]/40'" />{{ p.status[lang] }}
              </span>
            </p>
            <p class="mt-[0.4mm] font-mono text-[6.8pt] uppercase tracking-[0.06em] text-[#4a4a4f]">{{ t(`bento.${p.origin}`) }}</p>
            <p class="mt-[1.4mm] text-[8.2pt] leading-snug">{{ p.tagline[lang] }} {{ capitalize(p.role[lang].replace(/^[^:]+:\s*/, '')) }}</p>
            <p class="mt-[1.2mm] font-mono text-[6.8pt] text-[#4a4a4f]">{{ p.stack.join(' · ') }}<template v-if="p.url"> · {{ host(p.url) }}</template></p>
          </li>
        </ul>
      </section>

      <p class="mt-auto flex items-center justify-between border-t border-[#e2e1dc] pt-[2.4mm] font-mono text-[6.8pt] uppercase tracking-[0.08em] text-[#4a4a4f]">
        <span>{{ host(site) }}</span>
        <span>{{ t('cv.updated', { date: updated }) }}</span>
      </p>
    </div>
  </main>

  <p class="no-print my-8 text-center">
    <button type="button" class="rounded-full bg-[#111] px-5 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-white" onclick="window.print()">{{ t('cv.print') }}</button>
  </p>
</template>

<style scoped>
.cv {
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  /* keep the dark column and the yellow in the PDF */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.35);
}
/* The light sheet's fine grid, as on the site */
.cv-side {
  background-image:
    linear-gradient(rgb(0 0 0 / 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 0 0 / 0.05) 1px, transparent 1px);
  background-size: 6mm 6mm;
}
.cv-h {
  display: flex;
  align-items: center;
  gap: 2mm;
  margin-bottom: 2.6mm;
  font-family: var(--font-mono);
  font-size: 7.4pt;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4a4a4f;
}
.cv-h::before {
  content: '';
  width: 4mm;
  height: 0.5mm;
  background: #f2d04b;
}
.cv-h-dark {
  color: #4a4a4f;
}
a {
  text-decoration: none;
}
@media print {
  .cv {
    box-shadow: none;
  }
  .no-print {
    display: none;
  }
}
@media screen {
  .cv {
    margin-top: 2rem;
  }
}
</style>
