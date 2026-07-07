import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const apiClient = axios.create({ baseURL })

let authToken = null

export function setAuthToken(token) {
  authToken = token
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export function getAuthToken() {
  return authToken
}
