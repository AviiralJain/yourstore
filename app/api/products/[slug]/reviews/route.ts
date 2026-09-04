import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    
    const product = await Product.findOne({ slug, isActive: true }).lean();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const reviews = await Review.find({ 
      productId: product._id,
      status: 'APPROVED'
    }).sort({ createdAt: -1 }).lean();
    
    // Calculate aggregate metrics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: Number(averageRating),
      totalReviews
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
