import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/nitro'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** The blog's RSS feed for one language: published posts, newest first. Prerendered at build time. */
export async function blogFeed(event: H3Event, lang: 'fr' | 'en') {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  const posts = await queryCollection(event, lang === 'en' ? 'blog_en' : 'blog_fr').where('draft', '=', false).order('date', 'DESC').all()
  const home = `${site}${lang === 'en' ? '/en' : ''}/blog`
  const items = posts
    .map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site}${p.path}</link>
      <guid isPermaLink="true">${site}${p.path}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.description ?? '')}</description>
    </item>`)
    .join('\n')
  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${lang === 'en' ? 'Maxime Leclerc · Logbook' : 'Maxime Leclerc · Carnet de bord'}</title>
    <link>${home}</link>
    <atom:link href="${home}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${lang === 'en' ? 'Case studies, behind-the-scenes and advice from a freelance web developer.' : 'Études de cas, coulisses et conseils d’un développeur web freelance.'}</description>
    <language>${lang === 'en' ? 'en-GB' : 'fr-FR'}</language>
${items}
  </channel>
</rss>
`
}
