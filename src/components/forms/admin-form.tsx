'use client';

import {  Box,Typography,TextField,Button,Container,MenuItem, Select,InputLabel,FormControl,
  Paper,Stack,} from '@mui/material';

import { useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { assignTeamLead } from '@/store/slice/user';
import { addProject } from '@/store/slice/team';
import { RootState } from '@/store/store';

interface FormData {
  teamName: string;
  userId: string;
}

const schema = yup
    .object({
       teamName: yup.string().required("Team Name is required"),
       userId : yup.string().required("This field is required")
    })
    .required()


export default function AdminForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })

  const users = useSelector((state: RootState) => state.user.users);
  const teams = useSelector((state: RootState)=>state.team.teams)
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  console.log("Current Login User", currentUser)
  const eligibleLeads = users.filter(user=> user.role!=='admin' && !user.isTeamLead);
  console.log("Eligible Leads: ", eligibleLeads);
  const dispatch = useDispatch();

  const onSubmit = (data: FormData) => {
    console.log("Admin Form Data: ",data);
    const teamLeadName = users.find((user)=> user.id === data.userId)?.name;
    dispatch(assignTeamLead(data))
    const teamData = {...data,teamLeadName}
    dispatch(addProject(teamData))
    console.log("Team Slice Data: ",teamData);
    reset();
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
          <Typography variant="h5" >
            Welcome Admin,{currentUser.name} 
          </Typography>

          <Box mt={4}>
            <Typography variant="h6">Create Team</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              
              <Stack spacing={3} mt={2}>

                <TextField
                      {...register('teamName')}
                      label="Team Name"
                      fullWidth
                      helperText={errors.teamName?.message}
                />
                

                 <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Team Lead</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Team Lead"                  
                    {...register('userId')}
                  >
                    {
                      eligibleLeads.map((user)=>(
                        <MenuItem
                         key={user.id} value={user.id}> 
                          {user.name}
                        </MenuItem>
                      ))  
                    }
                  </Select>
                </FormControl>
          
                <Button type="submit" variant="contained">
                  Create Team
                </Button>
              </Stack>

            </form>
          </Box>

          <Box mt={5}>
            <Typography variant="h6" gutterBottom>
              Existing Teams
            </Typography>
            <Stack spacing={1}>
              { teams.length ==0 ? (<Box>No Existing Teams</Box>) : (teams.map((team) => (
                <Paper key={team.userId} variant="outlined" sx={{ p: 1 }}>
                  <Box>
                    {team.teamName} (Team Lead: {team.teamLeadName})
                  </Box>
                </Paper>
              )))}
            </Stack>
          </Box>         

       </Paper>
      </Container>

    </>
  );
}