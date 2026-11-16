import { defineCollection, defineContentConfig, z } from '@nuxt/content'

/*
 * Notes: case studies and answers to the questions clients ask, one collection per language.
 *   content/fr/notes/<slug>.md  →  /notes/<slug>
 *   content/en/notes/<slug>.md  →  /en/notes/<slug>
 * A note with `draft: true` only shows in `nuxt dev`: it is left out of the list, the pages
 * and the sitemap of the built site until it is switched to `false`.
 */
const schema = z.object({
  /** Publication date, YYYY-MM-DD */
  date: z.string(),
  /** "case" (a project told in detail) or "guide" (an answer to a client question) */
  kind: z.enum(['case', 'guide']).default('case'),
  /** The project it tells, by slug, to link both ways */
  project: z.string().optional(),
  /** Image at the top and on the list, from /public */
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  /** Estimated reading time, in minutes */
  minutes: z.number().optional(),
  draft: z.boolean().default(false),
})

export default defineContentConfig({
  collections: {
    notes_fr: defineCollection({ type: 'page', source: { include: 'fr/notes/**/*.md', prefix: '/notes' }, schema }),
    notes_en: defineCollection({ type: 'page', source: { include: 'en/notes/**/*.md', prefix: '/en/notes' }, schema }),
  },
})
