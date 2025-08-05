import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../base';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic';

export async function GET() {
const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') return NextResponse.json({ status: 'Unauthorized' });
    try {
      const data = await prisma.users.findMany({});
      return NextResponse.json({ data });
    } catch {
      return NextResponse.json({ status: 'Error occur while fetching users' });
    }
  }
  return NextResponse.json({ status: 'Please log in' });
}
