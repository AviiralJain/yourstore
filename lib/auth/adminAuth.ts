import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import connectToDatabase from '@/lib/db/mongodb';
import { Admin } from '@/lib/models/Admin';

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
      cookieHeader.split(';').map(c => c.trim().split('='))
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

  if (!payload || !payload.email) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const admin = await Admin.findOne({ email: (payload.email as string).toLowerCase() });
    
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Unauthorized: Account deactivated or removed' }, { status: 401 });
    }
    
    if (admin.passwordChangedAt && payload.iat) {
      // payload.iat is in seconds, passwordChangedAt is a Date
      const iatMs = (payload.iat as number) * 1000;
      console.log('DEBUG: iatMs =', iatMs, 'passwordChangedAt =', admin.passwordChangedAt.getTime(), 'diff =', admin.passwordChangedAt.getTime() - iatMs);
      // Allow a small buffer (1 second) for clock skew/JWT rounding
      if (iatMs + 1000 < admin.passwordChangedAt.getTime()) {
        return NextResponse.json({ error: 'Unauthorized: Session expired due to password change' }, { status: 401 });
      }
    }
  } catch (error) {
    // If DB fails, we could reject or allow. Given it's admin, safer to reject.
    return NextResponse.json({ error: 'Internal Server Error during authentication' }, { status: 500 });
  }

  return null; // Return null if authorized
}
