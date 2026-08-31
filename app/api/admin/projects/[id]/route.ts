import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    
    const { ProjectSchema } = await import('@/lib/validations/admin');
    const parsed = ProjectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    if (data.slug) {
      const existing = await Project.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: 'Project slug already exists' }, { status: 409 });
      }
    }

    const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;

    await connectToDatabase();
    
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
