/*
 * The visitor's "pause animations" switch (WCAG 2.2.2: anything moving for more than five
 * seconds can be stopped). Remembered in localStorage, applied as html.motion-off: CSS stops
 * animations and transitions, and the canvas, autoplay and kinetic text check motionOff().
 */
export function useMotion() {
  const off = useState('motion-off', () => false)
  function set(value: boolean) {
    off.value = value
    if (!import.meta.client) return
    document.documentElement.classList.toggle('motion-off', value)
    try {
      localStorage.setItem('motion-off', value ? '1' : '0')
    } catch {}
    window.dispatchEvent(new CustomEvent('motionchange', { detail: value }))
  }
  return { off, set, toggle: () => set(!off.value) }
}

/** True when the visitor paused the animations (client only) */
export const motionOff = () => import.meta.client && document.documentElement.classList.contains('motion-off')
