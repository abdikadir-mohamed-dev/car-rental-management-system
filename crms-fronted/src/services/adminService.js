import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const adminService = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getDashboardStats = async () => {
  return await adminService.get('/dashboard')
}

export const getUsers = async (params) => {
  return await adminService.get('/users', { params })
}

export const updateUser = async (id, userData) => {
  return await adminService.put(`/users/${id}`, userData)
}

export const deleteUser = async (id) => {
  return await adminService.delete(`/users/${id}`)
}

export const getReports = async (params) => {
  return await adminService.get('/reports', { params })
}

export default adminService
