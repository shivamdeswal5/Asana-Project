'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Box, Grid, Typography, Button } from '@mui/material';

interface Member {
  id: string;
}

interface Project {
  name: string;
  teamLeadId: string;
  members: Member[];
}

const UserProjects: React.FC = () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');

  const allProjects = useSelector((state: RootState) => state.project.projects) as Project[];
  const allUsers = useSelector((state: RootState) => state.user.users);

  const getUserName = (id: string) =>
    allUsers.find(user => user.id === id)?.name || '[Unknown]';

  const myProjects = allProjects.filter(project =>
    project.members.some(member => member.id === currentUser.id)
  );

  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '90vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser.name}
      </Typography>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ position: 'absolute', top: '1rem', right: '1rem' }}
        onClick={() => {
          sessionStorage.removeItem('currentUser');
          window.location.href = '/login';
        }}
      >
        Logout
      </Button>

      <Grid container spacing={4} sx={{ maxWidth: '900px', marginTop: '2rem' }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            ➤ My Projects
          </Typography>

          {myProjects.length === 0 ? (
            <Typography>No projects assigned to you</Typography>
          ) : (
            myProjects.map((project, index) => (
              <Box
                key={index}
                sx={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body1">
                  ▸ <strong>{project.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  - Team Lead: {getUserName(project.teamLeadId)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  - Members: {project.members.map(member => getUserName(member.id)).join(', ')}
                </Typography>
              </Box>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProjects;