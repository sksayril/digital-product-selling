import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
}

export function ProductCard({
  id,
  name,
  description,
  originalPrice,
  discountedPrice,
  imageUrl
}: ProductCardProps) {
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-800 rounded-xl group">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          {discount}% OFF
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold line-clamp-1" title={name}>
          {name}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-0 flex-grow">
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{discountedPrice}</p>
          <p className="text-sm text-gray-500 line-through">₹{originalPrice}</p>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-xs text-gray-500">(120+ sold)</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Link href={`/products/${id}`} className="w-full">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
              View Details
            </Button>
          </Link>
          <Link href={`/products/${id}#purchase`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white transition-all">
              Purchase Now
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
