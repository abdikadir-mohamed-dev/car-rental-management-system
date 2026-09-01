import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const maintenanceService = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), maintenanceService)

export const flagVehicleMaintenance = async (vehicleId, data) => {
  const response = await maintenanceService.post(
    `/staff/vehicles/${vehicleId}/maintenance`,
    data
  )

  return response.data
}

export default maintenanceService