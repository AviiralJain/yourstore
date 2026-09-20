import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Notification from '@/lib/models/Notification';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();
    
    // Explicitly marking only global admin notification streams as read.
    // (There is currently only one stream/recipient architecture)
    await Notification.updateMany(
      { read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error marking all notifications as read:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
