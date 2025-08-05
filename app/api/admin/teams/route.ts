import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../base';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') {
      return NextResponse.json({ status: 'Unauthorized' });
    }

    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const olderThan = searchParams.get('olderThan');

      // If specific query parameters are provided, return count for pending teams
      if (status === '0' && olderThan) {
        const cutoffTime = new Date(olderThan);
        const count = await prisma.teams.count({
          where: {
            enrollment_status: 0,
            created_at: {
              lt: cutoffTime,
            },
          },
        });
        return NextResponse.json({ count });
      }

      // Default behavior - return all teams
      const data = await prisma.teams.findMany({});
      return NextResponse.json({ data });
    } catch (error) {
      return NextResponse.json({ status: 'Error occurred while fetching teams' });
    }
  }
  return NextResponse.json({ status: 'Please log in' });
}
