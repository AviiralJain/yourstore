import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth/jwt';
import connectToDatabase from '@/lib/db/mongodb';
import { Admin } from '@/lib/models/Admin';
import { checkRateLimit, clearRateLimit } from '@/lib/rateLimit';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const isAllowed = await checkRateLimit(ip, 'admin_login', 5, 15); // 5 attempts per 15 minutes
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    const { email, password } = await request.json();

    await connectToDatabase();
    const adminCount = await Admin.countDocuments();

    let isValid = false;

    if (adminCount === 0) {
      // Bootstrap mode: fall back to environment variables
      const envAdminEmail = process.env.ADMIN_EMAIL;
      const envAdminPassword = process.env.ADMIN_PASSWORD;

      if (!envAdminEmail || !envAdminPassword) {
        return NextResponse.json({ error: 'Server configuration error: bootstrap credentials not set' }, { status: 500 });
      }

      if (email === envAdminEmail && password === envAdminPassword) {
        isValid = true;
        
        // Auto-create the admin in DB so requireAdmin checks pass
        const passwordHash = await bcrypt.hash(password, 10);
        await Admin.create({
          email: envAdminEmail.toLowerCase(),
          passwordHash,
          role: 'ADMIN',
          isActive: true
        });
      }
    } else {
      // Normal mode: check MongoDB
      const adminUser = await Admin.findOne({ email: email.toLowerCase() });
      if (adminUser && adminUser.isActive) {
        isValid = await bcrypt.compare(password, adminUser.passwordHash);
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ email });
    await clearRateLimit(ip, 'admin_login');

    const response = NextResponse.json({ success: true }, { status: 200 });
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
