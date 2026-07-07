import { apiClient } from './client.js'

export async function listEmployees() {
  const { data } = await apiClient.get('/admin/users')
  return data.users
}

export async function createEmployee(payload) {
  const { data } = await apiClient.post('/admin/users', payload)
  return data.user
}

export async function updateEmployee(id, payload) {
  const { data } = await apiClient.patch(`/admin/users/${id}`, payload)
  return data.user
}

export async function deleteEmployee(id) {
  await apiClient.delete(`/admin/users/${id}`)
}

export async function listPermissions() {
  const { data } = await apiClient.get('/permissions')
  return data.permissions
}
