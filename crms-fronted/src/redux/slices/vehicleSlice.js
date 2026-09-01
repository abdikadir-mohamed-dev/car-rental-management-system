import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getVehicles as getAdminVehicles,
  getVehicle as getAdminVehicle,
  createVehicle as createAdminVehicle,
  updateVehicle as updateAdminVehicle,
  deleteVehicle as deleteAdminVehicle,
} from '../../services/adminService'

// ============================================================
// FETCH ALL VEHICLES
// ============================================================

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getAdminVehicles(params)

      return data.vehicles || data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch vehicles'
      )
    }
  }
)

// ============================================================
// FETCH SINGLE VEHICLE
// ============================================================

export const fetchVehicle = createAsyncThunk(
  'vehicles/fetchVehicle',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getAdminVehicle(id)

      return data.vehicle || data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch vehicle'
      )
    }
  }
)

// ============================================================
// CREATE VEHICLE
// ============================================================

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const data = await createAdminVehicle(vehicleData)

      return data.vehicle || data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to create vehicle'
      )
    }
  }
)

// ============================================================
// UPDATE VEHICLE
// ============================================================

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, vehicleData }, { rejectWithValue }) => {
    try {
      const data = await updateAdminVehicle(
        id,
        vehicleData
      )

      return data.vehicle || data
    } catch (error) {
      console.error(
        'UPDATE VEHICLE API ERROR:',
        error
      )

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to update vehicle'
      )
    }
  }
)

// ============================================================
// DELETE VEHICLE
// ============================================================

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      await deleteAdminVehicle(id)

      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to delete vehicle'
      )
    }
  }
)

// ============================================================
// SLICE
// ============================================================

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

      // ======================================================
      // FETCH VEHICLES
      // ======================================================

      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false
        state.vehicles = action.payload
      })

      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ======================================================
      // FETCH SINGLE VEHICLE
      // ======================================================

      .addCase(fetchVehicle.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.loading = false
        state.currentVehicle = action.payload
      })

      .addCase(fetchVehicle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ======================================================
      // CREATE VEHICLE
      // ======================================================

      .addCase(createVehicle.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false

        state.vehicles.push(
          action.payload
        )
      })

      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ======================================================
      // UPDATE VEHICLE
      // ======================================================

      .addCase(updateVehicle.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false

        const updatedVehicle = action.payload

        const updatedId =
          updatedVehicle.id ??
          updatedVehicle._id

        const index = state.vehicles.findIndex(
          (vehicle) =>
            (vehicle.id ?? vehicle._id) === updatedId
        )

        if (index !== -1) {
          state.vehicles[index] = updatedVehicle
        }

        if (
          state.currentVehicle &&
          (state.currentVehicle.id ??
            state.currentVehicle._id) === updatedId
        ) {
          state.currentVehicle = updatedVehicle
        }
      })

      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ======================================================
      // DELETE VEHICLE
      // ======================================================

      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false

        state.vehicles = state.vehicles.filter(
          (vehicle) =>
            (vehicle.id ?? vehicle._id) !== action.payload
        )
      })

      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = vehicleSlice.actions

export default vehicleSlice.reducer