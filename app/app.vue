<script setup lang="ts">
import { person, services, skills, type Locale } from '~/data/content'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const i18nHead = useLocaleHead({ seo: true })
const site = config.public.siteUrl.replace(/\/$/, '')
// One address for the person and the activity, as on the legal notice (Urville-Nacqueville is part of La Hague)
const address = { '@type': 'PostalAddress', addressLocality: 'La Hague', postalCode: '50460', addressRegion: 'Normandie', addressCountry: 'FR' }

useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
  // Who this site is about, for search engines (schema.org): the person and the site
  script: [
    {
      type: 'application/ld+json',
      key: 'ld-person',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': `${site}/#person`,
            name: 'Maxime Leclerc',
            jobTitle: t('meta.job'),
            url: site,
            email: person.email,
            ...(person.photo ? { image: `${site}${person.photo}` } : {}),
            address,
            sameAs: person.links.map((l) => l.href),
            knowsAbout: skills.flatMap((s) => s.items),
          },
          // The freelance activity itself, for local and service searches
          {
            '@type': 'ProfessionalService',
            '@id': `${site}/#service`,
            name: t('meta.site'),
            url: site,
            description: t('meta.description'),
            ...(person.photo ? { image: `${site}${person.photo}` } : {}),
            email: person.email,
            address,
            areaServed: [
              { '@type': 'City', name: 'Cherbourg-en-Cotentin' },
              { '@type': 'AdministrativeArea', name: 'Manche' },
              { '@type': 'AdministrativeArea', name: 'Normandie' },
              { '@type': 'Country', name: 'France' },
            ],
            founder: { '@id': `${site}/#person` },
            knowsLanguage: ['fr', 'en'],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: t('services.heading'),
              itemListElement: services.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: s.title[locale.value as Locale], description: s.text[locale.value as Locale] },
              })),
            },
          },
          {
            '@type': 'WebSite',
            '@id': `${site}/#website`,
            name: t('meta.site'),
            url: site,
            inLanguage: locale.value === 'fr' ? 'fr-FR' : 'en-GB',
            author: { '@id': `${site}/#person` },
          },
        ],
      }),
    },
  ],
}))

// Defaults for every page; project pages override title, description and image.
useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogType: 'website',
  ogSiteName: () => t('meta.site'),
  ogImage: () => `${site}/og/home-${locale.value}.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('meta.title'),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
