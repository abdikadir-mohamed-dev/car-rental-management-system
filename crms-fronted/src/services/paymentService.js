import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const paymentService = axios.create({
  baseURL: `${API_URL}/api/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
})

paymentService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

setAuthToken(localStorage.getItem('token'))

export const getPayments = async (params) => {
  return await paymentService.get('/', { params })
}

export const createPayment = async (paymentData) => {
  return await paymentService.post('/', paymentData)
}

export default paymentService
