import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import driverService from '../../services/driverService'

export const fetchDashboard = createAsyncThunk(
  'driver/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await driverService.getDriverDashboard()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard')
    }
  }
)

export const fetchAssignments = createAsyncThunk(
  'driver/fetchAssignments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getAssignments(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments')
    }
  }
)

export const fetchTrips = createAsyncThunk(
  'driver/fetchTrips',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getTrips(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trips')
    }
  }
)

export const fetchEarnings = createAsyncThunk(
  'driver/fetchEarnings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getEarnings(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch earnings')
    }
  }
)

export const fetchEarningsSummary = createAsyncThunk(
  'driver/fetchEarningsSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getEarningsSummary(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch earnings summary')
    }
  }
)

export const fetchBookings = createAsyncThunk(
  'driver/fetchBookings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getBookings(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const fetchVehicles = createAsyncThunk(
  'driver/fetchVehicles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getVehicles(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicles')
    }
  }
)

export const fetchCustomers = createAsyncThunk(
  'driver/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getCustomers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers')
    }
  }
)

export const fetchMaintenance = createAsyncThunk(
  'driver/fetchMaintenance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getMaintenance(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch maintenance')
    }
  }
)

export const createMaintenance = createAsyncThunk(
  'driver/createMaintenance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await driverService.createMaintenance(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create maintenance')
    }
  }
)

export const fetchReports = createAsyncThunk(
  'driver/fetchReports',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getReports(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports')
    }
  }
)

export const fetchNotifications = createAsyncThunk(
  'driver/fetchNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getNotifications(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  'driver/markNotificationRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await driverService.markNotificationRead(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read')
    }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  'driver/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await driverService.markAllNotificationsRead()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read')
    }
  }
)

export const fetchPayments = createAsyncThunk(
  'driver/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverService.getPayments(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments')
    }
  }
)

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    dashboard: null,
    assignments: [],
    trips: [],
    earnings: [],
    earningsSummary: null,
    bookings: [],
    vehicles: [],
    customers: [],
    maintenance: [],
    reports: null,
    notifications: [],
    unreadCount: 0,
    payments: [],
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
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.dashboard = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.trips = action.payload
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.earnings = action.payload
      })
      .addCase(fetchEarningsSummary.fulfilled, (state, action) => {
        state.earningsSummary = action.payload
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.maintenance = action.payload
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.maintenance.unshift(action.payload)
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.read).length
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id)
        if (index !== -1) {
          state.notifications[index].read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.read = true)
        state.unreadCount = 0
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload
      })
  },
})

export const { clearError } = driverSlice.actions
export default driverSlice.reducer
