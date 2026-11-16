import { defineCollection, defineContentConfig, z } from '@nuxt/content'

/*
 * The blog: case studies and answers to the questions clients ask, one collection per language.
 *   content/fr/blog/<slug>.md  →  /blog/<slug>
 *   content/en/blog/<slug>.md  →  /en/blog/<slug>
 * A post with `draft: true` only shows in `nuxt dev`: it is left out of the list, the pages
 * and the sitemap of the built site until it is switched to `false`.
 */
const schema = z.object({
  /** Publication date, YYYY-MM-DD */
  date: z.string(),
  /** "case" (a project told in detail), "guide" (an answer to a client question) or "story" (an experience report) */
  kind: z.enum(['case', 'guide', 'story']).default('case'),
  /** The project it tells, by slug, to link both ways */
  project: z.string().optional(),
  /** Image at the top and on the list, from /public */
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  /** Reading time in minutes, only to override the one counted from the text */
  minutes: z.number().optional(),
  draft: z.boolean().default(false),
})

export default defineContentConfig({
  collections: {
    blog_fr: defineCollection({ type: 'page', source: { include: 'fr/blog/**/*.md', prefix: '/blog' }, schema }),
    blog_en: defineCollection({ type: 'page', source: { include: 'en/blog/**/*.md', prefix: '/en/blog' }, schema }),
  },
})
