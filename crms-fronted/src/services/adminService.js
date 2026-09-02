import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const adminService = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), adminService)

// ============================================================
// DASHBOARD
// ============================================================

export const getDashboardStats = async () => {
  const response = await adminService.get('/dashboard')
  return response.data
}

// ============================================================
// USERS
// ============================================================

export const getUsers = async (params) => {
  const response = await adminService.get('/users', { params })
  return response.data
}

export const updateUser = async (id, userData) => {
  const response = await adminService.put(`/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await adminService.delete(`/users/${id}`)
  return response.data
}

// ============================================================
// VEHICLES
// ============================================================

export const getVehicles = async (params) => {
  const response = await adminService.get('/vehicles', { params })
  return response.data
}

export const getVehicle = async (id) => {
  const response = await adminService.get(`/vehicles/${id}`)
  return response.data
}

export const createVehicle = async (vehicleData) => {
  const response = await adminService.post('/vehicles', vehicleData)
  return response.data
}

export const updateVehicle = async (id, vehicleData) => {
  const response = await adminService.put(`/vehicles/${id}`, vehicleData)
  return response.data
}

export const deleteVehicle = async (id) => {
  const response = await adminService.delete(`/vehicles/${id}`)
  return response.data
}

// ============================================================
// STAFF
// ============================================================

export const getStaff = async (params) => {
  const response = await adminService.get('/staff', { params })
  return response.data
}

export const createStaff = async (staffData) => {
  const response = await adminService.post('/staff', staffData)
  return response.data
}

export const updateStaff = async (id, staffData) => {
  const response = await adminService.put(`/staff/${id}`, staffData)
  return response.data
}

export const updateStaffShift = async (id, shiftData) => {
  const response = await adminService.put(`/staff/${id}/shift`, shiftData)
  return response.data
}

// ============================================================
// RENTAL POLICIES
// ============================================================

export const getPolicies = async () => {
  const response = await adminService.get('/rental-policies')
  return response.data
}

export const updatePolicies = async (policiesData) => {
  const response = await adminService.put(
    '/rental-policies',
    policiesData
  )

  return response.data
}

// ============================================================
// REPORTS
// ============================================================

export const getReports = async (params) => {
  const response = await adminService.get('/reports', { params })
  return response.data
}

// ============================================================
// BOOKINGS
// ============================================================

export const getBookings = async (params) => {
  const response = await adminService.get('/bookings', { params })
  return response.data
}

export const updateBooking = async (id, bookingData) => {
  const response = await adminService.put(
    `/bookings/${id}`,
    bookingData
  )

  return response.data
}

// ============================================================
// PAYMENTS
// ============================================================

export const getPayments = async (params) => {
  const response = await adminService.get('/payments', { params })
  return response.data
}

/*
 * Confirm a cash payment.
 *
 * Cash is created as PENDING during staff check-out.
 * When the customer physically pays the cash,
 * Admin can confirm the payment.
 */
export const confirmPayment = async (id) => {
  const response = await adminService.put(
    `/payments/${id}/confirm`
  )

  return response.data
}

export const refundPayment = async (id) => {
  const response = await adminService.post(
    `/payments/${id}/refund`
  )

  return response.data
}

// ============================================================
// DRIVERS
// ============================================================

export const getDrivers = async (params) => {
  const response = await adminService.get('/drivers', { params })
  return response.data
}

export const createDriver = async (driverData) => {
  const response = await adminService.post(
    '/drivers',
    driverData
  )

  return response.data
}

export const updateDriver = async (id, driverData) => {
  const response = await adminService.put(
    `/drivers/${id}`,
    driverData
  )

  return response.data
}

// ============================================================
// PUBLIC RENTAL POLICIES
// ============================================================

export const getPublicPolicies = async () => {
  const response = await adminService.get(
    '/rental-policies/public'
  )

  return response.data
}

// ============================================================
// REGISTER USER
// ============================================================

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    userData
  )

  return response.data
}

export default adminService