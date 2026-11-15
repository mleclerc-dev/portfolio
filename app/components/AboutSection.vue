<script setup lang="ts">
import { coreSkills, person, skills, type Locale } from '~/data/content'

// Who I am: portrait, story, a few facts, how I work, tools, and the CV.
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
</script>

<template>
  <section id="a-propos" data-scene="host" aria-labelledby="about-heading" class="scroll-mt-14">
    <div class="mx-auto max-w-[90rem] border-t border-line px-4 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <!-- Portrait -->
        <figure class="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <div class="relative flex overflow-hidden rounded-[18px] bg-[#0b0b0c]" :class="person.photo ? 'aspect-[4/5] max-h-[38rem]' : 'min-h-[34rem]'">
            <img
              v-if="person.photo"
              :src="person.photo"
              :alt="t('about.photo_alt')"
              width="640"
              height="800"
              loading="lazy"
              decoding="async"
              class="size-full object-cover"
            >
            <!-- Until a photo is added: where I work from, live -->
            <UrvilleCard v-else />
          </div>
          <figcaption v-if="person.photo" class="mt-3 flex items-center gap-2 font-mono text-[0.75rem] text-muted">
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-5.8-7-11a7 7 0 1 1 14 0c0 5.2-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            {{ t('about.photo_caption') }}
          </figcaption>
        </figure>

        <!-- Story -->
        <div class="lg:col-span-7 lg:col-start-6">
          <h2 id="about-heading" class="eyebrow">{{ t('about.heading') }}</h2>
          <p data-face="host" class="mt-5 max-w-[20ch] text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.02]">{{ t('about.lead') }}</p>
          <div class="panel mt-8 max-w-[44rem] space-y-4 p-6 text-[1.15rem] leading-[1.6] sm:p-8">
            <p>{{ t('about.p1') }}</p>
            <p>{{ t('about.p2') }}</p>
            <p>{{ t('about.p3') }}</p>
          </div>

          <dl class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div v-for="i in 4" :key="i" class="panel p-4">
              <dt class="font-display text-[1.3rem] font-extrabold leading-tight tracking-[-0.01em] [font-stretch:90%]">{{ t(`about.fact${i - 1}_value`) }}</dt>
              <dd class="mt-1 text-[0.85rem] leading-snug text-muted">{{ t(`about.fact${i - 1}_label`) }}</dd>
            </div>
          </dl>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              :href="person.cv[lang]"
              download
              class="group inline-flex h-12 items-center gap-3 rounded-full bg-[#0b0b0c] px-6 font-mono text-[0.78rem] uppercase tracking-[0.1em] text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke-linecap="round" stroke-linejoin="round" /></svg>
              {{ t('about.cv') }}
              <span class="text-white/70">{{ t('about.cv_meta') }}</span>
            </a>
            <a href="#contact" class="inline-flex h-12 items-center rounded-full border border-black/20 px-6 font-mono text-[0.78rem] uppercase tracking-[0.1em] transition-colors duration-200 hover:border-black">
              {{ t('hero.cta_contact') }} →
            </a>
          </div>
        </div>
      </div>

      <!-- Tools: what I work with, grouped, full width -->
      <div class="panel mt-16 p-6 sm:p-8">
        <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 border-b border-line pb-6">
          <div>
            <h3 class="eyebrow">{{ t('about.skills') }}</h3>
            <p data-face="host" class="mt-3 text-[clamp(1.7rem,3vw,2.5rem)] uppercase leading-[0.95]">
              <!-- Highlighter swipe under the title -->
              <span class="box-decoration-clone bg-[linear-gradient(transparent_55%,var(--yellow)_55%,var(--yellow)_92%,transparent_92%)] px-1 -mx-1">{{ t('about.skills_title') }}</span>
            </p>
          </div>
          <div class="max-w-[30rem]">
            <p class="text-[1rem] leading-snug text-muted">{{ t('about.skills_text') }}</p>
            <p class="mt-3 flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
              <span aria-hidden="true" class="size-2.5 rounded-full bg-[var(--yellow)] ring-1 ring-black/10" />{{ t('about.skills_core') }}
            </p>
          </div>
        </div>
        <dl class="mt-6 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
          <div v-for="s in skills" :key="s.group.fr">
            <dt class="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
              <span aria-hidden="true" class="h-px w-3 bg-[var(--yellow)] [box-shadow:0_0_0_0.5px_var(--yellow)]" />{{ s.group[lang] }}
            </dt>
            <dd class="mt-3">
              <ul class="flex flex-wrap gap-1.5">
                <li
                  v-for="item in s.items"
                  :key="item"
                  class="rounded-full border px-2.5 py-1 text-[0.88rem] leading-tight transition-colors duration-200"
                  :class="coreSkills.has(item)
                    ? 'border-[var(--yellow)] bg-[var(--yellow)] font-medium text-[var(--on-yellow)]'
                    : 'border-line bg-[var(--paper)] hover:border-[var(--yellow)]'"
                >
                  {{ item }}
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
