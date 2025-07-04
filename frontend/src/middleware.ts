import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isPublic && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  return NextResponse.next();
}

// Match all routes EXCEPT Next.js internals (_next/*), static assets, and API routes
export const config = {
  matcher: [
    /*
     * Match all pages except:
     * - static files (_next)
     * - API routes (/api)
     * - public files (favicon.ico etc.)
    */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
