import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse, } from 'next/server';
import { redirectToLogin } from './utilities/middleware/auth';  

export default async function middleware(request: NextRequest) {
  
  const authRedirect = redirectToLogin(request);
  if (authRedirect) {
    return authRedirect;
  }
 
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
 
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/', 
    '/(ru|en)/:path*'
  ]
};