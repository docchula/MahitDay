import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getDownloadURL, ref } from 'firebase/storage';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';
import { storage } from '../../firebase';
import { prisma } from '../../base';

// request slip image {request photo by photo by json {student_ref: "CK5DOD"} <- for example}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    const data = await req.json();
    const imageName = (data.student_ref as string) ? (data.student_ref as string) : 'Not_found';

    if (imageName === 'Not_found') {
      return NextResponse.json({ error: 'No student reference found' });
    }

    const imageRef = ref(storage, `cards/${imageName}`);

    const student = await prisma.students.findUnique({
      where: {
        student_reference: imageName,
      },
    });

    const team_ref = student?.team_reference;

    const team = await prisma.teams.findMany({
      where: {
        team_reference: team_ref,
        email: session.user?.email as string,
      },
    });

    if (team.length === 0) {
      return NextResponse.json({ status: 'You do not have access to this image' });
    }

    if (student) {
      try {
        try {
          // fetch image data from firebase url
          const url = await getDownloadURL(imageRef);
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();

          // Convert to base64
          const base64Image = Buffer.from(arrayBuffer).toString('base64');

          return NextResponse.json({ image: base64Image });
        } catch (error) {
          // console.error(error);
          return NextResponse.json({ error: 'Error during processing image data' });
        }
      } catch (error) {
        return NextResponse.json({ error: 'Unable to retrieve image' });
      }
    } else {
      return NextResponse.json({
        error: 'No MedTalk found or you do not have access to the following image',
      });
    }
  } else {
    return NextResponse.json({ status: 'Please log in' });
  }
}
