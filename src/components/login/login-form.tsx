'use client';
import style from './style.module.css'
import Box from '@mui/material/Box';
import {
    Typography, Grid, Stack, Button, 
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


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


const schema = yup
    .object({
        email: yup.string().email("Invalid Email Format").required("Email is required"),
        password: yup.string().required().min(6),
    })
    .required()

export default function LoginForm() {
    
    const router = useRouter();
    const users = useSelector((state: RootState) => state.user.users);

    type Inputs = {
        email: string
        password: string
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data: Inputs) => {
        console.log("Form Data: ", data);
        console.log("Users in Login Page: ", users);
        const matchedUser = users.find((user:User) => user.email === data.email);
        console.log("Matched User: ", matchedUser);
        sessionStorage.setItem("Currentuser", JSON.stringify(matchedUser));
         if (matchedUser) {
            console.log("Login Successful. Welcome:", matchedUser.name);
            sessionStorage.setItem("currentUser", JSON.stringify(matchedUser));

            if (matchedUser.role === "admin") {
                router.push("/admin");
            } else {
                if(matchedUser.isTeamLead) {
                    router.push("/teamlead");
                }else{
                    router.push("/user");
                }
            }
        } else {
            alert("Invalid Email or Password");
            console.log("Login Failed");
        }
        
        reset();
    };

    return (
        <>
            <Grid
                container
                spacing={{ xs: 2, md: 10 }} columns={{ xs: 4, sm: 8, md: 12 }}
                className={style.bgColor}
                direction="row"
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "6rem",
                    height: "92vh",
                    gridTemplateColumns: 'repeat(2, 1fr)',
                }}
            >
                <Stack direction={{ xs: 'column', sm: 'column' }}
                    spacing={{ xs: 2, sm: 4, md: 4 }}>

                    <Typography variant="h3" component="h2">
                        Login
                    </Typography>

                    <Box sx={{ color: 'gray' }}>
                        New User ?  <Link href="/signup">Signup</Link>
                    </Box>

                    <form className={style.formClass} onSubmit={handleSubmit(onSubmit)}>

                        <Box className={style.flex}>
                            <TextField
                                {...register('email')}
                                id="outlined-required"
                                label="Email"
                                placeholder='Required'
                                className={style.changeColor}
                                name="email"
                                sx={{width:'35vh'}}
                            />
                            {errors.email?.message}
                        </Box>

                        <Box className={style.flex}>
                            <TextField
                                {...register('password')}
                                id="outlined-required"
                                label="Password"
                                placeholder='Required'
                                className={style.changeColor}
                                name="password"
                                type='password'
                            />
                            {errors.password?.message}
                        </Box>

                        <Button type='submit' variant="contained"
                            sx={{ color: 'white', backgroundColor: '#7055b5', border: '0px' }}
                            className='submitBtn'
                        > Login</Button>

                    </form>
                </Stack>

            </Grid>

        </>
    )
}