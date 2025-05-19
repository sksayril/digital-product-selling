'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  driveLink: string;
  imageUrl: string;
  createdAt: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use hardcoded credentials for client-side
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin@123')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin@123')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
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
        <Button onClick={() => fetchProducts()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage all digital products</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchProducts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Link href="/api/seed" target="_blank">
            <Button size="sm" className="mr-2">
              <Plus className="h-4 w-4 mr-1" />
              Seed Products
            </Button>
          </Link>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {product.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className="font-bold">₹{product.discountedPrice}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                </div>
                <div className="mt-4 flex justify-between">
                  <Link href={`/admin/products/${product._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No products available. Click "Seed Products" to create initial products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
