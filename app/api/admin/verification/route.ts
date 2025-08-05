import { getDownloadURL, ref } from 'firebase/storage';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../base';
import { storage } from '../../firebase';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

interface returnStudent {
  student_id: string;
  national_id: string;
}

export const dynamic = 'force-dynamic';
// reqeust in form of {team_reference: xxx} ** email from session.user?.email
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (session.user.email.split('@')[1] !== 'docchula.com') {
      return NextResponse.json({ status: 'Unauthorized' });
    }
    const team = await prisma.teams.findMany({
      take: 1,
      where: {
        enrollment_status: 1,
      },
      orderBy: {
        created_at: 'asc',
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

    const imageRef_1 = ref(storage, `images/${imageName_1}`);
    const idRef_1 = ref(storage, `cards/${imageName_1}`);
    const imageRef_2 = ref(storage, `images/${imageName_2}`);
    const idRef_2 = ref(storage, `cards/${imageName_2}`);

    // const paid = ref(storage, `slip/${team_reference}`);

    //.png is to deleted afterward it's because accidently deleted firebase file

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

    // let base64Slip = '';

    try {
      try {
        // fetch image data from firebase url
        const url_1 = await getDownloadURL(imageRef_1);
        const url_2 = await getDownloadURL(imageRef_2);

        const idUrl_1 = await getDownloadURL(idRef_1);
        const idUrl_2 = await getDownloadURL(idRef_2);

        const response_1 = await fetch(url_1);
        const response_2 = await fetch(url_2);

        const idRes_1 = await fetch(idUrl_1);
        const idRes_2 = await fetch(idUrl_2);

        const arrayBuffer_1 = await response_1.arrayBuffer();
        const arrayBuffer_2 = await response_2.arrayBuffer();

        const idArrayBuffer_1 = await idRes_1.arrayBuffer();
        const idArrayBuffer_2 = await idRes_2.arrayBuffer();

        // Convert to base64
        base64Image_1 = Buffer.from(arrayBuffer_1).toString('base64');
        base64Image_2 = Buffer.from(arrayBuffer_2).toString('base64');

        base64Id_1 = Buffer.from(idArrayBuffer_1).toString('base64');
        base64Id_2 = Buffer.from(idArrayBuffer_2).toString('base64');

        // const slipUrl = await getDownloadURL(paid);
        // const slipRes = await fetch(slipUrl);
        // const slipArrayBuffer = await slipRes.arrayBuffer();

        // base64Slip = Buffer.from(slipArrayBuffer).toString('base64');
      } catch (error) {
        return NextResponse.json({ error: 'Error during processing image data' });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unable to retrieve image' });
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
  return NextResponse.json({ status: 'Please log in' });
}
