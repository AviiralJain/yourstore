import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import connectToDatabase from '@/lib/db/mongodb';
import Media from '@/lib/models/Media';
import Project from '@/lib/models/Project';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: 'Invalid Media ID format' }, { status: 400 });
    }

    const { title, altText, description } = await request.json();

    await connectToDatabase();

    const updatedMedia = await Media.findByIdAndUpdate(
      id,
      { $set: { title, altText, description } },
      { new: true }
    );

    if (!updatedMedia) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, media: updatedMedia });
  } catch (error: any) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json({ error: "Invalid Media ID format" }, { status: 400 });
    }
    console.error('Update Media Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: 'Invalid Media ID format' }, { status: 400 });
    }

    await connectToDatabase();
    
    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Protection logic
    const projectsUsingMedia = await Project.countDocuments({ mediaIds: id });
    
    if (projectsUsingMedia > 0) {
      return NextResponse.json(
        { error: 'This media is currently used by one or more projects and cannot be deleted.' },
        { status: 400 }
      );
    }
    
    // Check if the URL is literally in the string array of any project
    const projectsUsingUrl = await Project.countDocuments({ images: media.url });
    if (projectsUsingUrl > 0) {
      return NextResponse.json(
        { error: 'This media is currently used by one or more legacy projects and cannot be deleted.' },
        { status: 400 }
      );
    }

    // Note: We are explicitly avoiding Cloudinary API deletion as requested to prevent destroying assets 
    // that might be hard-referenced somewhere, unless instructed otherwise. 
    // The prompt says "BEFORE deletion, verify the Media record is not referenced... Do NOT cascade delete."
    // Since we verified it, we can delete the MongoDB record.

    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json({ error: "Invalid Media ID format" }, { status: 400 });
    }
    console.error('Delete Media Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
