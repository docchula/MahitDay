import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../base';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') return NextResponse.json({ status: 'Unauthorized' });
    const team = await prisma.teams.count({
      where: {
        enrollment_status: 1,
      },
    });

    return NextResponse.json({
      team,
    });
  }
  return NextResponse.json({ status: 'Please log in' });
}
