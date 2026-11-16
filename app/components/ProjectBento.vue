<script setup lang="ts">
import { projects, type Locale } from '~/data/content'

/*
 * The projects as a bento grid: one tile per project, painted in its own identity
 * (data-scene), with its name in its typeface, two concrete things it does,
 * the tagline, the stack, and a piece of its interface redrawn in vector (components/preview).
 * The client project gets the large tile. Each tile is a single link to the project page.
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => locale.value as Locale)
const dot = { live: 'bg-[#4ade80]', used: 'bg-[var(--yellow)]', wip: 'bg-[var(--yellow)]' }

// Grid placement on wide screens: the client project large, the others around it.
const area: Record<string, string> = {
  taxi: 'lg:col-span-7 lg:row-span-2',
  kaplouf: 'lg:col-span-5 lg:row-span-2',
  mariage: 'lg:col-span-6',
  noel: 'lg:col-span-6',
}
const previews: Record<string, ReturnType<typeof resolveComponent>> = {
  taxi: resolveComponent('PreviewTaxi'),
  mariage: resolveComponent('PreviewMariage'),
  noel: resolveComponent('PreviewNoel'),
}
const bulbs = ['#d7263d', '#f2b134', '#ffc2cf', '#6ad19a']
// The light under the cursor, as CSS variables on the tile
function glow(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

// Snow over Kaplouf's ice field: fixed values, so server and client agree.
const flakes = Array.from({ length: 16 }, (_, k) => ({
  x: (k * 37) % 100,
  size: 2 + (k % 3),
  dur: 7 + ((k * 13) % 7),
  delay: -((k * 11) % 9),
  drift: ((k % 5) - 2) * 6,
}))

// Tiles below the fold slide in when they arrive; the ones already in view stay put.
const list = ref<HTMLElement | null>(null)
onMounted(() => {
  if (!list.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const items = [...list.value.children] as HTMLElement[]
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.remove('tile-wait')
        io.unobserve(e.target)
      }
    },
    { threshold: 0.12 },
  )
  items.forEach((el, i) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    el.classList.add('tile-wait')
    el.style.transitionDelay = `${(i % 2) * 120}ms`
    io.observe(el)
  })
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <section id="projets" aria-labelledby="projects-heading" class="relative scroll-mt-14">
    <div class="relative mx-auto max-w-[90rem] px-4 pb-20 pt-8 sm:px-8 sm:pb-28">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mb-12">
        <div>
          <p class="eyebrow">{{ t('index.kicker') }}</p>
          <h2 id="projects-heading" data-face="host" class="stretch-in mt-3 whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] uppercase leading-[0.9]">
            {{ t('index.heading') }}
          </h2>
        </div>
        <p class="max-w-[24rem] pb-2 text-[1.25rem] leading-snug text-muted">{{ t('index.intro') }}</p>
      </div>

      <ul ref="list" class="grid gap-4 sm:gap-5 lg:auto-rows-[minmax(15rem,auto)] lg:grid-cols-[repeat(12,minmax(0,1fr))]">
        <li
          v-for="(p, i) in projects"
          :id="`projet-${p.slug}`"
          :key="p.id"
          class="tile-li min-w-0 scroll-mt-24"
          :class="area[p.id]"
          :style="{ '--i': i }"
        >
          <!-- The title's link covers the whole card; the interactive preview sits above it. -->
          <article
            :data-scene="p.id"
            class="tile scene group relative flex h-full flex-col overflow-hidden rounded-[18px] p-6 sm:p-8"
            @pointermove="glow"
            :class="{ 'pt-14 sm:pt-16': p.id === 'noel' || p.id === 'mariage', 'min-h-[32rem] max-lg:pb-[18.5rem] sm:min-h-[36rem]': p.id === 'kaplouf' }"
          >
            <!-- Top line: provenance and status -->
            <div class="flex flex-wrap items-center justify-between gap-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-muted">
              <span>{{ t(`bento.${p.origin}`) }} · {{ p.kind[lang] }}</span>
              <span class="flex items-center gap-2 normal-case tracking-normal">
                <span class="size-1.5 rounded-full" :class="dot[p.state]" />{{ p.status[lang] }}
              </span>
            </div>

            <!-- Name, and the way in beside it -->
            <div class="mt-6 flex items-start justify-between gap-6">
            <div class="min-w-0">
            <h3
              :data-face="p.id"
              class="leading-[0.92]"
              :class="{
                'text-[clamp(2.6rem,5vw,4.75rem)]': p.id === 'taxi',
                'text-[clamp(2rem,4vw,3.4rem)]': p.id === 'kaplouf',
                'text-[clamp(2.3rem,4.4vw,3.8rem)]': p.id === 'mariage' || p.id === 'noel',
              }"
              :style="{ viewTransitionName: `project-${p.id}` }"
            >
              <NuxtLink :to="localePath(`/projets/${p.slug}`)" class="tile-link after:absolute after:inset-0 after:z-10 after:content-['']">{{ p.name[lang] }}</NuxtLink>
            </h3>
            <p class="mt-3 max-w-[30ch] text-[1.1rem] font-medium leading-snug">{{ p.tagline[lang] }}</p>
            </div>
            <span aria-hidden="true" class="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--yellow)] text-lg leading-none text-[var(--on-yellow)] transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </div>

            <!-- What it is, in full: so a small tile doesn't read as a small project -->
            <p class="mt-4 max-w-[54ch] text-[0.98rem] leading-[1.55] text-ink/85">{{ p.summary[lang] }}</p>
            <ul class="mt-4 flex flex-wrap gap-1.5" :aria-label="t('bento.scope')">
              <li
                v-for="s in p.scope"
                :key="s.fr"
                class="rounded-full border border-current/25 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink/90"
              >{{ s[lang] }}</li>
            </ul>

            <!-- A piece of its interface, redrawn -->
            <div v-if="previews[p.id]" class="relative z-20 mt-6" :class="({ taxi: 'h-[22rem] sm:h-[27rem] lg:h-auto lg:min-h-[27rem] lg:flex-1', mariage: 'min-h-[17rem] flex-1', noel: 'min-h-[19rem] flex-1 sm:min-h-[20rem]' } as Record<string, string>)[p.id]">
              <component :is="previews[p.id]" />
            </div>

            <!-- Kaplouf's penguin, Noël's string of lights -->
            <div aria-hidden="true" class="pointer-events-none absolute inset-0">
              <img
                v-if="p.id === 'kaplouf'"
                src="/projects/kaplouf-soldier.webp"
                srcset="/projects/kaplouf-soldier-800.webp 800w, /projects/kaplouf-soldier.webp 1200w"
                sizes="(min-width: 1024px) 24rem, 16rem"
                alt=""
                width="1200"
                height="1200"
                loading="lazy"
                decoding="async"
                class="kp-float absolute bottom-6 left-1/2 w-[60%] max-w-[16rem] -translate-x-1/2 drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)] lg:bottom-[8%] lg:w-[72%] lg:max-w-[24rem]"
              >
              <template v-if="p.id === 'kaplouf'">
                <span
                  v-for="(f, k) in flakes"
                  :key="k"
                  class="kp-flake absolute inset-y-0"
                  :style="{ left: `${f.x}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, '--drift': `${f.drift}px` }"
                ><span class="absolute top-0 block rounded-full bg-white/50" :style="{ width: `${f.size}px`, height: `${f.size}px` }" /></span>
              </template>
              <svg v-else-if="p.id === 'noel'" viewBox="0 0 700 48" preserveAspectRatio="none" class="absolute inset-x-0 top-0 h-10 w-full">
                <path d="M0 6 Q44 30 88 6 T176 6 T264 6 T352 6 T440 6 T528 6 T616 6 T704 6" fill="none" stroke="#0a2a20" stroke-width="2" />
                <ellipse v-for="k in 16" :key="k" class="nl-bulb" :style="{ animationDelay: `${((k * 7) % 11) * -0.23}s` }" :cx="22 + (k - 1) * 44" cy="26" rx="4.5" ry="6.5" :fill="bulbs[(k - 1) % 4]" />
              </svg>
            </div>
          </article>
        </li>

      </ul>

      <!-- And the work for employers -->
      <CompanyWork />
    </div>
  </section>
</template>

<style scoped>
/* A fine inner edge; no lift on hover (it made the card slip from under the cursor), just a deeper shadow. */
.tile {
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.06) inset;
  transition: box-shadow 0.3s ease;
}
.tile:hover {
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08) inset,
    0 30px 60px -30px rgb(0 0 0 / 0.8);
}
.tile:has(.tile-link:focus-visible),
a.tile:focus-visible {
  outline: 3px solid var(--yellow);
  outline-offset: 4px;
}
.tile-link:focus-visible {
  outline: none;
}


