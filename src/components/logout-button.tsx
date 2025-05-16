'use client';
import React from 'react'
import {Button} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
    
  const handleLogout = () => {
    sessionStorage.removeItem('Currentuser');
    router.push('/login');
  };
  
  return (
    <Button onClick={handleLogout} color="primary" variant="outlined">
      Logout
    </Button>
  )
}
