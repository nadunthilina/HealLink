import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          localStorage.setItem('token', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken })
}

// Users API
export const usersAPI = {
  getAll: (role) => api.get('/users', { params: role ? { role } : {} }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, password) => api.post(`/users/${id}/reset-password`, { password }),
  getMe: () => api.get('/users/me')
}

// Patients API
export const patientsAPI = {
  getAll: () => api.get('/patients'),
  getOne: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`)
}

// Caretakers API
export const caretakersAPI = {
  getAll: () => api.get('/caretakers'),
  getOne: (id) => api.get(`/caretakers/${id}`),
  create: (data) => api.post('/caretakers', data),
  update: (id, data) => api.put(`/caretakers/${id}`, data),
  delete: (id) => api.delete(`/caretakers/${id}`)
}

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats')
}

export default api