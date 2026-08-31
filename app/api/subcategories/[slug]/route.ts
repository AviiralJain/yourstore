import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    await connectToDatabase();
    
    const subcategory = await Subcategory.findOne({ slug, isActive: true }).lean();
    
    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }
    
    const category = await Category.findById(subcategory.categoryId).lean();

    const products = await Product.find({ subcategoryId: subcategory._id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      subcategory: {
        ...subcategory,
        id: subcategory._id.toString()
      },
      category: category ? {
        ...category,
        id: category._id.toString()
      } : null,
      products: products.map((p: any) => ({
        ...p,
        id: p._id.toString()
      }))
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
