import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const vehicleService = axios.create({
  baseURL: `${API_URL}/api/vehicles`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getVehicles = async (params) => {
  return await vehicleService.get('/', { params })
}

export const getVehicle = async (id) => {
  return await vehicleService.get(`/${id}`)
}

export const createVehicle = async (vehicleData) => {
  return await vehicleService.post('/', vehicleData)
}

export const updateVehicle = async (id, vehicleData) => {
  return await vehicleService.patch(`/${id}`, vehicleData)
}

export default vehicleService
