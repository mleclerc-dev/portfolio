import { person } from '~/data/content'

/** "Prochain créneau : janvier 2027", from person.nextSlot; empty once that month has come (or when unset). */
export function useNextSlot() {
  const { t, locale } = useI18n()
  return computed(() => {
    const m = /^(\d{4})-(\d{2})$/.exec(person.nextSlot)
    if (!m) return ''
    const [year, month] = [Number(m[1]), Number(m[2]) - 1]
    const now = new Date()
    if (year * 12 + month <= now.getFullYear() * 12 + now.getMonth()) return ''
    const when = new Intl.DateTimeFormat(locale.value === 'en' ? 'en-GB' : 'fr-FR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1))
    return t('next_slot', { when })
  })
}
