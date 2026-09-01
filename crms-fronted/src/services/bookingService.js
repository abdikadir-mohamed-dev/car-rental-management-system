import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const bookingService = axios.create({
  baseURL: `${API_URL}/api/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the existing JWT token
setAuthToken(localStorage.getItem('token'), bookingService)

export const getBookings = async (params) => {
  const response = await bookingService.get('/', { params })
  return response.data.bookings || response.data
}

export const getBooking = async (id) => {
  const response = await bookingService.get(`/${id}`)
  return response.data.booking || response.data
}

export const createBooking = async (bookingData) => {
  const response = await bookingService.post('/', bookingData)
  return response.data.booking || response.data
}

export const updateBooking = async (id, bookingData) => {
  const response = await bookingService.put(`/${id}`, bookingData)
  return response.data.booking || response.data
}

export const cancelBooking = async (id, cancellationReason = '') => {
  const response = await bookingService.delete(`/${id}`, {
    data: {
      cancellationReason,
    },
  })

  return response.data
}

export const checkAvailability = async (
  vehicleId,
  pickupDate,
  returnDate
) => {
  const response = await bookingService.get('/availability', {
    params: {
      vehicleId,
      pickupDate,
      returnDate,
    },
  })

  return response.data
}

export const updateBookingStatus = async (id, status) => {
  const response = await bookingService.patch(`/${id}`, {
    status,
  })

  return response.data.booking || response.data
}

export default bookingService