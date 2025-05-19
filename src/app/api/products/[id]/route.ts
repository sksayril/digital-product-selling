import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/server/db/mongodb';
import Product from '~/server/models/product';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';

interface Params {
  params: {
    id: string;
  };
}

// Handler for GET /api/products/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    // Properly handle async params
    const resolvedParams = await Promise.resolve(params);
    const product = await Product.findById(resolvedParams.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Handler for PUT /api/products/[id] (Admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  // Check admin authentication
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    // Properly handle async params
    const resolvedParams = await Promise.resolve(params);

    const product = await Product.findByIdAndUpdate(resolvedParams.id, data, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Handler for DELETE /api/products/[id] (Admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
  // Check admin authentication
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Properly handle async params
    const resolvedParams = await Promise.resolve(params);
    const product = await Product.findByIdAndDelete(resolvedParams.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
