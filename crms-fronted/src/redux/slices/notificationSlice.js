import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
})

export default notificationSlice.reducer
