import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Checks if the request has a valid admin JWT cookie.
 * Returns a 401 NextResponse if invalid, or null if valid.
 */
export async function requireAdmin(request: Request) {
  // Try getting from cookies first
  const cookieHeader = request.headers.get('cookie');
  let token = null;

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => c.split('='))
    );
    token = cookies['admin_token'];
  }

  // Fallback to Authorization header if not in cookies (e.g. API clients)
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }

  return null; // Return null if authorized
}
