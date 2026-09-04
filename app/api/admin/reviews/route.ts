import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import connectToDatabase from '@/lib/db/mongodb';
import Review from '@/lib/models/Review';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();
    Product.init(); // Ensure Product model is registered for population
    
    const reviews = await Review.find()
      .populate('productId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
