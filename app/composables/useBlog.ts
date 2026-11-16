/** The blog collection for the current language (see content.config.ts). */
export function useBlogCollection() {
  const { locale } = useI18n()
  return computed(() => (locale.value === 'en' ? 'blog_en' : 'blog_fr') as 'blog_fr' | 'blog_en')
}

/** Drafts are only shown in `nuxt dev`, never in the built site. */
export const showDrafts = import.meta.dev

/** "12 novembre 2026" / "12 November 2026" */
export function formatPostDate(date: string, lang: string) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}

/** Announce the blog's RSS feed (one per language) in the page head. */
export function useBlogFeed() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  useHead(() => ({
    link: [{ rel: 'alternate', type: 'application/rss+xml', title: t('blog.meta_title'), href: `${localePath('/blog')}/rss.xml`, key: 'rss' }],
  }))
}

/** Reading time in minutes, counted from a post's body (Nuxt Content's minimark tree) at ~220 words a minute. */
export function readingMinutes(body: unknown) {
  let words = 0
  const walk = (node: unknown): void => {
    if (typeof node === 'string') {
      words += node.split(/\s+/).filter(Boolean).length
      return
    }
    // an element is [tag, props, ...children]
    if (Array.isArray(node)) for (const child of node.slice(2)) walk(child)
  }
  for (const node of (body as { value?: unknown[] } | undefined)?.value ?? []) walk(node)
  return Math.max(1, Math.round(words / 220))
}
