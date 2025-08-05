import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { prisma } from '../base';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ status: 'Please log in' }, { status: 401 });
  }

  const { team_reference } = await req.json();

  try {
    await prisma.teams.update({
      where: {
        team_reference: team_reference,
      },
      data: {
        enrollment_status: 1, // Change status to 1
      },
    });
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}