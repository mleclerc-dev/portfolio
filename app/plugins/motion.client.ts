// Restore the visitor's "pause animations" choice: the html class right away, so nothing starts
// moving; the reactive state (the switch's label) once the app is mounted, so hydration matches.
export default defineNuxtPlugin(() => {
  let saved = false
  try {
    saved = localStorage.getItem('motion-off') === '1'
  } catch {}
  if (!saved) return
  document.documentElement.classList.add('motion-off')
  onNuxtReady(() => useMotion().set(true))
})
