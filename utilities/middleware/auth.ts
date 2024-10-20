import { NextRequest, NextResponse } from 'next/server';
import { locales } from '@/i18n/routing';

const noAuthPages = [
	'/',
	'/auth'
];

export function checkAuthentication(request: NextRequest): boolean {
  const token = request.cookies.get('auth-token')?.value;
  return !!token;
}

function isPublicPage(pathname: string): boolean {
	const localeCodes = locales.map(l => l.code)
	const localePattern = `^\\/(${localeCodes.join('|')})(\\/|$)`;
  const pathWithoutLocale = pathname.replace(new RegExp(localePattern), '/');

  return noAuthPages.includes(pathWithoutLocale);
}

export function redirectToLogin(request: NextRequest, loginPath: string = '/auth'): NextResponse | null {
  const isAuthenticated = checkAuthentication(request);

	const isPublic = isPublicPage(request.nextUrl.pathname);

  if (isPublic) {
    return null;
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return null;
}