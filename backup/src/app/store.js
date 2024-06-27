import { configureStore } from '@reduxjs/toolkit'
import agentReducer from "../features/agent/agentSlice"
import auditionReducer from "../features/audition/auditionSlice"
export default configureStore({
  reducer: {
    agent: agentReducer,
    audition: auditionReducer
  }
})