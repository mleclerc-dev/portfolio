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
  const pages = ['/', '/mentions-legales', ...projects.map((p) => `/projets/${p.slug}`), ...(posts.length ? ['/blog', ...posts.map((n) => n.path)] : [])]
  const url = (lang: 'fr' | 'en', path: string) => `${site}${lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path === '/' ? '' : path}` || site
  const entries = pages.flatMap((path) =>
    (['fr', 'en'] as const).map(
      (lang) => `  <url>
    <loc>${url(lang, path)}</loc>${dates.has(path) ? `\n    <lastmod>${dates.get(path)}</lastmod>` : ''}
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
