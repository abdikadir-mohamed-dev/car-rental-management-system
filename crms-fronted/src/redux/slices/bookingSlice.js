import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getBookings,
  getBooking,
  createBooking as createBookingService,
  updateBooking as updateBookingService,
  cancelBooking as cancelBookingService,
} from '../../services/bookingService'

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getBookings(params)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      )
    }
  }
)

export const fetchBooking = createAsyncThunk(
  'bookings/fetchBooking',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getBooking(id)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking'
      )
    }
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const data = await createBookingService(bookingData)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create booking'
      )
    }
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const data = await updateBookingService(id, bookingData)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update booking'
      )
    }
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, cancellationReason = '' }, { rejectWithValue }) => {
    try {
      const data = await cancelBookingService(id, cancellationReason)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      )
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

      // FETCH ALL BOOKINGS
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false

        const payload = action.payload

        state.bookings = Array.isArray(payload)
          ? payload
          : payload?.bookings || []
      })

      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // FETCH SINGLE BOOKING
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false

        const payload = action.payload

        state.currentBooking = payload?.booking || payload
      })

      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // CREATE BOOKING
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false

        const booking = action.payload?.booking || action.payload

        if (booking) {
          state.bookings.unshift(booking)
        }
      })

      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // UPDATE BOOKING
      .addCase(updateBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false

        const booking = action.payload?.booking || action.payload

        if (!booking) return

        const index = state.bookings.findIndex(
          (b) => String(b._id) === String(booking._id)
        )

        if (index !== -1) {
          state.bookings[index] = booking
        }

        if (
          state.currentBooking &&
          String(state.currentBooking._id) === String(booking._id)
        ) {
          state.currentBooking = booking
        }
      })

      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // CANCEL BOOKING
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false

        const booking = action.payload?.booking || action.payload

        if (!booking?._id) return

        const index = state.bookings.findIndex(
          (b) => String(b._id) === String(booking._id)
        )

        if (index !== -1) {
          state.bookings[index] = booking
        }

        if (
          state.currentBooking &&
          String(state.currentBooking._id) === String(booking._id)
        ) {
          state.currentBooking = booking
        }
      })

      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = bookingSlice.actions

export default bookingSlice.reducer