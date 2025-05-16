import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'

interface Project {
  name: string;
  members: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organization: string;
  role: string;
  isTeamLead?: boolean;
  teamName?: string;
  projects?: Project[]
  tasks?: string[]
}

const initialState = {
  isLoading: false,
  isError: false,
  users: [] as User[],

}

export const getUsers = createAsyncThunk('getUsers', async () => {
  try {
    const data = await fetch('http://localhost:3000/api/users');
    const result = await data.json();
    console.log("Result: ", result);
    return result;
  } catch (error) {
    console.log("Error: ", error);
    return error;
  }
})

export const addUser = createAsyncThunk('addUser', async (data) => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json();
    console.log("Result: ", result);
    return result;

  } catch (error) {
    console.log("Error: ", error);
    return error;
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  
    assignTeamLead: (state, action) => {
      const user = state.users.find(user => user.id === action.payload.userId);
     
      if (user) {
        user.isTeamLead = true;
        user.teamName = action.payload.teamName;
      }

    },
    createProject: (state, action) => {
      const lead = state.users.find(user => user.id === action.payload.leadId && user.isTeamLead);
      if (!lead) return;

      const project: Project = {
        name: action.payload.projectName,
        members: action.payload.members,
      };

      if (!lead.projects) {
        lead.projects = [];
        lead.projects.push(project);
      }

      action.payload.members.forEach((memberId: string) => {
        const member = state.users.find(user => user.id === memberId);
        if (member) {
          if (!member.projects) {
            member.projects = [];
          }
          const alreadyAssigned = member.projects.some(p => p.name === project.name);
          if (!alreadyAssigned) {
            member.projects.push({ name: project.name, members: [lead.id] });
          }
        }
      });
    },

    addMembersToProject: (state, action) => {
      const lead = state.users.find(user => user.id === action.payload.leadId);
      if (!lead || !lead.projects) {
        console.log("Lead not found");
        return;
      }

      const project = lead.projects.find(p => p.name === action.payload.projectName);
      if (!project) return;

      action.payload.newMembers.forEach((memberId: string) => {
        project.members.push(memberId);

        const member = state.users.find(user => user.id === memberId);
        if (!member) return;

        member.projects = member.projects || [];
        member.projects.push({ name: project.name, members: [lead.id] });
      });
    }


  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        console.log("Pending");
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        console.log("Fulfilled");
        state.isLoading = false;
        state.users.push(action.payload.users);
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.log("Error: ", action.payload);
      })
      .addCase(addUser.pending, () => {
        console.log("Pending");
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload.data);
        console.log("Fulfilled");
      })
      .addCase(addUser.rejected, (state, action) => {
        console.log("Error: ", action.payload);
      })
  },
})

export const {assignTeamLead,createProject,addMembersToProject} = userSlice.actions

export default userSlice.reducer