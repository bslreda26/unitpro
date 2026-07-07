import { apiClient } from './client.js'

export async function fetchPublicContactInfo() {
  const { data } = await apiClient.get('/contact-info')
  return data.contactInfo
}

export async function fetchAdminContactInfo() {
  const { data } = await apiClient.get('/admin/contact-info')
  return data.contactInfo
}

export async function updateContactInfo(payload) {
  const { data } = await apiClient.patch('/admin/contact-info', payload)
  return data.contactInfo
}
