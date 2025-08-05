import { NextResponse } from 'next/server';
import { prisma } from '../base';
import { MAX_TEAM } from '../../../utils/config';

export async function GET() {
  try {
    const teamCount = await prisma.teams.count({
      where: {
        enrollment_status: {
          in: [1, 2, 3],
        },
      },
    });

    if (teamCount >= MAX_TEAM) {
      return NextResponse.json({ status: false });
    }
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to get register status' }, { status: 500 });
  }
}
