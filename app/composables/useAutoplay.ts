/*
 * Lets a preview play by itself while it is on screen: `step` runs every `every` ms once
 * at least half of `target` is visible (the first time after `first` ms). It pauses when
 * the preview leaves the screen or the tab is hidden, and stops for good as soon as the
 * visitor touches it (pointer or keyboard): from then on, it's theirs.
 * Nothing plays under reduced motion.
 */
export function useAutoplay(target: Ref<HTMLElement | null>, step: () => void, every: number, first = every) {
  const stopped = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let visible = false
  let cleanup = () => {}

  const schedule = (ms: number) => {
    clearTimeout(timer)
    if (stopped.value || !visible || document.hidden || motionOff()) return
    timer = setTimeout(() => {
      step()
      schedule(every)
    }, ms)
  }
  const stop = () => {
    stopped.value = true
    clearTimeout(timer)
  }

  onMounted(() => {
    const el = target.value
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        const now = !!e && e.intersectionRatio >= 0.5
        if (now && !visible) {
          visible = true
          schedule(first)
        } else if (!now) {
          visible = false
          clearTimeout(timer)
        }
      },
      { threshold: [0, 0.5] },
    )
    const onVis = () => (document.hidden ? clearTimeout(timer) : schedule(every))
    io.observe(el)
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('motionchange', onVis)
    el.addEventListener('pointerdown', stop, { once: true })
    el.addEventListener('keydown', stop, { once: true })
    cleanup = () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('motionchange', onVis)
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('keydown', stop)
    }
  })
  onBeforeUnmount(() => {
    clearTimeout(timer)
    cleanup()
  })

  return { stopped }
}

/** Animates a number ref towards `to`, in steps of `by`, one step every `ms`. */
export function stepTowards(value: Ref<number>, to: number, by: number, ms = 40) {
  let timer: ReturnType<typeof setInterval> | undefined
  timer = setInterval(() => {
    const d = to - value.value
    if (Math.abs(d) <= by) {
      value.value = to
      clearInterval(timer)
    } else value.value += Math.sign(d) * by
  }, ms)
  return () => clearInterval(timer)
}
