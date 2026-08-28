import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const driverService = axios.create({
  baseURL: `${API_URL}/api/driver`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), driverService)

export const getDriverDashboard = async () => {
  const response = await driverService.get('/dashboard')
  return response.data
}

export const getTrips = async (params) => {
  const response = await driverService.get('/trips', { params })
  return response.data
}

export const getTrip = async (id) => {
  const response = await driverService.get(`/trips/${id}`)
  return response.data
}

export const updateTripStatus = async (id, status) => {
  const response = await driverService.put(`/trips/${id}/status`, { status })
  return response.data
}

export const getEarnings = async (params) => {
  const response = await driverService.get('/earnings', { params })
  return response.data
}

export const getDrivers = async (params) => {
  const response = await driverService.get('/drivers', { params })
  return response.data
}

export default driverService
