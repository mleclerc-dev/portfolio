// Everything is open, except the share-card drawings (the HTML screenshot sources under /og/);
// the share images next to them stay fetchable for social crawlers. The CV pages carry their own noindex.
export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /
Allow: /og/*.png$
Disallow: /og/
Disallow: /en/og/

Sitemap: ${site}/sitemap.xml
`
})
