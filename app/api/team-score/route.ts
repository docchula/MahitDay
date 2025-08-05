import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { prisma } from '../base';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const team = await prisma.teams.findMany({
      where: {
        email: session.user?.email as string,
      },
      select: {
        name: true,
        team_reference: true,
        enrollment_status: true,
      },
    });

    if (team.length > 0) {
      const return_teams: any[] = team;
      await Promise.all(
        return_teams.map(async (obj) => {
          const student = await prisma.students.findMany({
            where: {
              team_reference: obj.team_reference,
            },
            orderBy: {
              student_reference: 'asc',
            },
            select: {
              prefix: true,
              firstname: true,
              lastname: true,
              student_score: true,
              national_id: true,
            },
          });

          if (student.length === 2) {
            const student1_national_id = student[0].national_id;

            const student2_national_id = student[1].national_id;

            const student_1_obj = {
              ...student[0],
              national_id: student1_national_id,
            };

            const student_2_obj = {
              ...student[1],
              national_id: student2_national_id,
            };

            const updatedObj = { ...obj }; // Create a new object with the same properties as 'obj'
            updatedObj.student1 = student_1_obj;
            updatedObj.student2 = student_2_obj;
            return_teams[return_teams.indexOf(obj)] = updatedObj;
          }

          return NextResponse.json({ status: 'students not found' });
        })
      );
      return NextResponse.json(return_teams);
    }
    return NextResponse.json({ status: 'no team registered found' });
  }
}
