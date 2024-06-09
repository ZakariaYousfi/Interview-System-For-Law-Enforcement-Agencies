import { createSlice } from '@reduxjs/toolkit'

export const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    name: '',
    username: '',
    password: '',
    affaires: [],
    currentAffaire: 0,
  },
  reducers: {
    setAuth: (state, action) => {
    state.name = action.payload.name
    state.username = action.payload.username
    state.password = action.payload.password
    state.affaires = action.payload.affaires
    state.currentAffaire = action.payload.currentAffaire
    },
    setCurrentAffaire: (state,action) => {
      state.currentAffaire = action.payload.currentAffaire
    }
  }
})

// Action creators are generated for each case reducer function
export const { setAuth, setCurrentAffaire } = agentSlice.actions

export default agentSlice.reducer