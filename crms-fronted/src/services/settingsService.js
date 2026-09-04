import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'
import { setAuthToken } from './authService'

const API_URL = VITE_API_URL

const settingsService = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), settingsService)

export const getSettings = async () => {
  const response = await settingsService.get('/settings')
  return response.data.settings
}

export const updateSettings = async (settings) => {
  const response = await settingsService.put('/settings', settings)
  return response.data.settings
}

export default settingsService