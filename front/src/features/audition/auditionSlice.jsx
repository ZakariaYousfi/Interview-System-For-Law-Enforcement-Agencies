import { createSlice } from '@reduxjs/toolkit'

export const auditionSlice = createSlice({
  name: 'audition',
  initialState: {
    name: '',
    type: '',
    birthDate: '',
    number: 0
  },
  reducers: {
    setInfo: (state, action) => {
    state.name = action.payload.name
    state.type = action.payload.type
    state.birthDate = action.payload.birthDate
    state.number = action.payload.number
    },
  }
})

// Action creators are generated for each case reducer function
export const { setInfo } = auditionSlice.actions

export default auditionSlice.reducer