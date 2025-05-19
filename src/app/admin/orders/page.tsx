'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Eye, Download } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { toast } from 'sonner';

interface Order {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  // Handle both types of product references
  product?: {
    _id: string;
    name: string;
  };
  productId?: string;        // For fallback products
  productName?: string;      // For fallback products
  productDescription?: string; // For fallback products
  amount: number;
  paymentId: string;
  orderId: string;
  isPaid: boolean;
  createdAt: string;
  purchaseDate?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin@123')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    // Create CSV content
    const headers = ['Order ID', 'Customer Name', 'Email', 'Mobile', 'Product', 'Amount', 'Payment ID', 'Status', 'Date'];
    const csvRows = [
      headers.join(','),
      ...orders.map(order => [
        order._id,
        `"${order.name}"`, // Wrap with quotes to handle commas in names
        `"${order.email}"`,
        order.mobile,
        `"${order.product ? order.product.name : order.productName || 'Unknown Product'}"`,
        order.amount,
        order.paymentId || 'N/A',
        order.isPaid ? 'Paid' : 'Pending',
        new Date(order.purchaseDate || order.createdAt).toLocaleDateString()
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Orders exported successfully');
  };

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
        <Button onClick={() => fetchOrders()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage all customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchOrders} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={exportOrdersCSV} size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-3 px-4 text-xs">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <div>{order.name}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                        <div className="text-xs text-muted-foreground">{order.mobile}</div>
                      </td>
                      <td className="py-3 px-4">
                        {/* Handle both regular products and fallback products */}
                        {order.product ? order.product.name : order.productName || 'Unknown Product'}
                      </td>
                      <td className="py-3 px-4">₹{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${order.isPaid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.purchaseDate || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
