import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getPayments,
  createPayment,
  refundPayment as refundPaymentService,
} from '../../services/paymentService'

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getPayments(params)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch payments'
      )
    }
  }
)

export const processPayment = createAsyncThunk(
  'payments/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await createPayment(paymentData)

      return data.payment || data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Payment failed'
      )
    }
  }
)

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async (id, { rejectWithValue }) => {
    try {
      const data = await refundPaymentService(id)

      return data.payment || data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Refund failed'
      )
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

        const payload = action.payload

        state.payments =
          payload?.payments ||
          (Array.isArray(payload) ? payload : [])
      })

      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(processPayment.pending, (state) => {
        state.error = null
      })

      .addCase(processPayment.fulfilled, (state, action) => {
        const payment = action.payload

        if (payment) {
          state.payments.unshift(payment)
        }
      })

      .addCase(processPayment.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(refundPayment.fulfilled, (state, action) => {
        const updatedPayment = action.payload

        const index = state.payments.findIndex(
          (p) => String(p._id) === String(updatedPayment._id)
        )

        if (index !== -1) {
          state.payments[index] = updatedPayment
        }
      })

      .addCase(refundPayment.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError } = paymentSlice.actions

export default paymentSlice.reducer