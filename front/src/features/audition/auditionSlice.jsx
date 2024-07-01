import { createSlice } from '@reduxjs/toolkit'

export const auditionSlice = createSlice({
  name: 'audition',
  initialState: {
    name: '',
    type: '',
    birthDate: '',
    number: 0,
    auditions: [],
    contradictions:[],
    currentAudition:0,
    qData:{},
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
      state.currentAudition = action.payload.currentAudition
    },
    setContradictions: (state, action) => {
      state.contradictions = action.payload.contradictions
      state.qData = action.payload.qData
    }
  }
})

// Action creators are generated for each case reducer function
export const { setInfo, setAuditions, setContradictions } = auditionSlice.actions

export default auditionSlice.reducer