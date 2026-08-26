import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import driverReducer from './slices/driverSlice'
import vehicleReducer from './slices/vehicleSlice'
import bookingReducer from './slices/bookingSlice'
import paymentReducer from './slices/paymentSlice'
import notificationReducer from './slices/notificationSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    vehicles: vehicleReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
    notifications: notificationReducer,
    users: userReducer,
  },
})

export default store
