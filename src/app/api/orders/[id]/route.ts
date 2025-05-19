import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/server/db/mongodb';
import Order from '~/server/models/order';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';

// We don't need to define our own params type for Next.js route handlers

// Handler for GET /api/orders/[id]
// Using proper Next.js 15 type definitions for route handlers
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    // Use a type assertion to work around type incompatibility
// Extract the ID from the URL instead of using the context parameter
const id = request.nextUrl.pathname.split('/').pop();
const order = await (Order as any).findById(id).populate('product');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If the request is not from an admin, verify that this is the user's order
    if (!isAdminAuthenticated(request)) {
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
// Using proper Next.js 15 type definitions for route handlers
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();

    // Ensure required payment fields are present
    if (!data.paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Use a type assertion to work around type incompatibility
// Extract the ID from the URL instead of using the context parameter
const id = request.nextUrl.pathname.split('/').pop();
const order = await (Order as any).findByIdAndUpdate(
      id,
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
// Using proper Next.js 15 type definitions for route handlers
export async function DELETE(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Use a type assertion to work around type incompatibility
// Extract the ID from the URL instead of using the context parameter
const id = request.nextUrl.pathname.split('/').pop();
const order = await (Order as any).findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
