import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Notification from '@/lib/models/Notification';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    
    // Strict validation
    if (typeof body.read !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body. Expected { "read": boolean }' }, { status: 400 });
    }

    await connectToDatabase();
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: body.read },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification }, { status: 200 });
  } catch (error: any) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json({ error: "Invalid Notification ID format" }, { status: 400 });
    }
    console.error('Error updating notification:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
