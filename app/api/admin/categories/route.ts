import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { CategorySchema } = await import('@/lib/validations/admin');
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    // Check if category slug already exists
    const existing = await Category.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 });
    }

    const category = new Category(data);
    await category.save();

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();
    
    // Admin sees all categories, including inactive ones
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
