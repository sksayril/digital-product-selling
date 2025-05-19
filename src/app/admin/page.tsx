'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Package,
  IndianRupee,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  amount: number;
  isPaid: boolean;
  createdAt: string;
  purchaseDate?: string;
  // Handle both types of product references
  product?: {
    _id: string;
    name: string;
  };
  productId?: string;        // For fallback products
  productName?: string;      // For fallback products
  productDescription?: string; // For fallback products
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`)
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total products in store
            </p>
            <Link href="/admin/products" className="mt-3 inline-flex items-center text-sm text-blue-500">
              Manage products <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total completed orders
            </p>
            <Link href="/admin/orders" className="mt-3 inline-flex items-center text-sm text-blue-500">
              View all orders <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Order ID</th>
                  <th className="text-left py-3 px-2 font-medium">Customer</th>
                  <th className="text-left py-3 px-2 font-medium">Product</th>
                  <th className="text-left py-3 px-2 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-3 px-2 text-xs">
                        <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                          {order._id.substring(0, 8)}...
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <div>{order.name}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                        <div className="text-xs text-muted-foreground">{order.mobile}</div>
                      </td>
                      <td className="py-3 px-2">
                        {/* Handle both MongoDB products and fallback products */}
                        {order.product ? order.product.name : order.productName || 'Unknown Product'}
                      </td>
                      <td className="py-3 px-2">₹{order.amount}</td>
                      <td className="py-3 px-2">
                        {new Date(order.purchaseDate || order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
