import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'

const API_URL = import.meta.env.VITE_API_URL || VITE_API_URL

// ============================================================
// AUTH SERVICE
// ============================================================

const authService = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================
// ATTACH THE LATEST TOKEN TO EVERY AUTH REQUEST
// ============================================================

authService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.headers) {
      delete config.headers.Authorization
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ============================================================
// SET AUTH TOKEN
//
// Other services such as adminService, staffService,
// driverService, notificationService, etc. can use this.
//
// IMPORTANT:
// The request interceptor below reads localStorage EVERY TIME
// a request is made. This prevents the "login -> 401 -> refresh"
// problem.
// ============================================================

export const setAuthToken = (token, service = authService) => {
  // Keep the current default Authorization header updated.
  if (token) {
    service.defaults.headers.common.Authorization =
      `Bearer ${token}`
  } else {
    delete service.defaults.headers.common.Authorization
  }

  // Prevent installing the same interceptor multiple times
  // on the same Axios instance.
  if (!service.__authTokenInterceptorInstalled) {
    service.interceptors.request.use(
      (config) => {
        const latestToken = localStorage.getItem('token')

        config.headers = config.headers || {}

        if (latestToken) {
          config.headers.Authorization =
            `Bearer ${latestToken}`
        } else {
          delete config.headers.Authorization
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    service.__authTokenInterceptorInstalled = true
  }
}

// ============================================================
// LOGIN
// ============================================================

export const login = async (credentials) => {
  const response = await authService.post(
    '/login',
    credentials
  )

  // Immediately make the new token available.
  if (response.data?.token) {
    localStorage.setItem(
      'token',
      response.data.token
    )

    setAuthToken(
      response.data.token,
      authService
    )
  }

  return response
}

// ============================================================
// REGISTER
// ============================================================

export const register = async (userData) => {
  const response = await authService.post(
    '/register',
    userData
  )

  // Registration returns a token as well.
  if (response.data?.token) {
    localStorage.setItem(
      'token',
      response.data.token
    )

    setAuthToken(
      response.data.token,
      authService
    )
  }

  return response
}

// ============================================================
// LOGOUT
// ============================================================

export const logout = async () => {
  try {
    const response = await authService.post('/logout')
    return response
  } finally {
    localStorage.removeItem('token')

    delete authService.defaults.headers.common[
      'Authorization'
    ]
  }
}

// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPassword = async (email) => {
  return await authService.post(
    '/forgot-password',
    { email }
  )
}

// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPassword = async (
  token,
  password
) => {
  return await authService.post(
    `/reset-password/${token}`,
    { password }
  )
}

// ============================================================
// PROFILE
// ============================================================

export const getProfile = async () => {
  return await authService.get('/profile')
}

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePassword = async ({
  currentPassword,
  newPassword,
}) => {
  return await authService.put(
    '/change-password',
    {
      currentPassword,
      newPassword,
    }
  )
}

export default authService