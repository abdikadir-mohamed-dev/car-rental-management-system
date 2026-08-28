import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const paymentService = axios.create({
  baseURL: `${API_URL}/api/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), paymentService)

export const getPayments = async (params) => {
  const response = await paymentService.get('/', { params })
  return response.data.payments || response.data
}

export const getPayment = async (id) => {
  const response = await paymentService.get(`/${id}`)
  return response.data.payment || response.data
}

export const createPayment = async (paymentData) => {
  const response = await paymentService.post('/', paymentData)
  return response.data.payment || response.data
}

export const refundPayment = async (id) => {
  const response = await paymentService.post(`/${id}/refund`)
  return response.data
}

export const getReceipt = async (id) => {
  const response = await paymentService.get(`/${id}/receipt`)
  return response.data
}

export const getPublicConfig = async () => {
  const response = await axios.get(`${API_URL}/auth/config`)
  return response.data
}

export default paymentService
