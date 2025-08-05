import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getDownloadURL, ref } from 'firebase/storage';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';
import { storage } from '../../firebase';

// reqeust in form of {team_reference: xxx} ** email from session.user?.email
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const imageRef_1 = ref(storage, 'images/1_NB0P7E');

    //.png is to deleted afterward it's because accidently deleted firebase file

    let base64Image_1 = '';

    try {
      try {
        // fetch image data from firebase url
        const url_1 = await getDownloadURL(imageRef_1);

        const response_1 = await fetch(url_1);

        const arrayBuffer_1 = await response_1.arrayBuffer();

        // Convert to base64
        base64Image_1 = Buffer.from(arrayBuffer_1).toString('base64');
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error during processing image data' });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unable to retrieve image' });
    }

    return NextResponse.json({ image_1: base64Image_1 });
  }
}
