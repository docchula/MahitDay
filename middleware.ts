import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { REGISTRATION_STAGE } from './utils/config';

export default withAuth((request: NextRequest) => {
  // @ts-ignore
  if (REGISTRATION_STAGE !== 'register') {
    const path = request.nextUrl.pathname;
    if (path !== '/dashboard/step4' && path !== '/dashboard/step5') {
      return NextResponse.redirect(new URL('/dashboard/step4', request.url));
    }
  }
  return NextResponse.next();
});

export const config = { matcher: ['/dashboard/:path*'] };
