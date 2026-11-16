import { projects } from '../../app/data/content'
import { queryCollection } from '@nuxt/content/nitro'

// Every public page, in both languages, each pointing to its translation (hreflang).
// Prerendered at build time into a static sitemap.xml. <lastmod> only where a real date exists (blog posts):
// the build date on every page would be a fake one.
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  // Published blog posts (drafts stay out), by their French path; the English one shares the slug
  const posts = await queryCollection(event, 'blog_fr').where('draft', '=', false).select('path', 'date').all()
  const dates = new Map(posts.map((n) => [n.path, n.date]))
  // Each page as its French and English paths (some English addresses are translated, see nuxt.config i18n.pages)
  const pages: { fr: string; en: string }[] = [
    { fr: '/', en: '/' },
    { fr: '/mentions-legales', en: '/legal-notice' },
    ...projects.map((p) => ({ fr: `/projets/${p.slug}`, en: `/projects/${p.slug}` })),
    ...(posts.length ? [{ fr: '/blog', en: '/blog' }, ...posts.map((n) => ({ fr: n.path, en: n.path }))] : []),
  ]
  const url = (lang: 'fr' | 'en', page: { fr: string; en: string }) => {
    const path = page[lang]
    return `${site}${lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path === '/' ? '' : path}` || site
  }
  const entries = pages.flatMap((page) =>
    (['fr', 'en'] as const).map(
      (lang) => `  <url>
    <loc>${url(lang, page)}</loc>${dates.has(page.fr) ? `\n    <lastmod>${dates.get(page.fr)}</lastmod>` : ''}
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${url('fr', page)}"/>
    <xhtml:link rel="alternate" hreflang="en-GB" href="${url('en', page)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('fr', page)}"/>
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
