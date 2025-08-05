import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../base';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') {
      return NextResponse.json({ status: 'Unauthorized' });
    }
    try {
      const data = await prisma.students.findMany({});
      const serializedData = JSON.parse(JSON.stringify(data));
      return NextResponse.json({ data: serializedData });
    } catch (error) {
      return NextResponse.json({ status: 'Error occurred while fetching users' });
    }
  }

  return NextResponse.json({ status: 'Please log in' });
}
