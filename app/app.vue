<script setup lang="ts">
import { person, skills } from '~/data/content'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const i18nHead = useLocaleHead({ seo: true })
const site = config.public.siteUrl.replace(/\/$/, '')

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
            email: `mailto:${person.email}`,
            address: { '@type': 'PostalAddress', addressLocality: 'Urville-Nacqueville', addressRegion: 'Normandie', addressCountry: 'FR' },
            sameAs: person.links.map((l) => l.href),
            knowsAbout: skills.flatMap((s) => s.items),
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
