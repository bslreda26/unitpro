/** WhatsApp click-to-chat (international number, no + in path). */
export function getWhatsAppUrl(message = '', number = '') {
  const text = typeof message === 'string' && message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ''
  return `https://wa.me/${number}${text}`
}
