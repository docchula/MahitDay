import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getDownloadURL, ref } from 'firebase/storage';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { prisma } from '../base';
import { storage } from '../firebase';

interface returnStudent {
  student_id: string;
  national_id: string;
}

// reqeust in form of {team_reference: xxx} ** email from session.user?.email
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    const data = await req.json();

    const team_reference = (data.team_reference as string) ? (data.team_reference as string) : null;

    let userData = await prisma.users.findUnique({
      where: {
        email: session.user?.email as string,
      },
      select: {
        school: true,
        downloaded: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'error' });
    }

    if (userData.downloaded === null || userData.downloaded === undefined) {
      await prisma.users.update({
        where: {
          email: session.user?.email as string,
        },
        data: {
          downloaded: 1,
        },
      });

      userData = await prisma.users.findUnique({
        where: {
          email: session.user?.email as string,
        },
        select: {
          school: true,
          downloaded: true,
        },
      });
    }

    if (userData?.downloaded !== 60) {
      await prisma.users.update({
        where: {
          email: session.user?.email as string,
        },
        data: {
          downloaded: Number(userData?.downloaded) + 1,
        },
      });
    }

    if (userData?.downloaded === 60) {
      const response = new NextResponse(JSON.stringify({ error: 'NotAllowed_OverLimited' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    }

    if (!userData) return NextResponse.json({ error: 'No school data' });
      const school = userData.school ? userData.school : '';

    const team = await prisma.teams.findMany({
      where: {
        email: session.user?.email as string,
        team_reference: team_reference as string,
      },
      select: {
        name: true,
        email: true,
        team_code: true,
        enrollment_status: true,
      },
    });

    if (team.length === 0) {
      return NextResponse.json({ error: 'No access to this team' });
    }

    const students = await prisma.students.findMany({
      where: {
        team_reference: team_reference as string,
      },
      orderBy: {
        student_reference: 'asc',
      },
      select: {
        team_reference: true,
        prefix: true,
        firstname: true,
        lastname: true,
        grade: true,
        student_score: true,
        student_id: true,
        national_id: true,
        student_reference: true,
        is_join_medtalk: true,
        medtour_group: true,
      },
    });

    const imageName_1 = (students[0].student_reference as string)
      ? (students[0].student_reference as string)
      : 'Not_found';
    const imageName_2 = (students[1].student_reference as string)
      ? (students[1].student_reference as string)
      : 'Not_found';

    const imageRef_1 = ref(storage, `images/${imageName_1}`);
    const imageRef_2 = ref(storage, `images/${imageName_2}`);

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

    try {
      try {
        // fetch image data from firebase url
        const url_1 = await getDownloadURL(imageRef_1);
        const url_2 = await getDownloadURL(imageRef_2);

        const response_1 = await fetch(url_1);
        const response_2 = await fetch(url_2);

        const arrayBuffer_1 = await response_1.arrayBuffer();
        const arrayBuffer_2 = await response_2.arrayBuffer();

        // Convert to base64
        base64Image_1 = Buffer.from(arrayBuffer_1).toString('base64');
        base64Image_2 = Buffer.from(arrayBuffer_2).toString('base64');
      } catch (error) {
        return NextResponse.json({ error: 'Error during processing image data' });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unable to retrieve image' });
    }

    return NextResponse.json({
      team,
      school,
      transformedStudents,
      image_1: base64Image_1,
      image_2: base64Image_2,
    });
  }
}
