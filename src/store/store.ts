import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/user'
import teamReducer from './slice/team'
import projectReducer from './slice/project'

export const store = configureStore({
    reducer: {
        user: userReducer, 
        team:teamReducer,
        project: projectReducer
    },

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch