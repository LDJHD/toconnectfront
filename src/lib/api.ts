import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1'
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333'

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
})

// Interceptor : on choisit le token en fonction de la zone (admin vs client).
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const isAdminArea = window.location.pathname.startsWith('/admin')
    const token = isAdminArea
      ? (localStorage.getItem('admin_token') || localStorage.getItem('auth_token'))
      : (localStorage.getItem('auth_token') || localStorage.getItem('admin_token'))
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
