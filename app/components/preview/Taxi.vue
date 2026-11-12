<script setup lang="ts">
/*
 * Move Taxi Moto, interactive: pick an airport and the route and the flat fare change.
 * Fares are the "from" prices on movetaxi.fr's rates page. On screen, it cycles through
 * the airports by itself, a bike riding the route, until the visitor picks one.
 */
const { t, locale } = useI18n()

const ROUTES = {
  cdg: { name: 'Roissy-CDG', short: 'CDG', price: 95, d: 'M70 245 C 120 210, 150 190, 205 168 S 300 120, 340 70', end: [340, 70], label: [230, 75] },
  bourget: { name: 'Le Bourget', short: 'Le Bourget', price: 75, d: 'M70 245 C 120 200, 190 170, 230 140 S 280 110, 300 105', end: [300, 105], label: [205, 108] },
  orly: { name: 'Orly', short: 'Orly', price: 70, d: 'M70 245 C 140 262, 210 268, 260 255 S 320 236, 345 228', end: [345, 228], label: [345, 205] },
} as const
type Key = keyof typeof ROUTES
const pick = ref<Key>('cdg')
const r = computed(() => ROUTES[pick.value])
// The fare counts to its new value
const shown = ref<number>(ROUTES.cdg.price)
let cancel = () => {}
watch(pick, () => {
  cancel()
  cancel = stepTowards(shown, r.value.price, 1, 18)
})
onBeforeUnmount(() => cancel())
const price = computed(() => (locale.value === 'fr' ? `${shown.value} €` : `€${shown.value}`))

const root = ref<HTMLElement | null>(null)
const order: Key[] = ['cdg', 'bourget', 'orly']
useAutoplay(root, () => (pick.value = order[(order.indexOf(pick.value) + 1) % order.length]!), 3400, 1400)
const reducedMotion = ref(true)
onMounted(() => (reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches))
const { off: paused } = useMotion()
const moving = computed(() => !reducedMotion.value && !paused.value)
</script>

<template>
  <div ref="root" class="relative size-full overflow-hidden rounded-[14px] bg-[#3d0b13]">
    <!-- Map -->
    <svg aria-hidden="true" viewBox="-60 20 520 260" preserveAspectRatio="xMidYMid slice" class="absolute inset-0 size-full" fill="none">
      <g stroke="#5a1a24" stroke-width="1.2">
        <path d="M-10 60 L410 30 M-10 140 L410 120 M-10 220 L410 210 M60 -10 L90 310 M170 -10 L160 310 M260 -10 L290 310 M350 -10 L330 310" />
        <path d="M-10 250 C 80 230, 120 180, 200 170 S 330 110, 410 70" stroke-width="5" stroke="#4d1720" />
      </g>
      <path :key="pick" class="pv-route" :d="r.d" stroke="#f0d2d7" stroke-width="2.5" stroke-dasharray="7 7" stroke-linecap="round" />
      <circle :cx="r.end[0]" :cy="r.end[1]" r="9" fill="#f0d2d7" />
      <circle :key="`ring-${pick}`" class="pv-ping" :cx="r.end[0]" :cy="r.end[1]" r="18" stroke="#f0d2d7" stroke-opacity="0.4" stroke-width="1.5" />
      <!-- The bike, riding the route from Paris -->
      <g v-if="moving" :key="`bike-${pick}`">
        <circle r="11" fill="#f0d2d7" fill-opacity="0.18" />
        <circle r="5" fill="#fffaf2" stroke="#4a0e17" stroke-width="2" />
        <animateMotion dur="2.6s" repeatCount="indefinite" :path="r.d" />
      </g>
      <circle cx="70" cy="245" r="5" fill="#4a0e17" stroke="#f0d2d7" stroke-width="2" />
      <text :x="r.label[0]" :y="r.label[1]" fill="#d9b5bb" font-family="IBM Plex Mono, monospace" font-size="12">{{ r.name }}</text>
    </svg>

    <!-- Booking card -->
    <div class="absolute bottom-[6%] left-[5%] w-[min(18rem,70%)] rounded-[10px] bg-[#f6f1f2] p-3.5 text-[#2a0a10] shadow-[0_24px_40px_-20px_rgb(0_0_0/0.7)] sm:p-4">
      <p class="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#7a4a52]">{{ t('preview.taxi_title') }}</p>
      <p class="mt-2.5 flex items-center gap-2 rounded-[6px] border border-[#e6d3d7] px-2.5 py-1.5 text-[0.8rem]"><span aria-hidden="true" class="size-2 rounded-full bg-[#4a0e17]" />Paris</p>
      <div class="mt-2 flex gap-1.5" role="radiogroup" :aria-label="t('preview.taxi_to')">
        <button
          v-for="(route, key) in ROUTES"
          :key="key"
          type="button"
          role="radio"
          :aria-checked="pick === key"
          class="h-8 flex-1 cursor-pointer whitespace-nowrap rounded-[6px] border px-1.5 text-[0.72rem] font-medium transition-colors duration-200"
          :class="pick === key ? 'border-[#4a0e17] bg-[#4a0e17] text-[#f6f1f2]' : 'border-[#e6d3d7] hover:border-[#4a0e17]'"
          @click="pick = key"
        >{{ route.short }}</button>
      </div>
      <div class="mt-3 flex items-end justify-between gap-3">
        <span>
          <span class="block font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[#7a4a52]">{{ t('preview.taxi_fare') }}</span>
          <span class="font-[Gilda_Display,serif] text-[1.55rem] leading-none" aria-live="polite">{{ t('preview.taxi_from') }} {{ price }}</span>
        </span>
        <span aria-hidden="true" class="rounded-[6px] bg-[#4a0e17] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[#f6f1f2]">{{ t('preview.taxi_cta') }}</span>
      </div>
    </div>
  </div>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  /* The dashes march towards the airport */
  .pv-route {
    animation: pv-route-in 0.6s ease-out, pv-ants 0.9s linear infinite;
  }
  .pv-ping {
    transform-box: fill-box;
    transform-origin: center;
    animation: pv-ping 1.8s ease-out infinite;
  }
}
@keyframes pv-route-in {
  from { opacity: 0; }
}
@keyframes pv-ants {
  to { stroke-dashoffset: -14; }
}
@keyframes pv-ping {
  from { transform: scale(0.6); opacity: 1; }
  to { transform: scale(1.5); opacity: 0; }
}
</style>
