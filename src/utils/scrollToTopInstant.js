/**
 * Jump to top without CSS `scroll-behavior: smooth` on `html` affecting it.
 */
export function scrollToTopInstant() {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  } catch {
    window.scrollTo(0, 0)
  }
}
