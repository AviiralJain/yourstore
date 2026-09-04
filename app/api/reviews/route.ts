import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';
import { z } from 'zod';

const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review: z.string().min(5, "Review must be at least 5 characters").max(2000, "Review is too long"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate payload
    const validatedData = reviewSchema.parse({
      productId: body.productId,
      customerName: body.customerName,
      rating: Number(body.rating),
      review: body.review
    });

    await connectToDatabase();
    
    // Check if product exists and is active
    const product = await Product.findOne({ _id: validatedData.productId, isActive: true });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found or inactive' }, { status: 404 });
    }

    // Force status to PENDING for security
    const newReview = await Review.create({
      ...validatedData,
      status: 'PENDING'
    });

    return NextResponse.json(
      { message: 'Review submitted successfully', reviewId: newReview._id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting review:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as any).errors || (error as any).issues }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
