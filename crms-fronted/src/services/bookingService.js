import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'

const API_URL = VITE_API_URL

const bookingService = axios.create({
  baseURL: `${API_URL}/api/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================
// AUTHENTICATION
// ============================================================
// Always get the CURRENT user's token before making a request.
// This prevents John's token from being reused after logout/login.
// ============================================================

bookingService.interceptors.request.use(
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

// ============================================================
// BOOKINGS
// ============================================================

export const getBookings = async (params = {}) => {
  const response = await bookingService.get('/', {
    params,
  })

  return response.data.bookings || response.data
}

export const getBooking = async (id) => {
  const response = await bookingService.get(`/${id}`)

  return response.data.booking || response.data
}

export const createBooking = async (bookingData) => {
  const response = await bookingService.post(
    '/',
    bookingData
  )

  return response.data.booking || response.data
}

export const updateBooking = async (
  id,
  bookingData
) => {
  const response = await bookingService.put(
    `/${id}`,
    bookingData
  )

  return response.data.booking || response.data
}

export const cancelBooking = async (
  id,
  cancellationReason = ''
) => {
  const response = await bookingService.delete(
    `/${id}`,
    {
      data: {
        cancellationReason,
      },
    }
  )

  return response.data
}

// ============================================================
// VEHICLE AVAILABILITY
// ============================================================

export const checkAvailability = async (
  vehicleId,
  pickupDate,
  returnDate
) => {
  const response = await bookingService.get(
    '/availability',
    {
      params: {
        vehicleId,
        pickupDate,
        returnDate,
      },
    }
  )

  return response.data
}

// ============================================================
// BOOKING STATUS
// ============================================================

export const updateBookingStatus = async (
  id,
  status
) => {
  const response = await bookingService.patch(
    `/${id}`,
    {
      status,
    }
  )

  return response.data.booking || response.data
}

export default bookingService