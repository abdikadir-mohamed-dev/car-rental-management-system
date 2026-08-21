import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import vehicleService from '../../services/vehicleService'

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getVehicles(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicles')
    }
  }
)

export const fetchVehicle = createAsyncThunk(
  'vehicles/fetchVehicle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getVehicle(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicle')
    }
  }
)

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await vehicleService.createVehicle(vehicleData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create vehicle')
    }
  }
)

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, vehicleData }, { rejectWithValue }) => {
    try {
      const response = await vehicleService.updateVehicle(id, vehicleData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vehicle')
    }
  }
)

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      await vehicleService.deleteVehicle(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete vehicle')
    }
  }
)

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState: {
    vehicles: [],
    currentVehicle: null,
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
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false
        state.vehicles = action.payload.vehicles || action.payload
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.currentVehicle = action.payload.vehicle || action.payload
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload.vehicle || action.payload)
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(v => v._id === action.payload._id)
        if (index !== -1) {
          state.vehicles[index] = action.payload
        }
        if (state.currentVehicle?._id === action.payload._id) {
          state.currentVehicle = action.payload
        }
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter(v => v._id !== action.payload)
      })
  },
})

export const { clearError } = vehicleSlice.actions
export default vehicleSlice.reducer
