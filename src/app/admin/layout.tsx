import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, User, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/admin" className="flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </Link>
          </div>
          <nav className="flex-1 pt-6 px-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Package className="h-5 w-5 mr-3" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Orders
            </Link>
            <Link
              href="/"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Back to Site
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
