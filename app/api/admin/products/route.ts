import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    
    const { ProductSchema } = await import('@/lib/validations/admin');
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    if (data.subcategoryId === '') {
      delete data.subcategoryId;
    }

    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: 'Product slug already exists' }, { status: 409 });
    }

    const product = new Product(data);
    await product.save();

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();
    
    // Admin sees all products
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
