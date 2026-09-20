import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import FormOption from '@/lib/models/FormOption';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const options = await FormOption.find({ active: true }).sort({ displayOrder: 1 });
    
    // Group them for easier consumption by the frontend
    const groupedOptions = options.reduce((acc, option) => {
      if (!acc[option.group]) {
        acc[option.group] = [];
      }
      acc[option.group].push(option);
      return acc;
    }, {});
    
    return NextResponse.json(groupedOptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching form options:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
