import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { Admin } from '@/lib/models/Admin';
import { ResetToken } from '@/lib/models/ResetToken';
import { checkRateLimit } from '@/lib/rateLimit';
import { validatePassword } from '@/lib/auth/passwordPolicy';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const isAllowed = await checkRateLimit(ip, 'reset_password', 5, 15); // 5 attempts per 15 minutes
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await connectToDatabase();

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetTokenRecord = await ResetToken.findOne({
      tokenHash,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() }
    });

    if (!resetTokenRecord) {
      return NextResponse.json({ error: 'This password reset link is invalid or has expired. Please request a new one.' }, { status: 400 });
    }

    const admin = await Admin.findById(resetTokenRecord.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Account not active' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = passwordHash;
    admin.passwordChangedAt = new Date();
    await admin.save();

    resetTokenRecord.usedAt = new Date();
    await resetTokenRecord.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
