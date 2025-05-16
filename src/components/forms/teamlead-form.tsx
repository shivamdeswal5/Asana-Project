'use client';

import {
  Box,Button,Typography,TextField,MenuItem,Select, InputLabel,FormControl} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useState } from 'react';
import { addProject } from '@/store/slice/project'; 
import type { SelectChangeEvent } from '@mui/material/Select';

interface FormData {
  projectName: string;
}

const schema = yup
  .object({
    projectName: yup.string().required('Project Name is required'),
  })
  .required();

export default function TeamLeadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  console.log("Current User: ",currentUser)
  const users = useSelector((state: RootState) => state.user.users);
  const projects = useSelector((state: RootState) => state.project.projects);
  console.log("Projects: ",projects);

  const eligibleUsers = users.filter(
    (user) => user.role !== 'admin' && !user.isTeamLead && user.id !== currentUser.id
  );
  const getUserName = (id: string) => users.find(user => user.id === id)?.name || '[Unknown]';

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

 

  const handleChangeMembers = (e: SelectChangeEvent<string[]>) => {
    setSelectedMembers(e.target.value as string[]);
  };

  const onSubmit = (data: FormData) => {
    console.log("Data inside team lead form: ",data);
    const members = selectedMembers.map((id) => {
      const user = users.find((u) => u.id === id);
      return {
        id: user?.id || '',
        name: user?.name || '',
      };
    });

    const project = {
      name: data.projectName,
      teamLeadId: currentUser.id,
      members,
    };

    console.log("Project to be dispatched: ",project)

    dispatch(addProject(project));
    reset();
    setSelectedMembers([]);
  };

  // const myProjects = projects.filter((proj) => proj.teamLeadId === currentUser.id);
  // console.log("My Projects: ",myProjects);

  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
        Welcome Team Lead, {currentUser.name}
      </Typography>

      <Box>
        <Box sx={{display:'flex', flexDirection:'column',gap:'1rem'}}>
          <Typography variant="body1" sx={{marginBottom:'1rem'}}>
            ➤ Create Project
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('projectName')}
              fullWidth
              label="Project Name"
              variant="outlined"
              sx={{ marginBottom: '1rem' }}
              helperText={errors.projectName?.message}
            />

            <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
              <InputLabel>Team Members</InputLabel>
              <Select
                multiple
                value={selectedMembers}
                onChange={handleChangeMembers}
                label="Team Members"
              >
                {eligibleUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
              Create Project
            </Button>
          </form>
        </Box>

        <Box sx={{display:'flex', flexDirection:'column',gap:'1rem', marginTop:'2rem'}}>
          <Typography variant="h6" gutterBottom>
            ➤ My Projects
          </Typography>
          {projects.length === 0 ? (
            <Typography>No projects created yet</Typography>
          ) : (
            projects.map((project, index) => (
              <Box
                key={index}
                sx={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid black',
                  borderRadius: '0.5rem',
                }}
              >
                <Typography variant="body1">
                  ▸ {project.name}
                </Typography>
                <Typography variant="body1">
                  <Box><b>Team Lead: </b> </Box>
                  <Box>{getUserName(project.teamLeadId)}</Box>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Box>Members:</Box>
                  <Box> {project.members.map((m) => m.name).join(', ')}</Box>
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}