import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    
    // Ensure Category and Subcategory are registered
    Category.init();
    Subcategory.init();

    const product = await Product.findOne({ slug, isActive: true })
      .populate('categoryId', 'name slug')
      .populate('subcategoryId', 'name slug')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formattedProduct = {
      ...product,
      id: product._id.toString(),
      categoryName: product.categoryId ? (product.categoryId as any).name : 'Unknown',
      subcategoryName: product.subcategoryId ? (product.subcategoryId as any).name : null,
    };

    return NextResponse.json(formattedProduct, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
