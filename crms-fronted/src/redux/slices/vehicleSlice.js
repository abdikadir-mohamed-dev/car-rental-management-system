import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  vehicles: [],
  loading: false,
  error: null,
}

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
})

export default vehicleSlice.reducer
