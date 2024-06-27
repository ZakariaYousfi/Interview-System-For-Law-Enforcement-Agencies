import { createSlice } from '@reduxjs/toolkit'

export const auditionSlice = createSlice({
  name: 'audition',
  initialState: {
    name: '',
    type: '',
    birthDate: '',
    number: 0,
    auditions: []
  },
  reducers: {
    setInfo: (state, action) => {
    state.name = action.payload.personName
    state.type = action.payload.personType
    state.birthDate = action.payload.birthDate
    state.number = action.payload.personNumber
    },
    setAuditions: (state,action) => {
      state.auditions = action.payload.auditions
    }
  }
})

// Action creators are generated for each case reducer function
export const { setInfo, setAuditions } = auditionSlice.actions

export default auditionSlice.reducer