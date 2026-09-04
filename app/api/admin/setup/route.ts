import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { Admin } from '@/lib/models/Admin';
import { validatePassword } from '@/lib/auth/passwordPolicy';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // Check if an admin already exists
    const existingAdminCount = await Admin.countDocuments();
    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: 'Setup already complete' },
        { status: 403 }
      );
    }

    const { email, password, bootstrapEmail, bootstrapPassword } = await request.json();

    // Validate against existing environment credentials
    const envAdminEmail = process.env.ADMIN_EMAIL;
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    if (!envAdminEmail || !envAdminPassword) {
      return NextResponse.json(
        { error: 'Server configuration error: bootstrap credentials not set' },
        { status: 500 }
      );
    }

    if (bootstrapEmail !== envAdminEmail || bootstrapPassword !== envAdminPassword) {
      return NextResponse.json(
        { error: 'Invalid bootstrap credentials' },
        { status: 401 }
      );
    }

    // Validate new admin data
    if (!email) {
      return NextResponse.json(
        { error: 'Admin email is required.' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email: email.toLowerCase(),
      passwordHash,
      passwordChangedAt: new Date(),
    });

    await newAdmin.save();

    return NextResponse.json({ success: true, message: 'Admin account created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
