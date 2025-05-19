"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 dark:border-blue-900 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-green-500 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-full p-2">
              <ShoppingBag className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500" />
            </div>
          </div>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">BintaxDigitalProduct</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Products
          </Link>
          <Link href="/#featured" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Featured
          </Link>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
              Shop Now
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-4">
          <nav className="container flex flex-col space-y-4">
            <Link 
              href="/" 
              className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/#featured" 
              className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Featured
            </Link>
            <div className="px-4 pt-2">
              <Link 
                href="/products"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  Shop Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
