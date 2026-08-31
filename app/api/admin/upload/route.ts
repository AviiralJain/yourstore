import { NextResponse, NextRequest } from 'next/server';
import cloudinary from '@/lib/cloudinary/config';
import { verifyToken } from '@/lib/auth/jwt';

export const runtime = 'nodejs'; // Use node environment to handle buffer easily

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Extract Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'yourstore/general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Validate File
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image is too large. Please upload an image below 5MB.' }, { status: 400 });
    }

    // 4. Upload to Cloudinary using stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary SDK Error:', {
              message: error.message,
              http_code: error.http_code,
              name: error.name
            });
            reject(new Error(error.message || 'Cloudinary upload failed'));
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    // 5. Return safely structured data
    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
