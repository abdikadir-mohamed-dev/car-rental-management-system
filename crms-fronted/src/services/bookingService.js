import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const bookingService = axios.create({
  baseURL: `${API_URL}/api/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getBookings = async (params) => {
  return await bookingService.get('/', { params })
}

export const getBooking = async (id) => {
  return await bookingService.get(`/${id}`)
}

export const createBooking = async (bookingData) => {
  return await bookingService.post('/', bookingData)
}

export const updateBookingStatus = async (id, status) => {
  return await bookingService.patch(`/${id}/status`, { status })
}

export default bookingService
