import { configureStore } from '@reduxjs/toolkit'
import agentReducer from "../features/agent/agentSlice"

export default configureStore({
  reducer: {
    agent: agentReducer,
  }
})