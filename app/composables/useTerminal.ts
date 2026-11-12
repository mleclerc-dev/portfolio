/** Open/close state of the terminal, shared by the header button, the shortcut and the terminal itself. */
export function useTerminal() {
  const isOpen = useState('terminal-open', () => false)
  return {
    isOpen,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    toggle: () => (isOpen.value = !isOpen.value),
  }
}
