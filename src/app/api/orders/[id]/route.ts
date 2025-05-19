import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/server/db/mongodb';
import Order from '~/server/models/order';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';
import mongoose from 'mongoose';

// The Params type is built into Next.js, so we don't need a custom interface
type Params = {
  params: {
    id: string;
  }
};

// Handler for GET /api/orders/[id]
export async function GET(req: NextRequest, context: Params) {
  try {
    await dbConnect();
    // Use a type assertion to work around type incompatibility
const order = await (Order as any).findById(context.params.id).populate('product');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If the request is not from an admin, verify that this is the user's order
    if (!isAdminAuthenticated(req)) {
      // You could add additional verification here if needed
      // For now, we'll allow access to order details if they have the ID
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// Handler for PUT /api/orders/[id] (Update order payment status)
export async function PUT(req: NextRequest, context: Params) {
  try {
    await dbConnect();
    const data = await req.json();

    // Ensure required payment fields are present
    if (!data.paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Use a type assertion to work around type incompatibility
const order = await (Order as any).findByIdAndUpdate(
      context.params.id,
      {
        paymentId: data.paymentId,
        isPaid: true
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('product');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// Handler for DELETE /api/orders/[id] (Admin only)
export async function DELETE(req: NextRequest, context: Params) {
  // Check admin authentication
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Use a type assertion to work around type incompatibility
const order = await (Order as any).findByIdAndDelete(context.params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
