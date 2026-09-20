import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import FormOption from '@/lib/models/FormOption';
import { requireAdmin } from '@/lib/auth/adminAuth';
import mongoose from 'mongoose';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    
    // Whitelist only allowed fields for update
    const updateData: any = {};
    if (typeof body.label === 'string' && body.label.trim() !== '') updateData.label = body.label.trim();
    if (typeof body.value === 'string' && body.value.trim() !== '') updateData.value = body.value.trim();
    if (typeof body.active === 'boolean') updateData.active = body.active;
    if (typeof body.displayOrder === 'number' && Number.isFinite(body.displayOrder) && body.displayOrder >= 0) {
      updateData.displayOrder = body.displayOrder;
    }

    if (Object.keys(updateData).length === 0) {
       return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const updatedOption = await FormOption.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedOption) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedOption, { status: 200 });
  } catch (error) {
    console.error('Error updating form option:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
