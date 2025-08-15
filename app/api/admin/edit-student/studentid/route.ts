import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../base';
import { readFile } from '@/utils/file';
// request slip image {request photo by photo by json {student_ref: "CK5DOD"} <- for example}
export async function POST(req: NextRequest) {
  const data = await req.json();
  const imageName = (data.student_ref as string) ? (data.student_ref as string) : 'Not_found';
  if (imageName === 'Not_found') {
    return NextResponse.json({ error: 'No student reference found' });
  }
  const student = await prisma.students.findUnique({
    where: {
      student_reference: imageName,
    },
  });
  const team_ref = student?.team_reference;
  const team = await prisma.teams.findMany({
    where: {
      team_reference: team_ref,
    },
  });
  if (team.length === 0) {
    return NextResponse.json({ status: 'You do not have access to this image' });
  }
  if (student) {
    try {
      const imageContent = await readFile(`cards/${imageName}`);
      return NextResponse.json({ image: imageContent.toString('base64') });
    } catch (error) {
      console.error('Error during processing image data', error);
      return NextResponse.json({ error: 'Error during processing image data' });
    }
  } else {
    return NextResponse.json({
      error: 'No MedTalk found or you do not have access to the following image',
    });
  }
}