/* The light that follows the cursor */
.tile::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(28rem circle at var(--mx, 50%) var(--my, 0%), rgb(255 255 255 / 0.09), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}
.tile[data-scene='mariage']::before {
  background: radial-gradient(28rem circle at var(--mx, 50%) var(--my, 0%), rgb(19 133 107 / 0.08), transparent 60%);
}
@media (hover: hover) {
  .tile:hover::before {
    opacity: 1;
  }
}

/* Arrival, Kaplouf's float and snow, Noël's twinkling lights */
@media (prefers-reduced-motion: no-preference) {
  .tile-li {
    transition:
      opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1),
      transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .tile-li.tile-wait {
    opacity: 0;
    transform: translateY(48px) scale(0.98);
  }
  .kp-float {
    animation: kp-float 5s ease-in-out infinite alternate;
  }
  .kp-flake {
    animation: kp-flake linear infinite;
  }
  .nl-bulb {
    animation: nl-twinkle 1.8s ease-in-out infinite alternate;
  }
}
@keyframes kp-float {
  from { transform: translateY(0) rotate(-1.5deg); }
  to { transform: translateY(-12px) rotate(1.5deg); }
}
@keyframes kp-flake {
  from { transform: translate(0, -4%); }
  to { transform: translate(var(--drift, 0), 102%); }
}
@keyframes nl-twinkle {
  from { opacity: 1; }
  to { opacity: 0.35; }
}
</style>
