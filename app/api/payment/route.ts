import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ref, uploadBytes } from 'firebase/storage';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { storage } from '../firebase';
import { prisma } from '../base';
import { MAX_TEAM } from '../../../utils/config';

const uploadImage = async (uploadFile: File, filename: string) => {
  const imageRef = ref(storage, `slip/${filename}`);
  const metadata = {
    contentType: 'image',
  };

  try {
    const arrayBuffer = await uploadFile.arrayBuffer();
    uploadBytes(imageRef, arrayBuffer, metadata).then(() => {});
  } catch (error) {
    //console.log(error);
  }
};

// get all MedTalk people enroll from this account

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    const teamCount = await prisma.teams.count({
      where: {
        enrollment_status: {
          in: [1, 2, 3],
        },
      },
    });
    if (teamCount >= MAX_TEAM) {
      return NextResponse.json({ status: 'registration is closed' });
    }

    const data = await req.formData();

    const teamRef = data.get('teamRef');
    const image = data.get('image') as File;

    try {
      const team = await prisma.teams.findMany({
        where: {
          email: session.user?.email as string,
          team_reference: teamRef as string,
        },
      });

      if (team.length === 0) {
        return NextResponse.json({ status: 'error' });
      }
      if (team.length === 1) {
        const updateTeam = await prisma.teams.updateMany({
          where: {
            team_reference: teamRef as string,
          },
          data: {
            enrollment_status: 1,
          },
        });
        uploadImage(image, teamRef as string);
        NextResponse.json({ updateTeam });
      }
    } catch (error) {
      return NextResponse.json({ status: 'error' });
    }

    return NextResponse.json({ status: 'ok' });
  }
  return NextResponse.json({ status: 'Please log in' });
}
