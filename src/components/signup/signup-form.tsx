'use client';
import style from './style.module.css'
import Box from '@mui/material/Box';
import {
    Typography, Grid, Stack, Button, FormControlLabel,RadioGroup
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import Radio from '@mui/material/Radio';
import { pink } from '@mui/material/colors';
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { addUser } from '@/store/slice/user';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const schema = yup
    .object({
        name: yup.string().required("name is required"),
        email: yup.string().email("Invalid Email Format").required("Email is required"),
        password: yup.string().required().min(6),
        confirmPassword: yup.string().label('Confirm Password').required().oneOf([yup.ref('password')], 'Passwords must match'),
        organization: yup.string().required("Organization is Required.. "),
        role: yup.string().required("Select atleast one role")
    })
    .required()

export default function SignupForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const users = useSelector((state: RootState) => state.user.users);

    type Inputs = {
        name: string
        email: string
        password: string
        confirmPassword: string
        organization: string
        role: string
    }

    type User = {
        id: string
        name: string
        email: string
        password: string
        confirmPassword: string
        organization: string
        role: string
        isTeamLead?: boolean
        projects?: []
        tasks?: []
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
        const user:User = {...data,id:uuidv4(),isTeamLead:false,projects:[],tasks:[]}
        console.log("User Signup Page: ",user);
        const isEmailExists = users.some((user) => user.email === data.email);
        console.log("Is Email Exists: ",isEmailExists);
        if (isEmailExists) {
            console.log("User already exists ..");
            alert("User already exists ..");
        }else{
            dispatch(addUser(user));
            router.push('/login');
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
                        Create an Account
                    </Typography>

                    <Box sx={{ color: 'gray' }}>
                        Already have an account?  <Link href="/login">Login</Link>
                    </Box>

                    <form className={style.formClass} onSubmit={handleSubmit(onSubmit)}>

                        <Box className={style.flex}>
                            <TextField
                                {...register('name')}
                                id="outlined-required"
                                label="Full Name"
                                placeholder='Required'
                                className={style.changeColor}
                                name="name"
                            />
                            {errors.email?.message}
                        </Box>

                        <Box className={style.flex}>
                            <TextField
                                {...register('email')}
                                id="outlined-required"
                                label="Email"
                                placeholder='Required'
                                className={style.changeColor}
                                name="email"
                            />
                            {errors.email?.message}
                        </Box>

                        <Box className={style.flex}>
                            <TextField
                                {...register('password')}
                                id="outlined-required"
                                label="Password"
                                placeholder='Required'
                                type='password'
                                className={style.changeColor}
                                name="password"
                            />
                            {errors.password?.message}
                        </Box>

                        <Box className={style.flex} >
                            <TextField
                                {...register('confirmPassword')}
                                id="outlined-required"
                                label="Confirm Password"
                                placeholder='Required'
                                className={style.changeColor}
                                name="confirmPassword"
                                type='password'

                            />
                            {errors.confirmPassword?.message}
                        </Box>

                        <Box className={style.flex} >
                            <TextField
                                {...register('organization')}
                                id="outlined-required"
                                label="Organization"
                                placeholder='Required'
                                className={style.changeColor}
                                name="organization"         
                            />
                            {<p>{errors.organization?.message}</p>}

                        </Box>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="admin" control={<Radio {...register('role')} sx={{
                                    color: 'black',
                                    '&.Mui-checked': {
                                        color: pink[600],
                                    },
                                }} />} label="Admin" />
                            <FormControlLabel value="user" control={<Radio {...register('role')} sx={{
                                    color: 'black',
                                    '&.Mui-checked': {
                                        color: pink[600],
                                    },
                                }} />} label="User" />
                        </RadioGroup>

                        <Button type='submit' variant="contained"
                            sx={{ color: 'white', backgroundColor: '#7055b5', border: '0px' }}
                            className='submitBtn'
                        > Signup</Button>

                    </form>
                </Stack>

            </Grid>

        </>
    )
}