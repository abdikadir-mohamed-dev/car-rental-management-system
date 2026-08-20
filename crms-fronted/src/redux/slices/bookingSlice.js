import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bookings: [],
  loading: false,
  error: null,
}

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
})

export default bookingSlice.reducer
