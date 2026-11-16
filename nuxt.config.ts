import tailwindcss from '@tailwindcss/vite'

// Canonical, hreflang, sitemap and share images are baked in at `generate`: fall back to the
// real domain, so a build without the variable never ships localhost URLs.
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://maxime-leclerc.com'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  // Page changes cross-fade, and a project's title flies from the list to its page.
  experimental: { viewTransition: true },

  modules: ['@nuxt/fonts', '@nuxtjs/i18n', '@nuxt/content'],

  // Blog (content/<lang>/blog/*.md): Node's own SQLite, no native module to build
  content: {
    experimental: { sqliteConnector: 'native' },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: { siteUrl },
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [{ name: 'theme-color', content: '#0b0b0c' }],
    },
  },

  // The host: Anybody (variable weight and width, driven by the cursor), Instrument Sans for reading, IBM Plex Mono.
  // Then the display face each project wears in its own scene, trimmed to the weights it uses.
  fonts: {
    defaults: { weights: [400], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
    families: [
      { name: 'Anybody', weights: ['100 900'], variableAxis: { wdth: [[50, 150]] } },
      { name: 'Instrument Sans', weights: ['400 700'], styles: ['normal', 'italic'] },
      { name: 'IBM Plex Mono', weights: [400, 500] },
      { name: 'Gilda Display', weights: [400] },
      { name: 'Plus Jakarta Sans', weights: ['400 800'] },
      { name: 'Bricolage Grotesque', weights: ['700 800'] },
      { name: 'Caveat', weights: [600] },
      // Only Kaplouf's title uses it, at 900 and 125 % wide: one static cut instead of the whole variable font
      { name: 'Archivo', weights: [900], variableAxis: { wdth: [125] } },
    ],
  },

  i18n: {
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    baseUrl: siteUrl,
    // English addresses in English; the French ones are the file names
    customRoutes: 'config',
    pages: {
      'projets/[slug]': { fr: '/projets/[slug]', en: '/projects/[slug]' },
      'mentions-legales': { fr: '/mentions-legales', en: '/legal-notice' },
    },
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
  },

  nitro: {
    prerender: {
      routes: [
        '/', '/en', '/cv', '/en/cv', '/mentions-legales', '/en/legal-notice', '/blog', '/en/blog', '/blog/rss.xml', '/en/blog/rss.xml', '/sitemap.xml', '/robots.txt',
        // the share-card drawings, screenshotted into public/og/ (not linked, noindex)
        ...['home', 'move-taxi', 'kaplouf', 'mariage', 'noel-des-copains'].flatMap((id) => [`/og/${id}`, `/en/og/${id}`]),
      ],
      crawlLinks: true,
    },
  },
})
