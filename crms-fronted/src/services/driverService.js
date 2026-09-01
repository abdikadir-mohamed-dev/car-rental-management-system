import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const driverService = axios.create({
  baseURL: `${API_URL}/api/driver`,
  headers: {
    'Content-Type': 'application/json',
  },
})

driverService.interceptors.request.use(
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

// ===============================
// DASHBOARD
// GET /api/driver/dashboard
// ===============================

export const getDriverDashboard = async () => {
  const response = await driverService.get('/dashboard')
  return response.data
}

// ===============================
// ASSIGNMENTS
// ===============================

// GET /api/driver-assignments/
export const getAssignments = async () => {
  const response = await axios.get(
    `${API_URL}/api/driver-assignments/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )

  return response.data
}

// PATCH /api/driver-assignments/:id/accept
export const acceptAssignment = async (assignmentId) => {
  const response = await axios.patch(
    `${API_URL}/api/driver-assignments/${assignmentId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )

  return response.data
}

// ===============================
// TRIPS
// ===============================

export const getTrips = async (params) => {
  const response = await driverService.get('/trips', { params })
  return response.data
}

export const getTrip = async (id) => {
  const response = await driverService.get(`/trips/${id}`)
  return response.data
}

export const updateTripStatus = async (id, status) => {
  const response = await driverService.patch(
    `/trips/${id}/status`,
    { status }
  )

  return response.data
}

// ===============================
// AVAILABLE DRIVERS
// IMPORTANT:
// Used by CUSTOMER booking pages.
// DO NOT REMOVE.
// ===============================

export const getDrivers = async () => {
  const response = await driverService.get('/drivers')
  return response.data
}

// ===============================
// BOOKINGS
// ===============================

export const getBookings = async () => {
  const response = await driverService.get('/bookings')
  return response.data
}

// ===============================
// NOTIFICATIONS
// ===============================

export const getNotifications = async () => {
  const response = await driverService.get('/notifications')
  return response.data
}

export const markNotificationRead = async (id) => {
  const response = await driverService.patch(
    `/notifications/${id}/read`
  )

  return response.data
}

export const markAllNotificationsRead = async () => {
  const response = await driverService.patch(
    '/notifications/read-all'
  )

  return response.data
}

export default driverService