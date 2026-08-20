import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export default userSlice.reducer
