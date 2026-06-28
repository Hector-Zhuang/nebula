import { i18n } from '@/lib/i18n';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

const middleware = createI18nMiddleware(i18n);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const matchesDocs =
    pathname === '/docs' ||
    pathname.startsWith('/docs/') ||
    /^\/(en|zh|ar)\/docs(?:\/|$)/.test(pathname);

  if (!matchesDocs) {
    return NextResponse.next();
  }

  return middleware(request, event);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
