import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { Admin } from '@/lib/models/Admin';
import { requireAdmin } from '@/lib/auth/adminAuth';
import { verifyToken } from '@/lib/auth/jwt';
import { validatePassword } from '@/lib/auth/passwordPolicy';
import bcrypt from 'bcryptjs';

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => c.trim().split('='))
    );
    const token = cookies['admin_token'];
    
    // We already know it's valid from requireAdmin, but we need the payload to identify the user
    const payload = await verifyToken(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await connectToDatabase();
    
    // In bootstrap mode (0 admins), we can't change password since it's hardcoded in env
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      return NextResponse.json({ error: 'Cannot change password in bootstrap mode. Please run setup first.' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: (payload.email as string).toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }
    
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = passwordHash;
    admin.passwordChangedAt = new Date();
    await admin.save();
    
    const response = NextResponse.json({ success: true, message: 'Password updated successfully' });
    response.cookies.delete('admin_token');

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
