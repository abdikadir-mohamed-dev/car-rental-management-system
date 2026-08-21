import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const bookingService = axios.create({
  baseURL: `${API_URL}/bookings`,
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

export const updateBooking = async (id, bookingData) => {
  return await bookingService.put(`/${id}`, bookingData)
}

export const cancelBooking = async (id) => {
  return await bookingService.delete(`/${id}`)
}

export default bookingService
