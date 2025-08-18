import { NextResponse } from 'next/server';
import { prisma } from '../../base';
import { readFile } from '@/utils/file';

interface returnStudent {
  student_id: string;
  national_id: string;
}

export const dynamic = 'force-dynamic';
// reqeust in form of {team_reference: xxx} ** email from session.user?.email
export async function GET() {
  const team = await prisma.teams.findMany({
    take: 1,
    where: {
      enrollment_status: 1,
    },
    orderBy: {
      confirmed_at: 'asc',
    },
    select: {
      name: true,
      email: true,
      team_code: true,
      team_reference: true,
      total_payment: true,
    },
  });

  if (team.length === 0) {
    return NextResponse.json({ error: 'There are no more teams' });
  }

  const { team_reference } = team[0];

  const students = await prisma.students.findMany({
    where: {
      team_reference: team_reference as string,
    },
    orderBy: {
      student_reference: 'asc',
    },
    select: {
      prefix: true,
      firstname: true,
      lastname: true,
      grade: true,
      national_id: true,
      student_reference: true,
      is_join_medtalk: true,
      medtour_group: true,
      medtour_flex: true,
    },
  });

  const imageName_1 = (students[0].student_reference as string)
    ? (students[0].student_reference as string)
    : 'Not_found';
  const imageName_2 = (students[1].student_reference as string)
    ? (students[1].student_reference as string)
    : 'Not_found';

  if (imageName_1 === 'Not_found' || imageName_2 === 'Not_found') {
    return NextResponse.json({ error: 'No student reference found' });
  }

  const getTransformedStudent = (student: any): returnStudent => ({
    ...student, // copies all properties
    student_id: student.student_id,
    national_id: student.national_id,
  });

  const transformedStudents = students.map(getTransformedStudent);

  let base64Image_1 = '';
  let base64Image_2 = '';

  let base64Id_1 = '';
  let base64Id_2 = '';

  try {
    const image1 = readFile(`images/${imageName_1}`);
    const id1 = readFile(`cards/${imageName_1}`);
    const image2 = readFile(`images/${imageName_2}`);
    const id2 = readFile(`cards/${imageName_2}`);

    base64Image_1 = (await image1).toString('base64');
    base64Image_2 = (await image2).toString('base64');
    base64Id_1 = (await id1).toString('base64');
    base64Id_2 = (await id2).toString('base64');
  } catch (error) {
    console.log('Error during processing image data', error);
    return NextResponse.json({ error: 'Error during processing image data' });
  }

  // Count verified students (enrollment_status = 2) for each group
  const grossCount = await prisma.students.count({
    where: {
      medtour_group: 'Gross anatomy',
      team: { enrollment_status: 2 },
    },
  });
  const histologyCount = await prisma.students.count({
    where: {
      medtour_group: 'Histology',
      team: { enrollment_status: 2 },
    },
  });

  return NextResponse.json({
    team,
    transformedStudents,
    image_1: base64Image_1,
    imageCard_1: base64Id_1,
    image_2: base64Image_2,
    imageCard_2: base64Id_2,
    // base64Slip,
    verifiedCounts: {
      gross: grossCount,
      histology: histologyCount,
    },
  });
}
