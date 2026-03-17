import type { NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { ROUTE_GUARDS } from '@/constants/route-guards.const';
import { AUTH_PAGE, FORBIDDEN_PAGE } from '@/constants/route-pages.const';
import { useAuthStore } from '@/stores/auth.store';

import { COOKIE_KEYS } from './constants/shared.const';
import { routing } from './i18n/routing';
import { getPathnameWithoutLocale } from './utils/shared.util';

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

const i18nMiddleware = createMiddleware(routing);

const authMiddleware = async (request: NextRequest) => {
  const pathname = getPathnameWithoutLocale(request.nextUrl.pathname);
  const locale =
    request.nextUrl.pathname.split('/')[1] || routing.defaultLocale;

  // First check for exact match
  if (ROUTE_GUARDS[pathname] !== undefined) {
    const isRequiresAuth = ROUTE_GUARDS[pathname].requiresAuth;

    if (!isRequiresAuth) {
      return NextResponse.next();
    }
  }

  // Then check for prefix matches, but exclude root path from prefix matching
  const matchedGuard = Object.keys(ROUTE_GUARDS)
    .filter((guard) => guard !== '/')
    .find((guard) => pathname.startsWith(guard));

  const isRequiresAuth =
    ROUTE_GUARDS[pathname]?.requiresAuth ||
    (matchedGuard && ROUTE_GUARDS[matchedGuard]?.requiresAuth) ||
    false;

  if (isRequiresAuth) {
    const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN);

    if (accessToken?.value) {
      useAuthStore.getState().setToken(accessToken.value);
    } else {
      useAuthStore.setState({
        accessToken: null,
        isAuthenticated: false,
        userInfo: undefined,
      });
    }

    await useAuthStore.getState().initialize();

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const userRole = useAuthStore.getState().userInfo?.role;

    const requiresRoles =
      ROUTE_GUARDS[pathname]?.roles ||
      (matchedGuard && ROUTE_GUARDS[matchedGuard]?.roles);
    const hasRequiredRole = requiresRoles?.some((role) => role === userRole);

    if (!isAuthenticated) {
      const redirectUrl = new URL(`/${locale}${AUTH_PAGE.LOGIN}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (requiresRoles.length && !hasRequiredRole) {
      const redirectUrl = new URL(`/${locale}${FORBIDDEN_PAGE}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
};

const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  )
    return NextResponse.next();

  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) return authResponse;

  return i18nMiddleware(request);
};

export default middleware;
