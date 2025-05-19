import Link from "next/link";
import Image from "next/image";
// Remove server component import that's causing errors
import { ProductCard } from "~/components/ProductCard";
import { Button } from "~/components/ui/button";

// Define the product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  driveLink?: string;
}

async function getProducts() {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  // Hardcoded products in case API fails
  const fallbackProducts = [
    {
      _id: '1',
      name: 'Ai Relles Bundel',
      description: '5000+ Trending Relles bundle',
      originalPrice: 499,
      discountedPrice: 399,
      imageUrl: '/images/ai-reels-bundle.jpg'
    },
    {
      _id: '2',
      name: '500+ elecel Sheet Template',
      description: 'Complete collection of Excel sheet templates for business and personal use',
      originalPrice: 499,
      discountedPrice: 399,
      imageUrl: '/images/excel-templates.jpg'
    },
    {
      _id: '3',
      name: 'Instragram growth Mstery course',
      description: 'Comprehensive course on growing your Instagram following and engagement',
      originalPrice: 499,
      discountedPrice: 399,
      imageUrl: '/images/instagram-course.jpg'
    }
  ];

  const displayProducts = products && products.length > 0 ? products : fallbackProducts;

  return (
    <div>
      {/* Hero Section with Modern Animated Gradient Background */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-green-400 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-medium">
                Welcome to BintaxDigitalProduct
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-500 to-indigo-600 dark:from-blue-400 dark:via-green-400 dark:to-indigo-400">
                  Premium Digital Products for Modern Success
                </h1>
                <p className="max-w-[600px] text-gray-700 text-xl md:text-2xl dark:text-gray-300">
                  Elevate your digital presence with our exclusive collection of premium digital products.
                  <span className="font-bold text-green-600 dark:text-green-400 block mt-3">Limited time offer - All products at ₹399 only!</span>
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" className="px-8 py-6 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 text-lg font-bold">
                    Browse Products
                  </Button>
                </Link>
                <Link href="#featured">
                  <Button size="lg" variant="outline" className="px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/50 rounded-xl text-lg font-bold">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <Image src={`/images/avatar-${i}.jpg`} width={40} height={40} alt={`Customer ${i}`} />
                    </div>
                  ))}
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-bold">500+</span> happy customers this month
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative w-full aspect-square overflow-hidden rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/20 backdrop-blur-sm">
                <Image
                  src="/images/hero-digital-products.jpg"
                  alt="BintaxDigitalProduct Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-green-900/20"></div>
                
                {/* Floating badges */}
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">SPECIAL OFFER</div>
                  <div className="text-2xl font-extrabold">20% OFF</div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm font-bold">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products with Product Cards */}
      <section id="featured" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative">
                <span className="inline-block">
                  Featured Products
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-500 rounded-full transform translate-y-2 mx-auto w-24"></span>
                </span>
              </h2>
              <p className="max-w-[700px] text-neutral-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-neutral-400">
                Explore our collection of premium digital products to enhance your creative workflow and boost your digital presence.
              </p>
            </div>
          </div>

          {/* Feature Product Highlights */}
          <div className="mt-12 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m16 12-4 4-4-4"/>
                  <path d="M12 8v8"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Instant Download</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Get immediate access to your purchased digital products
              </p>
            </div>
            <div className="rounded-xl bg-pink-50 dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 dark:text-pink-400">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                High-quality products created by industry professionals
              </p>
            </div>
            <div className="rounded-xl bg-green-50 dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure Payment</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Your payment is secure and processed through Razorpay
              </p>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {displayProducts.map((product: Product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                description={product.description}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="px-8 rounded-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="max-w-[700px] text-neutral-500 md:text-xl/relaxed dark:text-neutral-400">
                Hear from our satisfied customers who have transformed their digital presence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center">
                  <span className="text-indigo-700 font-bold">RK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rahul Kumar</h4>
                  <p className="text-sm text-neutral-500">Content Creator</p>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 flex-1">
                "The AI Reels Bundle has been a game-changer for my Instagram content strategy. So many creative ideas in one place!"
              </p>
              <div className="mt-4 flex text-yellow-400">
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
            </div>

            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-pink-100 w-12 h-12 flex items-center justify-center">
                  <span className="text-pink-700 font-bold">PS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Priya Sharma</h4>
                  <p className="text-sm text-neutral-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 flex-1">
                "The excel templates saved me hours of work. Very professional and easy to customize for my business needs."
              </p>
              <div className="mt-4 flex text-yellow-400">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="opacity-40">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center">
                  <span className="text-green-700 font-bold">AP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Arjun Patel</h4>
                  <p className="text-sm text-neutral-500">Digital Marketer</p>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 flex-1">
                "The Instagram Growth course helped me go from 500 to 10K followers in just 3 months. Worth every penny!"
              </p>
              <div className="mt-4 flex text-yellow-400">
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
            </div>
          </div>
        </div>
      </section>

<section id="featured" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative">
                <span className="inline-block">
                  Featured Products
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-500 rounded-full transform translate-y-2 mx-auto w-24"></span>
                </span>
              </h2>
              <p className="max-w-[700px] text-neutral-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-neutral-400">
                Explore our collection of premium digital products to enhance your creative workflow and boost your digital presence.
              </p>
            </div>
          </div>

          {/* Feature Product Highlights */}
          <div className="mt-12 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m16 12-4 4-4-4"/>
                  <path d="M12 8v8"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Instant Download</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Get immediate access to your purchased digital products
              </p>
            </div>
            <div className="rounded-xl bg-pink-50 dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 dark:text-pink-400">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                High-quality products created by industry professionals
              </p>
            </div>
            <div className="rounded-xl bg-green-50 dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure Payment</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Your payment is secure and processed through Razorpay
              </p>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {displayProducts.map((product: Product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                description={product.description}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="px-8 rounded-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-800 dark:to-green-800">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute left-0 top-0 h-full w-full text-indigo-500 dark:text-indigo-800 opacity-20"
            fill="none"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_410_213)">
              <path
                d="M400 0H0V400H400V0Z"
                fill="currentColor"
              ></path>
              <path
                d="M184.5 55C202.2 41.4 208.8 16.6 195.2 -1.1C181.6 -18.8 156.8 -25.4 139.1 -11.8C121.4 1.8 114.8 26.6 128.4 44.3C142 62 166.8 68.6 184.5 55Z"
                fill="currentColor"
              ></path>
              <path
                d="M378.8 144.9C391.4 127.2 384.8 102.4 367.1 89.8C349.4 77.2 324.6 83.8 312 101.5C299.4 119.2 306 144 323.7 156.6C341.4 169.2 366.2 162.6 378.8 144.9Z"
                fill="currentColor"
              ></path>
              <path
                d="M79.7 269.9C92.3 252.2 85.7 227.4 68 214.8C50.3 202.2 25.5 208.8 12.9 226.5C0.3 244.2 6.9 269 24.6 281.6C42.3 294.2 67.1 287.6 79.7 269.9Z"
                fill="currentColor"
              ></path>
              <path
                d="M286.7 320.1C304.4 306.5 311 281.7 297.4 264C283.8 246.3 259 239.7 241.3 253.3C223.6 266.9 217 291.7 230.6 309.4C244.2 327.1 269 333.7 286.7 320.1Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </div>
        <div className="container relative px-4 md:px-6 z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-5 max-w-3xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
                BintaxDigitalProduct Special Offer
              </div>
              <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-white drop-shadow-md">
                Limited Time Offer
              </h2>
              <p className="text-xl md:text-2xl text-white/90">
                All premium digital products at flat <span className="line-through">₹499</span> <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">₹399 only</span>.
                <br/>Hurry up, offer valid for a limited time!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/products">
                <Button size="lg" className="px-8 py-6 bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 border-2 border-white hover:bg-blue-50 rounded-xl transition-all transform hover:scale-105 text-lg font-bold">
                  Shop Now
                </Button>
              </Link>
              <Link href="#featured">
                <Button size="lg" variant="outline" className="px-8 py-6 border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all text-lg font-bold">
                  View Products
                </Button>
              </Link>
            </div>
            <p className="text-indigo-200 text-sm">
              * Offer valid for a limited time. Terms and conditions apply.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
