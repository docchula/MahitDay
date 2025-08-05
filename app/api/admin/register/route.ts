import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../base';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') return NextResponse.json({ status: 'Unauthorized' });
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ message: 'Missing student ID' }, { status: 400 });
      }

      const data = await prisma.students.findMany({
        where: { student_id: id },
        select: {
          student_id: true,
          national_id: true,
          team_reference: true,
          firstname: true,
          lastname: true,
          grade: true,
        },
      });

      if (data.length === 0) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }

      const teamData = await prisma.teams.findUnique({
        where: { team_reference: data[0].team_reference },
        select: { email: true, name: true, team_code: true },
      });

      const user = await prisma.users.findUnique({
        where: { email: teamData?.email },
        select: { school: true, province: true },
      });

      if (data[0].student_id && data[0].national_id) {
        const response = {
          ...data[0],
          student_id: data[0].student_id.toString(),
          national_id: data[0].national_id,
          team_name: teamData?.name,
          team_code: teamData?.team_code,
          province: user?.province,
          school: user?.school,
        };

        return NextResponse.json(response, { status: 200 });
      }

      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') return NextResponse.json({ status: 'Unauthorized' });
    try {
      const data = await request.json();
      const id = data.student_id;

      if (!id) {
        return NextResponse.json({ message: 'Missing student ID' }, { status: 400 });
      }

      const update = await prisma.students.updateMany({
        where: { student_id: id },
        data: { student_score: 0 },
      });

      if (update.count === 0) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Update successful', update }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
}
