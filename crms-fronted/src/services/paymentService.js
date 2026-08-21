import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const paymentService = axios.create({
  baseURL: `${API_URL}/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getPayments = async (params) => {
  return await paymentService.get('/', { params })
}

export const getPayment = async (id) => {
  return await paymentService.get(`/${id}`)
}

export const processPayment = async (paymentData) => {
  return await paymentService.post('/', paymentData)
}

export const refundPayment = async (id) => {
  return await paymentService.post(`/${id}/refund`)
}

export default paymentService
