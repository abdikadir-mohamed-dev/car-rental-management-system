import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const adminService = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getDashboardStats = async () => {
  return await adminService.get('/dashboard')
}

export const getUsers = async (params) => {
  return await adminService.get('/users', { params })
}

export const updateUser = async (id, userData) => {
  return await adminService.put(`/users/${id}`, userData)
}

export const deleteUser = async (id) => {
  return await adminService.delete(`/users/${id}`)
}

export const getVehicles = async (params) => {
  return await adminService.get('/vehicles', { params })
}

export const createVehicle = async (vehicleData) => {
  return await adminService.post('/vehicles', vehicleData)
}

export const updateVehicle = async (id, vehicleData) => {
  return await adminService.put(`/vehicles/${id}`, vehicleData)
}

export const deleteVehicle = async (id) => {
  return await adminService.delete(`/vehicles/${id}`)
}

export const getBookings = async (params) => {
  return await adminService.get('/bookings', { params })
}

export const updateBooking = async (id, bookingData) => {
  return await adminService.put(`/bookings/${id}`, bookingData)
}

export const getPayments = async (params) => {
  return await adminService.get('/payments', { params })
}

export const refundPayment = async (id) => {
  return await adminService.post(`/payments/${id}/refund`)
}

export const getDrivers = async (params) => {
  return await adminService.get('/drivers', { params })
}

export const updateDriver = async (id, driverData) => {
  return await adminService.put(`/drivers/${id}`, driverData)
}

export const createStaff = async (staffData) => {
  return await adminService.post('/staff', staffData)
}

export const createDriver = async (driverData) => {
  return await adminService.post('/drivers', driverData)
}

export const seedData = async (data) => {
  return await adminService.post('/seed', data)
}

export const getReports = async (params) => {
  return await adminService.get('/reports', { params })
}

export const getPolicies = async () => {
  return await adminService.get('/rental-policies')
}

export const updatePolicies = async (policies) => {
  return await adminService.put('/rental-policies', policies)
}

export default adminService
