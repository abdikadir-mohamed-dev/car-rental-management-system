import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const vehicleService = axios.create({
  baseURL: `${API_URL}/api/vehicles`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), vehicleService)

export const getVehicles = async (params) => {
  const response = await vehicleService.get('/', { params })
  return response.data.vehicles || response.data
}

export const getVehicle = async (id) => {
  const response = await vehicleService.get(`/${id}`)
  return response.data.vehicle || response.data
}

export const createVehicle = async (vehicleData) => {
  const response = await vehicleService.post('/', vehicleData)
  return response.data.vehicle || response.data
}

export const updateVehicle = async (id, vehicleData) => {
  const response = await vehicleService.put(`/${id}`, vehicleData)
  return response.data.vehicle || response.data
}

export const deleteVehicle = async (id) => {
  const response = await vehicleService.delete(`/${id}`)
  return response.data
}

export default vehicleService
