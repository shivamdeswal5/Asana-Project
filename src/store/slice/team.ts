import { createSlice} from '@reduxjs/toolkit'

interface Team {
  userId: string;
  teamName: string;
  teamLeadName: string;
}

const initialState = {
  teams: [] as Team[],
}

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.teams.push(action.payload)
    },
  }

})

export const {addProject} = teamSlice.actions

export default teamSlice.reducer