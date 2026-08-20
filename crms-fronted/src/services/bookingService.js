import axios from 'axios'
import { setAuthToken } from './authService'
import { getMockBookings } from '../utils/staffMockData'

const API_URL = import.meta.env.VITE_API_URL

const bookingService = axios.create({
  baseURL: `${API_URL}/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getBookings = async (params) => {
  try {
    return await bookingService.get('/', { params })
  } catch {
    return getMockBookings()
  }
}

export const getBooking = async (id) => {
  try {
    return await bookingService.get(`/${id}`)
  } catch {
    const mock = getMockBookings().data.bookings.find(b => b._id === id || b._id?.slice(-8) === id)
    return { data: mock || { _id: id } }
  }
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
