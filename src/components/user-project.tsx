'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Box, Grid, Typography,} from '@mui/material';
import LogoutButton from './logout-button';


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
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '90vh',
      }}
    >
     <Box sx={{display:'flex',flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'2rem', height:'100%', width:'100%'}}>
       <Typography variant="h4" gutterBottom>
        Welcome, {currentUser.name}
      </Typography>
      <Box sx={{position:'absolute', right:50, top: 40}}>
        <LogoutButton/>
      </Box>
     </Box>

      <Grid container spacing={4} sx={{ maxWidth: '900px', marginTop: '2rem' }}>
        <Box>
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
                  ▸ <b>{project.name}</b>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <b>Team Lead:</b> {getUserName(project.teamLeadId)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <b>Members:</b> {project.members.map(member => getUserName(member.id)).join(', ')}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default UserProjects;