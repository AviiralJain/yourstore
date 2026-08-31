import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    
    const { SubcategorySchema } = await import('@/lib/validations/admin');
    const parsed = SubcategorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    if (data.slug) {
      const existing = await Subcategory.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: 'Subcategory slug already exists' }, { status: 409 });
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, subcategory }, { status: 200 });
  } catch (error) {
    console.error('Error updating subcategory:', error);
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
    const prodcount = await Product.countDocuments({ subcategoryId: id });
    
    if (prodcount > 0) {
      return NextResponse.json({ error: `Cannot delete subcategory. It has ${prodcount} products attached.` }, { status: 400 });
    }

    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
