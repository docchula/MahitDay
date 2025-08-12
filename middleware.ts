import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { type MiddlewareConfig, NextMiddleware, NextResponse } from 'next/server';
import { REGISTRATION_STAGE } from './utils/config';

type Middleware = {
  route?: (string | RegExp)[];
  middleware: NextMiddleware;
};

/**
 * Apply basic authenthication check requring users to be logged in
 */
const authMiddleware: NextMiddleware = async (request) => withAuth(request as NextRequestWithAuth);

/**
 * Apply check whether email ends with [at]docchula.com
 */
const authDocchulaMiddleware: NextMiddleware = async (request) =>
  withAuth(request as NextRequestWithAuth, {
    callbacks: {
      authorized: ({ token }) => token?.email?.split('@')?.[1] === 'docchula.com',
    },
  });

const dashboardMiddleware: NextMiddleware = (request) => {
  if (REGISTRATION_STAGE !== 'register') {
    const path = request.nextUrl.pathname;
    if (path !== '/dashboard/step4' && path !== '/dashboard/step5') {
      return NextResponse.redirect(new URL('/dashboard/step4', request.url));
    }
  }

  return undefined;
};

/**
 * Add new middlewares here.
 *
 * - route is a list of routes to apply, multiple routes are possible. Will match every route if not set. Won't match any route if the list is set to empty.
 * - middleware can return NextResponse.xxx to end the request processing early, or return nothing (i.e., undefined) to continue the request processing
 *
 * They will be applied in the order that is specified.
 */
const middlewares: Middleware[] = [
  {
    route: ['/dashboard'],
    middleware: authMiddleware,
  },
  {
    route: ['/dashboard'],
    middleware: dashboardMiddleware,
  },
  {
    route: ['/admin', '/api/admin'],
    middleware: authDocchulaMiddleware,
  },
];

export default (async (request, ...args) => {
  for (const middleware of middlewares) {
    if (middleware.route) {
      // If route is set, then only run the middleware if the route matched
      const matchedRoute = middleware.route.findIndex((route) =>
        typeof route === 'string'
          ? request.nextUrl.pathname.startsWith(route)
          : route.test(request.nextUrl.pathname)
      );

      // eslint-disable-next-line no-continue
      if (matchedRoute === -1) continue;
    }

    // Actually apply the middleware
    const response = await middleware.middleware(request, ...args);
    if (response) return response;
  }

  return NextResponse.next();
}) satisfies NextMiddleware;

export const config: MiddlewareConfig = {};
