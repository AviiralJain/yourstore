import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import connectToDatabase from '@/lib/db/mongodb';
import Review from '@/lib/models/Review';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    
    const validatedData = statusSchema.parse(body);

    await connectToDatabase();
    
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status: validatedData.status },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Error updating review status:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: (error as any).errors || (error as any).issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;

    await connectToDatabase();
    
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
