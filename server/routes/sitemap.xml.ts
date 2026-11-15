import { projects } from '../../app/data/content'

// Every public page, in both languages, each pointing to its translation (hreflang).
// Prerendered at build time into a static sitemap.xml.
export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  const pages = ['/', '/mentions-legales', ...projects.map((p) => `/projets/${p.slug}`)]
  const url = (lang: 'fr' | 'en', path: string) => `${site}${lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path === '/' ? '' : path}` || site
  const today = new Date().toISOString().slice(0, 10)
  const entries = pages.flatMap((path) =>
    (['fr', 'en'] as const).map(
      (lang) => `  <url>
    <loc>${url(lang, path)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${url('fr', path)}"/>
    <xhtml:link rel="alternate" hreflang="en-GB" href="${url('en', path)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('fr', path)}"/>
  </url>`,
    ),
  )
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
})
