import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const staffService = axios.create({
  baseURL: `${API_URL}/staff`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), staffService)

/*
 * Staff booking IDs coming from the backend look like:
 * BKG-0001
 *
 * Flask endpoints expect:
 * 1
 *
 * This converts either format safely.
 */
const normalizeBookingId = (id) => {
  if (typeof id === 'number') {
    return id
  }

  if (typeof id === 'string') {
    if (id.startsWith('BKG-')) {
      return parseInt(id.replace('BKG-', ''), 10)
    }

    return parseInt(id, 10)
  }

  return id
}


// =========================
// DASHBOARD
// =========================

export const getStaffDashboard = async () => {
  const response = await staffService.get('/dashboard')
  return response.data
}


// =========================
// BOOKINGS
// =========================

export const getStaffBookings = async (params = {}) => {
  const response = await staffService.get('/bookings', {
    params,
  })

  return response.data
}

export const getPendingBookings = async () => {
  const response = await staffService.get('/bookings/pending')
  return response.data
}

export const getStaffBooking = async (id) => {
  const bookingId = normalizeBookingId(id)

  const response = await staffService.get(
    `/bookings/${bookingId}`
  )

  return response.data
}


// Confirm booking
export const approveBooking = async (id) => {
  const bookingId = normalizeBookingId(id)

  const response = await staffService.put(
    `/bookings/${bookingId}/approve`
  )

  return response.data
}


// Cancel/reject booking
export const rejectBooking = async (id, data = {}) => {
  const bookingId = normalizeBookingId(id)

  const response = await staffService.put(
    `/bookings/${bookingId}/reject`,
    data
  )

  return response.data
}


// Used by BookingManagement.jsx
export const updateStaffBookingStatus = async (id, status) => {
  const bookingId = normalizeBookingId(id)

  if (!bookingId || Number.isNaN(bookingId)) {
    throw new Error(`Invalid booking ID: ${id}`)
  }

  if (status === 'confirmed') {
    return approveBooking(bookingId)
  }

  if (status === 'cancelled') {
    return rejectBooking(bookingId)
  }

  throw new Error(
    `Unsupported staff booking status: ${status}`
  )
}


// =========================
// CHECK-OUT / CHECK-IN
// =========================

export const checkoutBooking = async (id, data = {}) => {
  const bookingId = normalizeBookingId(id)

  if (!bookingId || Number.isNaN(bookingId)) {
    throw new Error(`Invalid booking ID: ${id}`)
  }

  const response = await staffService.post(
    `/bookings/${bookingId}/checkout`,
    data
  )

  return response.data
}

export const checkinBooking = async (id, data = {}) => {
  const bookingId = normalizeBookingId(id)

  if (!bookingId || Number.isNaN(bookingId)) {
    throw new Error(`Invalid booking ID: ${id}`)
  }

  const response = await staffService.post(
    `/bookings/${bookingId}/checkin`,
    data
  )

  return response.data
}


// =========================
// TRIPS
// =========================

export const getTrips = async (params = {}) => {
  const response = await staffService.get('/trips', {
    params,
  })

  return response.data
}

export const updateTripStatus = async (id, status) => {
  const response = await staffService.put(
    `/trips/${id}/status`,
    { status }
  )

  return response.data
}


// =========================
// VEHICLE INSPECTION
// =========================

export const getVehiclesForInspection = async () => {
  const response = await staffService.get(
    '/vehicles/inspection'
  )

  return response.data
}

export const updateVehicleInspection = async (
  id,
  data
) => {
  const response = await staffService.put(
    `/vehicles/${id}/inspection`,
    data
  )

  return response.data
}


// =========================
// CUSTOMERS
// =========================

export const getStaffCustomers = async () => {
  const response = await staffService.get('/customers')
  return response.data
}


// =========================
// DRIVER ASSIGNMENTS
// =========================

export const getDriverRequests = async () => {
  const response = await staffService.get(
    '/driver-assignments'
  )

  return response.data
}

export const assignDriver = async (
  bookingId,
  driverId
) => {
  const normalizedBookingId =
    normalizeBookingId(bookingId)

  const response = await staffService.post(
    '/driver-assignments',
    {
      bookingId: normalizedBookingId,
      driverId,
    }
  )

  return response.data
}


// =========================
// MAINTENANCE
// =========================

export const flagVehicleMaintenance = async (
  vehicleId,
  notes
) => {
  const response = await staffService.post(
    `/vehicles/${vehicleId}/maintenance`,
    { notes }
  )

  return response.data
}


export default staffService