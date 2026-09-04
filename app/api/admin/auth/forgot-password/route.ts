import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { Admin } from '@/lib/models/Admin';
import { ResetToken } from '@/lib/models/ResetToken';
import { checkRateLimit } from '@/lib/rateLimit';
import crypto from 'crypto';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const isAllowed = await checkRateLimit(ip, 'forgot_password', 3, 60); // 3 attempts per hour
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({ 
      success: true, 
      message: 'If an account exists for this email, a password reset link has been sent.' 
    });

    if (!admin || !admin.isActive) {
      return successResponse;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // Fail safely if not configured, do not log tokens or secrets
      return NextResponse.json({ error: 'Email provider is not configured on the server.' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    // Invalidate previous active tokens for this admin
    await ResetToken.updateMany(
      { adminId: admin._id, usedAt: { $exists: false } },
      { $set: { usedAt: new Date() } }
    );

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

    await ResetToken.create({
      adminId: admin._id,
      tokenHash,
      expiresAt,
    });

    const appUrl = process.env.NEXTAUTH_URL || 'https://yourstore.com';
    const resetUrl = `${appUrl}/admin/reset-password?token=${resetToken}`;

    const fromEmail = process.env.ADMIN_EMAIL_FROM || 'admin@yourstore.com';

    await resend.emails.send({
      from: `YOURSTORE <${fromEmail}>`,
      to: [admin.email],
      subject: 'YOURSTORE - Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your YOURSTORE admin account.</p>
          <p>Click the button below to reset your password. This link expires in 30 minutes.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">RESET PASSWORD</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    });

    return successResponse;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
