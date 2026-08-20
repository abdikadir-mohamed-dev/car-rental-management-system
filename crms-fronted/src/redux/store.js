import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import vehicleReducer from './slices/vehicleSlice'
import bookingReducer from './slices/bookingSlice'
import paymentReducer from './slices/paymentSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
    user: userReducer,
  },
})

export default store
