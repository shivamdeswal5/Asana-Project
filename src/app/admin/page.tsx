import LogoutButton from '@/components/logout-button';
import {AppBar, Toolbar, Typography} from '@mui/material';
import AdminForm from '@/components/forms/admin-form';
export default function AdminDashboard() {
 
  return (
    <>

      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>

     <AdminForm/>
     
    </>
  );
}