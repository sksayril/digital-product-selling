import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Remove server component import that's causing errors
import { Button } from "~/components/ui/button";
import { CheckoutForm } from '~/components/CheckoutForm';

// Fallback products in case API fails
const fallbackProducts: Record<string, {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  driveLink: string;
}> = {
  '1': {
    _id: '1',
    name: 'Ai Relles Bundel',
    description: '5000+ Trending Relles bundle',
    originalPrice: 499,
    discountedPrice: 399,
    imageUrl: '/images/ai-reels-bundle.jpg',
    driveLink: 'https://drive.google.com/drive/folders/example1'
  },
  '2': {
    _id: '2',
    name: '500+ elecel Sheet Template',
    description: 'Complete collection of Excel sheet templates for business and personal use',
    originalPrice: 499,
    discountedPrice: 399,
    imageUrl: '/images/excel-templates.jpg',
    driveLink: 'https://drive.google.com/drive/folders/example2'
  },
  '3': {
    _id: '3',
    name: 'Instragram growth Mstery course',
    description: 'Comprehensive course on growing your Instagram following and engagement',
    originalPrice: 499,
    discountedPrice: 399,
    imageUrl: '/images/instagram-course.jpg',
    driveLink: 'https://drive.google.com/drive/folders/example3'
  }
};

async function getProduct(id: string) {
  try {
    // Check if we have a fallback product that matches the ID
    if (fallbackProducts[id]) {
      return fallbackProducts[id];
    }

    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return the first fallback product if there's an error
    return Object.values(fallbackProducts)[0];
  }
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Properly handle async params
  const resolvedParams = await Promise.resolve(params);
  const id = String(resolvedParams.id);
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const discount = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);

  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                {discount}% OFF
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <Link href="/products" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Back to Products
                  </Link>
                  <h1 className="text-4xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-3 mt-3">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">₹{product.discountedPrice}</p>
                    <p className="text-lg text-gray-500 line-through">₹{product.originalPrice}</p>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      Save ₹{product.originalPrice - product.discountedPrice}
                    </span>
                  </div>

                  <div className="flex items-center mt-3">
                    <div className="flex text-yellow-400 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">4.9 (230+ reviews)</p>
                  </div>
                </div>

                <div className="p-5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">What You'll Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Instant access after payment</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Google Drive link with all materials</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Lifetime updates</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Customer support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Checkout Form */}
              <div id="purchase" className="mt-8 space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Purchase Now</h3>
                <CheckoutForm
                  productId={product._id}
                  productName={product.name}
                  productPrice={product.discountedPrice}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
