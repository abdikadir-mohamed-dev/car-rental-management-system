import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import paymentService from '../../services/paymentService'

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPayments(params)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments')
    }
  }
)

export const processPayment = createAsyncThunk(
  'payments/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await paymentService.processPayment(paymentData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed')
    }
  }
)

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async (id, { rejectWithValue }) => {
    try {
      const data = await paymentService.refundPayment(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Refund failed')
    }
  }
)

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    currentPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload.payments || action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload.payment || action.payload)
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(p => p._id === action.payload._id)
        if (index !== -1) {
          state.payments[index] = action.payload
        }
      })
  },
})

export const { clearError } = paymentSlice.actions
export default paymentSlice.reducer
