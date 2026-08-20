import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  payments: [],
  loading: false,
  error: null,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
})

export default paymentSlice.reducer
