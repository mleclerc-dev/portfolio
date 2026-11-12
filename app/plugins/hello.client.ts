import { person } from '~/data/content'

// A word for whoever opens the console: the people most likely to want to talk code.
export default defineNuxtPlugin(() => {
  const fr = document.documentElement.lang?.startsWith('fr') ?? true
  console.log(
    '%cml.%c\n' +
      (fr
        ? `Vous lisez le code ? On devrait parler.\n${person.email} · ⌘K pour le terminal`
        : `Reading the source? We should talk.\n${person.email} · ⌘K for the terminal`),
    'font: 800 28px system-ui; color: #f2f2ef; background: #0b0b0c; padding: 4px 10px; border-left: 6px solid #f2d04b',
    'font: 13px ui-monospace, monospace; color: inherit; line-height: 1.6',
  )
})
