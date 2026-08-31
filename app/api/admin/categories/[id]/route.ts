import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const { CategorySchema } = await import('@/lib/validations/admin');
    const parsed = CategorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    if (data.slug) {
      const existing = await Category.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 });
      }
    }

    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;

    await connectToDatabase();
    
    // Check for orphans
    const subcount = await Subcategory.countDocuments({ categoryId: id });
    const prodcount = await Product.countDocuments({ categoryId: id });
    
    if (subcount > 0 || prodcount > 0) {
      return NextResponse.json({ error: `Cannot delete category. It has ${subcount} subcategories and ${prodcount} products attached.` }, { status: 400 });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
