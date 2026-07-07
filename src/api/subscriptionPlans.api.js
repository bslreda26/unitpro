import { apiClient } from './client.js'

export async function fetchPublicPlans() {
  const { data } = await apiClient.get('/subscription-plans')
  return data.plans
}

export async function listAdminPlans() {
  const { data } = await apiClient.get('/admin/subscription-plans')
  return data.plans
}

export async function createPlan(payload) {
  const { data } = await apiClient.post('/admin/subscription-plans', payload)
  return data.plan
}

export async function updatePlan(id, payload) {
  const { data } = await apiClient.patch(`/admin/subscription-plans/${id}`, payload)
  return data.plan
}

export async function deletePlan(id) {
  await apiClient.delete(`/admin/subscription-plans/${id}`)
}
