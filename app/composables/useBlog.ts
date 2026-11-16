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
