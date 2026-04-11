/** WhatsApp click-to-chat (international number, no + in path). */
export const WHATSAPP_NUMBER = '2250702604309'

export function getWhatsAppUrl(message = '') {
  const text = typeof message === 'string' && message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ''
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`
}
