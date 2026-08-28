import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import bookingService from '../../services/bookingService'

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params, { rejectWithValue }) => {
    try {
      const data = await bookingService.getBookings(params)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const fetchBooking = createAsyncThunk(
  'bookings/fetchBooking',
  async (id, { rejectWithValue }) => {
    try {
      const data = await bookingService.getBooking(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking')
    }
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const data = await bookingService.createBooking(bookingData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking')
    }
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const data = await bookingService.updateBooking(id, bookingData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking')
    }
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id, { rejectWithValue }) => {
    try {
      const data = await bookingService.cancelBooking(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking')
    }
  }
)

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
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
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload.bookings || action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload.booking || action.payload
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload.booking || action.payload)
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload
        }
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
  },
})

export const { clearError } = bookingSlice.actions
export default bookingSlice.reducer
