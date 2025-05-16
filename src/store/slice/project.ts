import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Member {
  id: string;
  name: string;
}

interface Project {
  name: string;
  teamLeadId: string;
  members: Member[];
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    
  },
});

export const { addProject } = projectSlice.actions;
export default projectSlice.reducer;