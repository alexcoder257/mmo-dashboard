import type { NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { routing } from './i18n/routing';

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

const i18nMiddleware = createMiddleware(routing);

const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  )
    return NextResponse.next();

  return i18nMiddleware(request);
};

export default middleware;
