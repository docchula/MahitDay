import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../base';
import { MAX_Gross_anatomy, MAX_Histology, MAX_MEDTALK_STUDENT } from '../../../utils/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');
  const checkTotal = searchParams.get('total');

  if (checkTotal === 'true') {
    // Check combined capacity of both groups
    const totalGross = await prisma.students.count({
      where: {
        medtour_group: 'Gross anatomy',
        team: { enrollment_status: { in: [0, 1, 2] } },
      },
    });

    const totalHistology = await prisma.students.count({
      where: {
        medtour_group: 'Histology',
        team: { enrollment_status: { in: [0, 1, 2] } },
      },
    });

    const totalCombined = totalGross + totalHistology;

    return NextResponse.json({
      totalCombined,
      maxCombined: MAX_MEDTALK_STUDENT,
      isFull: totalCombined >= MAX_MEDTALK_STUDENT,
    });
  }

  if (!group) {
    return NextResponse.json({ error: 'Group parameter is required' }, { status: 400 });
  }

  const total12 = await prisma.students.count({
    where: {
      medtour_group: group,
      team: { enrollment_status: { in: [0, 1, 2] } },
    },
  });

  const total2 = await prisma.students.count({
    where: {
      medtour_group: group,
      team: { enrollment_status: 2 },
    },
  });

  const max = group === 'Gross anatomy' ? MAX_Gross_anatomy : MAX_Histology;

  return NextResponse.json({
    total12,
    total2,
    max,
  });
}
