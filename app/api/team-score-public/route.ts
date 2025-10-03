import { NextResponse } from 'next/server';
import { prisma } from '../base';

export async function GET() {
  const teams = await prisma.teams.findMany({
    select: {
      team_reference: true,
      enrollment_status: true,
    },
  });

  if (teams.length > 0) {
    const return_teams: any[] = teams;
    await Promise.all(
      return_teams.map(async (obj) => {
        const students = await prisma.students.findMany({
          where: {
            team_reference: obj.team_reference,
            student_score: {
              not: null,
            },
          },
          orderBy: {
            student_reference: 'asc',
          },
          select: {
            student_score: true,
          },
        });

        if (students.length === 2) {
          obj.student1 = students[0];
          obj.student2 = students[1];
        }
      })
    );
    return NextResponse.json(return_teams);
  }
  return NextResponse.json({ status: 'no team registered found' });
}
