/**
 * Every project image wider than 800 px has a smaller copy next to it, `name-800.webp`,
 * so phones and small cards don't download the full-size screenshot.
 */
export function srcsetOf(src: string, width: number): string | undefined {
  return width > 800 ? `${src.replace(/\.webp$/, '-800.webp')} 800w, ${src} ${width}w` : undefined
}
