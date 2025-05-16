import { NextRequest, NextResponse } from 'next/server';

interface Project {
    name: string;
    members: string[];
}
 interface User  {
        id: string
        name: string
        email: string
        password: string
        confirmPassword?: string
        organization: string
        role: string
        isTeamLead?: boolean
        projects?: Project[]
        tasks?: string[]
}

const users: User[] = []; 

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email,password,organization,role,id} = body;

  if (!name || !email || !password || !organization || !role) {
    return NextResponse.json({ error: 'Please Fill All The Feilds ..' }, { status: 400 });
  }
  const data ={
    name,
    email,
    password,
    organization,
    role,
    id
  }
  users.push({ name, email,password,organization,role,id});
  return NextResponse.json({ message: 'User added', data,users });
}