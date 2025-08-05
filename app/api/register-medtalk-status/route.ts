import { NextResponse } from 'next/server';
import { prisma } from '../base';
import { MAX_MEDTALK_STUDENT } from '../../../utils/config';

export async function GET() {
  try {
    const studentCount = await prisma.students.count({
      where: {
        is_join_medtalk: true,
        team: { enrollment_status: { in: [0, 1, 2] } },
      },
    });

    if (studentCount >= MAX_MEDTALK_STUDENT) {
      return NextResponse.json({ status: true });
    }
    return NextResponse.json({ status: false });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to get MedTalk registration status' },
      { status: 500 }
    );
  }
}
