import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../base';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';
import { MAX_Gross_anatomy, MAX_Histology } from '../../../../utils/config';

async function getGroupCapacities(group: string) {
  let max = 0;
  if (group === 'Gross anatomy') max = MAX_Gross_anatomy;
  else if (group === 'Histology') max = MAX_Histology;
  else return { total12: 0, total2: 0, max: 0 };
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
  return { total12, total2, max };
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') {
      return NextResponse.json({ status: 'Unauthorized' });
    }
    const data = await req.json();

    const team_reference = (data.team_reference as string) ? (data.team_reference as string) : null;
    const student_reference = data.student_reference as string;
    const action = data.action as string;
    const accept_reject = (data.acceptance as boolean) ? (data.acceptance as boolean) : false;

    try {
      if (action && student_reference) {
        if (action === 'flip') {
          // Get current group
          const student = await prisma.students.findUnique({ where: { student_reference } });
          const newGroup = student?.medtour_group === 'Histology' ? 'Gross anatomy' : 'Histology';
          await prisma.students.update({
            where: { student_reference },
            data: { medtour_group: newGroup },
          });
          return NextResponse.json({ status: 'Flipped group', newGroup });
        }
        if (action === 'reject') {
          await prisma.students.update({
            where: { student_reference },
            data: { is_join_medtalk: false, medtour_group: null },
          });
          return NextResponse.json({ status: 'Rejected medtour' });
        }
        if (action === 'accept') {
          // No-op for now, could be used for future logic
          return NextResponse.json({ status: 'Accepted' });
        }
      }
      if (team_reference && accept_reject) {
        // Automatic medtour logic for all students in the team
        const students = await prisma.students.findMany({ where: { team_reference } });
        for (const student of students) {
          if (student.is_join_medtalk && student.medtour_group) {
            const cap = await getGroupCapacities(student.medtour_group);
            const otherGroup =
              student.medtour_group === 'Histology' ? 'Gross anatomy' : 'Histology';
            const otherCap = await getGroupCapacities(otherGroup);
            if (cap.total2 >= cap.max) {
              if (student.medtour_flex === 'yes' && otherCap.total2 < otherCap.max) {
                await prisma.students.update({
                  where: { student_reference: student.student_reference },
                  data: { medtour_group: otherGroup },
                });
              } else {
                await prisma.students.update({
                  where: { student_reference: student.student_reference },
                  data: { is_join_medtalk: false, medtour_group: null },
                });
              }
            } else if (cap.total12 >= cap.max) {
              // Optionally, you can handle the warning case here if needed
              // For now, do nothing (student stays in group)
            }
          }
        }
        const update = await prisma.teams.updateMany({
          where: { team_reference },
          data: { enrollment_status: 2 },
        });
        return NextResponse.json({
          status: 'Success and accepted, medtour auto-processed',
          update,
        });
      }
      if (team_reference && !accept_reject) {
        // Set is_join_medtalk to false for all students in the rejected team
        await prisma.students.updateMany({
          where: { team_reference },
          data: { is_join_medtalk: false, medtour_group: null },
        });

        const update = await prisma.teams.updateMany({
          where: { team_reference },
          data: { enrollment_status: 3 },
        });
        return NextResponse.json({ status: 'Success and rejected', update });
      }
    } catch {
      return NextResponse.json({ status: 'Error occur with fetching team_reference' });
    }
  }
  return NextResponse.json({ status: 'Please log in' });
}
