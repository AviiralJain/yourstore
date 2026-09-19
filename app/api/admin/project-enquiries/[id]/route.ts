import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db/mongodb';
import ProjectEnquiry from '@/lib/models/ProjectEnquiry';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    const allowedStatuses = ['new', 'contacted', 'in_discussion', 'in_development', 'completed', 'closed'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();
    
    const enquiry = await ProjectEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: 'Project enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error('Error updating project enquiry status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
