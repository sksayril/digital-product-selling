import { HydrateClient } from "~/trpc/server";
import { ProductCard } from "~/components/ProductCard";

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

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <HydrateClient>
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Digital Products
            </h1>
            <p className="max-w-[700px] text-neutral-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-neutral-400">
              Discover our premium collection of digital products at unbeatable prices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  description={product.description}
                  originalPrice={product.originalPrice}
                  discountedPrice={product.discountedPrice}
                  imageUrl={product.imageUrl}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No products available at the moment. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </HydrateClient>
  );
}
