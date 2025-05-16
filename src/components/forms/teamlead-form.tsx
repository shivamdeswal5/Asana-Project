'use client';

import {
  Box,Button,Typography,TextField,MenuItem,Select, InputLabel,FormControl} from '@mui/material';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useState } from 'react';
import { addProject } from '@/store/slice/team'; 

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
  const users = useSelector((state: RootState) => state.user.users);
  const projects = useSelector((state: RootState) => state.project.projects);

  const eligibleUsers = users.filter(
    (user) => user.role !== 'admin' && !user.isTeamLead && user.id !== currentUser.id
  );

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleChangeMembers = (e: any) => {
    setSelectedMembers(e.target.value);
  };

  const onSubmit = (data: FormData) => {
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

    dispatch(addProject(project));
    reset();
    setSelectedMembers([]);
  };

  const myProjects = projects.filter((proj) => proj.teamLeadId === currentUser.id);

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

      <Grid container spacing={4} sx={{ maxWidth: '900px', margin: '0 auto' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">
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
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            ➤ My Projects
          </Typography>
          {myProjects.length === 0 ? (
            <Typography>No projects created yet</Typography>
          ) : (
            myProjects.map((project, index) => (
              <Box
                key={index}
                sx={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                }}
              >
                <Typography variant="body1">
                  ▸ {project.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  - Members: {project.members.map((m) => m.name).join(', ')}
                </Typography>
              </Box>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
}