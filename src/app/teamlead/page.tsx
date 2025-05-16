import { Box, Typography } from '@mui/material';
import TeamLeadForm from '@/components/forms/teamlead-form'
import LogoutButton from '@/components/logout-button';
export default function TeamLead (){
    return(
    <>
    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h4">
        TeamLead Dashboard
      </Typography>
      <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <LogoutButton/>
      </Box>
      <TeamLeadForm/>

     
    </Box>
    </>
    
);
}
