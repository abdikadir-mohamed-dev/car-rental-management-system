import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'
import { setAuthToken } from './authService'

const API_URL = VITE_API_URL

const savedCarService = axios.create({
  baseURL: `${API_URL}/api/saved-cars`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the logged-in user's JWT
setAuthToken(localStorage.getItem('token'), savedCarService)

export const getSavedCars = async () => {
  const response = await savedCarService.get('')
  return response.data.savedCars || []
}

export const saveCar = async (vehicleId) => {
  const response = await savedCarService.post(`/${vehicleId}`)
  return response.data
}

export const removeSavedCar = async (vehicleId) => {
  const response = await savedCarService.delete(`/${vehicleId}`)
  return response.data
}

export const checkSavedCar = async (vehicleId) => {
  const response = await savedCarService.get(`/${vehicleId}/check`)
  return response.data.saved
}

export default savedCarService