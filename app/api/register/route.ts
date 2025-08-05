import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { prisma } from '../base';

// reqeust in form of {email: xxx, agree_to_terms: true} ** email from session.user?.email
// step1 กดยืนยืน
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const request = await req.json();

  if (session) {
    const user = await prisma.users.findUnique({
      where: { email: session.user?.email as string },
    });
    if (user) {
      return NextResponse.json({ status: 'user already exist' });
    }
    const newuser = await prisma.users.create({
      data: {
        email: session.user?.email as string,
        school: '',
        school_location: '',
        school_phone_number: '',
        agree_to_terms: request.agree_to_terms as boolean,
        province: '',
      },
    });
    return NextResponse.json({ status: 'user created', user: newuser });
  }
  return NextResponse.json({ status: 'not logged in' });
}

//check (step1) if the user already exist and agree to terms
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await prisma.users.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });
    if (user) {
      return NextResponse.json(user);
    }
    return NextResponse.json({ status: 'no user found' });
  }
  return NextResponse.json({ status: 'Please log in' });
}

// input user data
// request in form of {name, lastname, school, school_location, school_phone_number}
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const request = await req.json();
  const school = request.school ? request.school : '';
  const school_location = request.school_location ? request.school_location : '';
  const school_phone_number = request.school_phone_number ? request.school_phone_number : '';
  const province = request.province ? request.province : '';

  if (session) {
    const updateUser = await prisma.users.update({
      where: { email: session.user?.email as string },
      data: {
        school,
        school_location,
        school_phone_number,
        province,
      },
    });
    return NextResponse.json({ status: 'user updated', user: updateUser });
  }
  return NextResponse.json({ status: 'not logged in' });
}
