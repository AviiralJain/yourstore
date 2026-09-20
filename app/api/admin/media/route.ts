import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminAuth';
import connectToDatabase from '@/lib/db/mongodb';
import Media from '@/lib/models/Media';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectToDatabase();

    const query: any = {};
    
    if (search) {
      const escapedSearch = search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$or = [
        { filename: searchRegex },
        { title: searchRegex },
        { publicId: searchRegex }
      ];
    }

    const skip = (page - 1) * limit;

    const [mediaItems, total] = await Promise.all([
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Media.countDocuments(query)
    ]);

    return NextResponse.json({
      media: mediaItems,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch Media Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
