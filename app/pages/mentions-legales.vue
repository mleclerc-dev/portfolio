<script setup lang="ts">
import { legal, person, type Locale } from '~/data/content'

/*
 * Legal notice (LCEN, art. 6 III) and personal data (GDPR): who publishes the site,
 * who hosts it, and what happens to what visitors type or store.
 */
const { t, locale } = useI18n()
const lang = computed(() => locale.value as Locale)
useSeoMeta({
  title: () => `${t('legal.title')} · Maxime Leclerc`,
  description: () => t('legal.description'),
  ogTitle: () => `${t('legal.title')} · Maxime Leclerc`,
  ogDescription: () => t('legal.description'),
})

const fr = computed(() => lang.value === 'fr')
</script>

<template>
  <section data-scene="host" class="mx-auto max-w-[90rem] px-4 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
    <p class="eyebrow">{{ t('legal.kicker') }}</p>
    <h1 data-face="host" class="mt-4 text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.9]">{{ t('legal.title') }}</h1>

    <div class="mt-12 grid gap-3 lg:grid-cols-2">
      <!-- Publisher -->
      <section class="panel p-6 sm:p-8" aria-labelledby="legal-publisher">
        <h2 id="legal-publisher" class="eyebrow">{{ fr ? 'Éditeur du site' : 'Publisher' }}</h2>
        <dl class="mt-5 grid gap-x-6 gap-y-3 text-[1rem] leading-snug sm:grid-cols-[11rem_1fr]">
          <dt class="text-muted">{{ fr ? 'Nom' : 'Name' }}</dt>
          <dd>{{ person.name }}</dd>
          <dt class="text-muted">{{ fr ? 'Statut' : 'Legal form' }}</dt>
          <dd>{{ legal.status[lang] }}</dd>
          <dt class="text-muted">SIRET</dt>
          <dd class="tabular-nums">{{ legal.siret }}</dd>
          <dt class="text-muted">{{ fr ? 'Activité' : 'Activity' }}</dt>
          <dd>{{ legal.activity[lang] }}</dd>
          <dt class="text-muted">{{ fr ? 'Adresse' : 'Address' }}</dt>
          <dd>{{ legal.address }}</dd>
          <dt class="text-muted">{{ fr ? 'Contact' : 'Contact' }}</dt>
          <dd><a :href="`mailto:${person.email}`" class="link-underline">{{ person.email }}</a></dd>
          <dt class="text-muted">{{ fr ? 'Directeur de la publication' : 'Publication director' }}</dt>
          <dd>{{ person.name }}</dd>
        </dl>
      </section>

      <!-- Host -->
      <section class="panel p-6 sm:p-8" aria-labelledby="legal-host">
        <h2 id="legal-host" class="eyebrow">{{ fr ? 'Hébergeur' : 'Host' }}</h2>
        <dl class="mt-5 grid gap-x-6 gap-y-3 text-[1rem] leading-snug sm:grid-cols-[11rem_1fr]">
          <dt class="text-muted">{{ fr ? 'Société' : 'Company' }}</dt>
          <dd>{{ legal.host.name }}</dd>
          <dt class="text-muted">{{ fr ? 'Adresse' : 'Address' }}</dt>
          <dd>{{ legal.host.address[lang] }}</dd>
          <dt class="text-muted">{{ fr ? 'Site' : 'Website' }}</dt>
          <dd><a :href="legal.host.url" target="_blank" rel="noopener" class="link-underline">{{ legal.host.url.replace('https://', '') }}</a></dd>
        </dl>
        <p class="mt-6 text-[0.95rem] leading-relaxed text-muted">
          {{ fr
            ? 'Les textes, visuels et le code de ce site sont de Maxime Leclerc, sauf mention contraire. Les noms et logos des projets clients restent la propriété de leurs titulaires.'
            : 'The text, visuals and code of this site are by Maxime Leclerc unless stated otherwise. Client project names and logos remain the property of their owners.' }}
        </p>
      </section>

      <!-- Personal data -->
      <section class="panel p-6 sm:p-8 lg:col-span-2" aria-labelledby="legal-data">
        <h2 id="legal-data" class="eyebrow">{{ fr ? 'Données personnelles' : 'Personal data' }}</h2>
        <div v-if="fr" class="mt-5 max-w-[46rem] space-y-4 text-[1.05rem] leading-[1.6]">
          <p><strong>Formulaire de contact.</strong> Le site n’envoie ni ne stocke rien : le formulaire prépare un e-mail dans votre propre messagerie, que vous choisissez d’envoyer ou non. Votre nom, votre adresse et votre message ne servent qu’à vous répondre et à échanger sur votre projet. Ils sont conservés dans ma messagerie (Gmail) au plus 3 ans après notre dernier échange, et ne sont jamais transmis à des tiers.</p>
          <p><strong>Cookies et traceurs.</strong> Aucune mesure d’audience, aucune publicité. Le site enregistre seulement dans votre navigateur la langue choisie (cookie <code class="font-mono text-[0.9em]">i18n_locale</code>), votre préférence d’animations et l’historique du terminal. Ce sont des réglages techniques, qui ne quittent pas votre appareil.</p>
          <p><strong>Services tiers.</strong> La météo et la marée d’Urville viennent d’<a href="https://open-meteo.com" target="_blank" rel="noopener" class="link-underline">Open-Meteo</a>, interrogé directement par votre navigateur : ce service voit donc votre adresse IP. L’hébergeur peut aussi conserver des journaux techniques (adresse IP, date, page demandée) pour la sécurité du site.</p>
          <p><strong>Vos droits.</strong> Vous pouvez demander l’accès, la rectification ou l’effacement de vos données en m’écrivant à <a :href="`mailto:${person.email}`" class="link-underline">{{ person.email }}</a>. Si la réponse ne vous convient pas, vous pouvez saisir la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener" class="link-underline">CNIL</a>.</p>
        </div>
        <div v-else class="mt-5 max-w-[46rem] space-y-4 text-[1.05rem] leading-[1.6]">
          <p><strong>Contact form.</strong> The site neither sends nor stores anything: the form drafts an email in your own mail app, which you choose to send or not. Your name, address and message are only used to reply and discuss your project. They are kept in my mailbox (Gmail) for up to 3 years after our last exchange, and never shared with third parties.</p>
          <p><strong>Cookies and trackers.</strong> No analytics, no advertising. The site only stores in your browser the language you picked (<code class="font-mono text-[0.9em]">i18n_locale</code> cookie), your motion preference and the terminal history. These are technical settings that never leave your device.</p>
          <p><strong>Third-party services.</strong> The Urville weather and tide come from <a href="https://open-meteo.com" target="_blank" rel="noopener" class="link-underline">Open-Meteo</a>, queried directly by your browser, so that service sees your IP address. The host may also keep technical logs (IP address, date, page requested) for security.</p>
          <p><strong>Your rights.</strong> You can ask to access, correct or delete your data by writing to <a :href="`mailto:${person.email}`" class="link-underline">{{ person.email }}</a>. If you are not satisfied with the answer, you can complain to the French data protection authority, the <a href="https://www.cnil.fr/en/complaints" target="_blank" rel="noopener" class="link-underline">CNIL</a>.</p>
        </div>
      </section>
    </div>
  </section>
</template>
