import { createSlice } from '@reduxjs/toolkit'

export const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    name: '',
    username: '',
    password: ''
  },
  reducers: {
    setAuth: (state, action) => {
    state.name = action.payload.name
    state.username = action.payload.username
    state.password = action.payload.password
    },
  }
})

// Action creators are generated for each case reducer function
export const { setAuth } = agentSlice.actions

export default agentSlice.reducer