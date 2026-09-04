import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicAdminRoutes = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password'
  ];
  
  const publicApiRoutes = [
    '/api/admin/login',
    '/api/admin/setup',
    '/api/admin/auth/forgot-password',
    '/api/admin/auth/reset-password'
  ];

  // Protect /admin and /api/admin routes
  if (
    (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname)) ||
    (pathname.startsWith('/api/admin') && !publicApiRoutes.includes(pathname))
  ) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    
    if (!payload) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized - Invalid Token' }, { status: 401 });
      }
      // Clear invalid cookie and redirect
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // If already logged in, don't show login/forgot/reset pages again
  if (publicAdminRoutes.includes(pathname)) {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
