<script setup lang="ts">
/*
 * Stands in for a portrait: where I work from, right now. Local time, the air, the wind
 * the swell and the tide off Urville-Nacqueville (live, Open-Meteo), with today's tide
 * drawn as a curve (TideChart). The sea itself is on the home page, under the title.
 */
const { t, locale } = useI18n()
const now = useUrville()

const time = ref('')
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  const fmt = new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })
  const tick = () => (time.value = fmt.format(new Date()))
  tick()
  clock = setInterval(tick, 15000)
})
onBeforeUnmount(() => clearInterval(clock))

const num = (n: number, digits = 0) => n.toFixed(digits).replace('.', locale.value === 'fr' ? ',' : '.')
const data = computed(() => (now.value ? now.value : null))

</script>

<template>
  <div class="relative flex size-full flex-col overflow-hidden bg-[#0b0b0c] p-6 text-[#f2f2ef] sm:p-7">
    <p class="relative flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#b4b4ba]">
      <span>{{ t('about.card_coords') }}</span>
      <span v-if="now !== false" class="flex items-center gap-1.5 normal-case tracking-normal"><span class="size-1.5 rounded-full bg-[#4ade80]" />{{ t('about.card_live') }}</span>
    </p>
    <p data-face="host" class="relative mt-4 text-[clamp(1.7rem,2.6vw,2.3rem)] uppercase leading-[0.95]">Urville-<br>Nacqueville</p>

    <p v-if="time" class="relative mt-6">
      <span class="block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#b4b4ba]">{{ t('about.card_time') }}</span>
      <span class="mt-1 block font-display text-[clamp(3rem,5vw,4.5rem)] font-extrabold leading-none tabular-nums [font-stretch:85%]">{{ time }}</span>
    </p>

    <!-- Today's tide -->
    <div class="relative my-5 min-h-24 flex-1">
      <TideChart v-if="data?.tide && data.tide.curve.length > 4" :tide="data.tide" />
    </div>

    <div class="relative">
      <dl v-if="data" class="grid grid-cols-3 gap-3 border-t border-white/15 pt-4">
        <div>
          <dt class="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[#b4b4ba]">{{ t('about.card_air') }}</dt>
          <dd class="mt-1 text-[1.15rem] font-semibold tabular-nums">{{ num(data.temp) }} °C</dd>
          <dd class="text-[0.75rem] text-[#b4b4ba]">{{ t(`term.sky.${data.sky}`) }}</dd>
        </div>
        <div>
          <dt class="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[#b4b4ba]">{{ t('term.wind') }}</dt>
          <dd class="mt-1 text-[1.15rem] font-semibold tabular-nums">{{ num(data.wind) }} km/h</dd>
          <dd class="text-[0.75rem] text-[#b4b4ba]">{{ t('about.card_from', { dir: compass(data.windDeg, locale) }) }}</dd>
        </div>
        <div>
          <dt class="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[#b4b4ba]">{{ t('term.swell') }}</dt>
          <dd class="mt-1 text-[1.15rem] font-semibold tabular-nums">{{ data?.wave != null ? `${num(data.wave, 1)} m` : '—' }}</dd>
          <dd v-if="data?.period" class="text-[0.75rem] text-[#b4b4ba]">{{ num(data.period) }} s</dd>
        </div>
      </dl>
      <p v-if="data?.tide" class="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3 text-[0.85rem]">
        <span><span class="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[#b4b4ba]">{{ t('tide.label') }}</span>&ensp;{{ tideText(t, data.tide, locale) }}</span>
        <span aria-hidden="true" class="font-mono text-[#f2d04b]">{{ data.tide.rising ? '↑' : '↓' }}</span>
      </p>
      <p class="mt-3 min-h-[2.6em] text-[0.9rem] leading-snug" aria-live="polite">
        <template v-if="data && data.wave != null">{{ t(`term.surf_${surfVerdict(data.wave)}`) }}</template>
        <span v-else-if="now === false" class="text-[#b4b4ba]">{{ t('about.card_offline') }}</span>
      </p>
    </div>
  </div>
</template>
