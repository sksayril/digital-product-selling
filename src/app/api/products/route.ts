import { NextResponse } from 'next/server';
import dbConnect from '~/server/db/mongodb';
import Product from '~/server/models/product';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';

// Handler for GET /api/products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Handler for POST /api/products (Admin only)
export async function POST(req: Request) {
  // Check admin authentication
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'originalPrice', 'discountedPrice', 'driveLink', 'imageUrl'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
