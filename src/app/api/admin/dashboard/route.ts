import { NextResponse } from 'next/server';
import dbConnect from '~/server/db/mongodb';
import Product from '~/server/models/product';
import Order from '~/server/models/order';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';

export async function GET(req: Request) {
  // Check admin authentication
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Get dashboard statistics
    const [totalProducts, totalOrders, recentOrders, totalSales] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments({ isPaid: true }),
      Order.find({ isPaid: true }).sort({ createdAt: -1 }).limit(5).populate('product'),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalSales: totalSales.length > 0 ? totalSales[0].total : 0
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
