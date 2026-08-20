import axios from 'axios'
import { setAuthToken } from './authService'
import { getMockDashboard, getMockTrips, getMockVehiclesForInspection } from '../utils/staffMockData'

const API_URL = import.meta.env.VITE_API_URL

const staffService = axios.create({
  baseURL: `${API_URL}/staff`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getStaffDashboard = async () => {
  try {
    return await staffService.get('/dashboard')
  } catch {
    return { data: getMockDashboard() }
  }
}

export const getPendingBookings = async () => {
  try {
    return await staffService.get('/bookings/pending')
  } catch {
    return { data: { bookings: [] } }
  }
}

export const approveBooking = async (id, data) => {
  return await staffService.put(`/bookings/${id}/approve`, data)
}

export const rejectBooking = async (id, data) => {
  return await staffService.put(`/bookings/${id}/reject`, data)
}

export const getTrips = async (params) => {
  try {
    return await staffService.get('/trips', { params })
  } catch {
    return getMockTrips()
  }
}

export const updateTripStatus = async (id, status) => {
  return await staffService.put(`/trips/${id}/status`, { status })
}

export const getVehiclesForInspection = async () => {
  try {
    return await staffService.get('/vehicles/inspection')
  } catch {
    return { data: getMockVehiclesForInspection() }
  }
}

export const updateVehicleInspection = async (id, data) => {
  return await staffService.put(`/vehicles/${id}/inspection`, data)
}

export default staffService
