import { apiClient } from './client.js'

export async function fetchPublicClasses() {
  const { data } = await apiClient.get('/group-classes')
  return data.classes
}

export async function fetchPublicSchedule() {
  const { data } = await apiClient.get('/class-schedule')
  return data.slots
}

export async function listAdminClasses() {
  const { data } = await apiClient.get('/admin/group-classes')
  return data.classes
}

export async function createClass(payload) {
  const { data } = await apiClient.post('/admin/group-classes', payload)
  return data.class
}

export async function updateClass(id, payload) {
  const { data } = await apiClient.patch(`/admin/group-classes/${id}`, payload)
  return data.class
}

export async function deleteClass(id) {
  await apiClient.delete(`/admin/group-classes/${id}`)
}

export async function listAdminSchedule() {
  const { data } = await apiClient.get('/admin/class-schedule')
  return data.slots
}

export async function createSlot(payload) {
  const { data } = await apiClient.post('/admin/class-schedule', payload)
  return data.slot
}

export async function updateSlot(id, payload) {
  const { data } = await apiClient.patch(`/admin/class-schedule/${id}`, payload)
  return data.slot
}

export async function deleteSlot(id) {
  await apiClient.delete(`/admin/class-schedule/${id}`)
}
