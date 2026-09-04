import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'

const API_URL = import.meta.env.VITE_API_URL || VITE_API_URL

// Shared axios instance factory used by every service module, so the
// auth-header and session-expiry handling below lives in exactly one
// place instead of being copy-pasted (and drifting) per service.
export const createApiClient = (basePath) => {
  const client = axios.create({
    baseURL: `${API_URL}${basePath}`,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Always read the CURRENT token from localStorage on every request,
  // instead of capturing it once at module load (which would keep
  // sending stale/missing auth after a login/logout without a full
  // page reload).
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        delete config.headers.Authorization
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  // A 401 means the session token is missing, invalid or expired.
  // Clear it and send the user back to login instead of leaving every
  // subsequent call on the page failing silently.
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}

export default createApiClient
