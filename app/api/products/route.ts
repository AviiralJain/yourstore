import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    Product.init();
    Category.init();
    Subcategory.init();
    
    // Parse query params for simple filtering
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    const featured = searchParams.get('featured');
    
    const query: any = { isActive: true };
    if (categoryId) query.categoryId = categoryId;
    if (subcategoryId) query.subcategoryId = subcategoryId;
    if (featured === 'true') query.featured = true;

    const products = await Product.find(query)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .sort({ createdAt: -1 })
      .lean();
      
    // Transform to flat structure for easier frontend consumption
    const formattedProducts = products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      categoryName: p.categoryId ? p.categoryId.name : 'Unknown',
      subcategoryName: p.subcategoryId ? p.subcategoryId.name : null,
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
