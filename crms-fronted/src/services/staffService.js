import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const staffService = axios.create({
  baseURL: `${API_URL}/staff`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), staffService)

export const getStaffDashboard = async () => {
  const response = await staffService.get('/dashboard')
  return response.data
}

export const getPendingBookings = async () => {
  const response = await staffService.get('/bookings/pending')
  return response.data
}

export const approveBooking = async (id, data) => {
  const response = await staffService.put(`/bookings/${id}/approve`, data)
  return response.data
}

export const rejectBooking = async (id, data) => {
  const response = await staffService.put(`/bookings/${id}/reject`, data)
  return response.data
}

export const getTrips = async (params) => {
  const response = await staffService.get('/trips', { params })
  return response.data
}

export const updateTripStatus = async (id, status) => {
  const response = await staffService.put(`/trips/${id}/status`, { status })
  return response.data
}

export const getVehiclesForInspection = async () => {
  const response = await staffService.get('/vehicles/inspection')
  return response.data
}

export const updateVehicleInspection = async (id, data) => {
  const response = await staffService.put(`/vehicles/${id}/inspection`, data)
  return response.data
}

export const updateStaffBookingStatus = async (id, status) => {
  const response = await staffService.put(`/bookings/${id}/approve`, { status })
  return response.data
}

export const checkoutBooking = async (id, data) => {
  const response = await staffService.post(`/bookings/${id}/checkout`, data)
  return response.data
}

export const checkinBooking = async (id, data) => {
  const response = await staffService.post(`/bookings/${id}/checkin`, data)
  return response.data
}

export const getStaffCustomers = async () => {
  const response = await staffService.get('/customers')
  return response.data
}

export const getDriverRequests = async () => {
  const response = await staffService.get('/driver-assignments')
  return response.data
}

export const assignDriver = async (bookingId, driverId) => {
  const response = await staffService.post('/driver-assignments', { bookingId, driverId })
  return response.data
}

export const flagVehicleMaintenance = async (vehicleId, notes) => {
  const response = await staffService.post(`/vehicles/${vehicleId}/maintenance`, { notes })
  return response.data
}

export default staffService
