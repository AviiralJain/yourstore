import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Subcategory from '@/lib/models/Subcategory';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    
    const { SubcategorySchema } = await import('@/lib/validations/admin');
    const parsed = SubcategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    const existing = await Subcategory.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: 'Subcategory slug already exists' }, { status: 409 });
    }

    const subcategory = new Subcategory(data);
    await subcategory.save();

    return NextResponse.json({ success: true, subcategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
