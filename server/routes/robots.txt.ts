// Everything is open, except the share-card drawings; the CV pages carry their own noindex.
export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /
Disallow: /og/
Disallow: /en/og/

Sitemap: ${site}/sitemap.xml
`
})
