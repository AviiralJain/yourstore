import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import StockNotification from '@/lib/models/StockNotification';
import Product from '@/lib/models/Product';
import { z } from 'zod';

const NotifySchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  email: z.string().email('Valid email is required'),
  customerName: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = NotifySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    
    const { productId, email, customerName, phone } = parsed.data;

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 });
    }

    if (product.stockStatus !== 'OUT_OF_STOCK') {
      return NextResponse.json({ error: 'Product is currently in stock' }, { status: 400 });
    }

    // Check for duplicate WAITING request
    const existing = await StockNotification.findOne({
      productId,
      email,
      status: 'WAITING'
    });

    if (existing) {
      return NextResponse.json({ error: 'You are already on the notification list for this product.' }, { status: 409 });
    }

    const notification = new StockNotification({
      productId,
      email,
      customerName,
      phone,
      status: 'WAITING'
    });

    await notification.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating stock notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
