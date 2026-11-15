<script setup lang="ts">
import { person, type Locale } from '~/data/content'

const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
const links = person.links.filter((l) => l.href)
const copied = ref(false)

// A short form: it writes the email for the visitor (no server: their mail app sends it).
const form = reactive({ name: '', email: '', when: '', message: '' })
const sent = ref(false)
let back: ReturnType<typeof setTimeout> | undefined
function send() {
  const lines = [form.message.trim(), '', '—']
  if (form.name.trim()) lines.push(`${t('contact.f_name')} : ${form.name.trim()}`)
  lines.push(`${t('contact.f_email')} : ${form.email.trim()}`)
  if (form.when) lines.push(`${t('contact.f_when')} ${form.when}`)
  const subject = `${t('contact.f_subject')}${form.name.trim() ? ` · ${form.name.trim()}` : ''}`
  const href = `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  sent.value = true
  clearTimeout(back)
  back = setTimeout(() => (sent.value = false), 6000)
  window.location.href = href
}
onBeforeUnmount(() => clearTimeout(back))
const whenOptions = computed(() => [t('contact.f_when_1'), t('contact.f_when_2'), t('contact.f_when_3')])

async function copy() {
  try {
    await navigator.clipboard.writeText(person.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 2400)
  } catch {
    window.location.href = `mailto:${person.email}`
  }
}
</script>

<template>
  <section id="contact" data-scene="host" aria-labelledby="contact-heading" class="scroll-mt-14 border-t border-line">
    <div class="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 sm:py-28">
      <p class="eyebrow">{{ t('contact.kicker') }}</p>
      <h2 id="contact-heading" class="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-tight [text-wrap:balance]">
        {{ t('contact.heading') }}
      </h2>

      <a
        :href="`mailto:${person.email}`"
        :aria-label="`${t('contact.cta')}, ${person.email}`"
        class="group mt-8 inline-flex items-baseline gap-[0.2em] font-display text-[clamp(1.45rem,6.2vw,6.25rem)] leading-[1]"
      >
        <KineticText :text="person.email" :base="[700, 84]" :peak="[900, 125]" :radius="200" :sweep="false" />
        <span aria-hidden="true" class="inline-block text-[var(--yellow)] transition-transform duration-300 group-hover:translate-x-3">→</span>
      </a>

      <div class="mt-8 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div class="panel self-start p-6 sm:p-7 lg:sticky lg:top-24">
          <p class="text-[1.15rem] leading-[1.55] text-ink/90">{{ t('contact.text') }}</p>
          <p class="mt-4 flex items-start gap-2 font-mono text-[0.78rem] leading-relaxed text-ink">
            <span class="mt-[0.45em] size-2 shrink-0 rounded-full bg-[#4ade80]" />{{ t('contact.availability') }}
          </p>
        </div>

        <!-- The form: it writes the email, the visitor's mail app sends it -->
        <form class="panel" @submit.prevent="send">
          <div class="grid gap-4 p-6 sm:p-7">
            <p class="eyebrow">{{ t('contact.f_title') }}</p>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="grid gap-1.5">
                <span class="field-label">{{ t('contact.f_name') }}</span>
                <input v-model="form.name" class="field" type="text" autocomplete="name">
              </label>
              <label class="grid gap-1.5">
                <span class="field-label">{{ t('contact.f_email') }} <span class="text-[var(--yellow)]" :title="t('contact.f_required')">*</span></span>
                <input v-model="form.email" class="field" type="email" autocomplete="email" required>
              </label>
            </div>
            <fieldset class="grid gap-1.5">
              <legend class="field-label mb-1.5">{{ t('contact.f_when') }}</legend>
              <div class="flex flex-wrap gap-2">
                <label v-for="o in whenOptions" :key="o" class="when-chip">
                  <input v-model="form.when" type="radio" name="when" :value="o" class="sr-only">
                  <span>{{ o }}</span>
                </label>
              </div>
            </fieldset>
            <label class="grid gap-1.5">
              <span class="field-label">{{ t('contact.f_message') }} <span class="text-[var(--yellow)]" :title="t('contact.f_required')">*</span></span>
              <textarea v-model="form.message" class="field min-h-28 resize-y" rows="4" required />
            </label>
            <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <p class="max-w-[22rem] text-[0.82rem] leading-snug text-muted">{{ t('contact.f_note') }}</p>
              <button type="submit" class="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--yellow)] px-6 font-mono text-[0.78rem] uppercase tracking-[0.1em] text-[var(--on-yellow)] transition-transform duration-200 hover:-translate-y-0.5">
                {{ t('contact.f_send') }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
            <p class="min-h-[1.4em] text-[0.88rem] text-ink" aria-live="polite">{{ sent ? t('contact.f_sent', { email: person.email }) : '' }}</p>
          </div>
        </form>
      </div>
      <div class="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-8 font-mono text-[0.8rem] uppercase tracking-[0.08em]">
        <button
          type="button"
          class="inline-flex h-11 items-center rounded-full border border-ink/30 px-4 uppercase transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
          @click="copy"
        >
          {{ copied ? t('contact.copied') : t('contact.copy') }}
        </button>
        <span class="sr-only" aria-live="polite">{{ copied ? t('contact.copied') : '' }}</span>
        <a
          v-for="l in links"
          :key="l.label"
          :href="l.href"
          rel="me noopener"
          target="_blank"
          class="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 transition-colors duration-200 hover:border-ink"
        >{{ l.label }} <span aria-hidden="true" class="text-muted">↗</span></a>
        <a :href="person.cv[lang]" download class="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 transition-colors duration-200 hover:border-ink">{{ t('about.cv') }} <span aria-hidden="true" class="text-muted">↓</span></a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.field-label {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}
.field {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #0e0e10;
  padding: 0.75rem 0.9rem;
  font-size: 1rem;
  color: var(--ink);
  transition: border-color 0.2s ease;
}
.field:hover {
  border-color: #4a4a52;
}
.field:focus {
  border-color: var(--yellow);
}
.when-chip span {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  border-radius: 999px;
  border: 1px solid var(--line);
  padding: 0 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}
.when-chip:hover span {
  border-color: #4a4a52;
}
.when-chip input:checked + span {
  border-color: var(--yellow);
  background: var(--yellow);
  color: var(--on-yellow);
}
.when-chip input:focus-visible + span {
  outline: 3px solid var(--yellow);
  outline-offset: 3px;
}
</style>
