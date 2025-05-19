import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '~/server/db/mongodb';
import Product from '~/server/models/product';
import { createOrder } from '~/server/utils/razorpay';

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

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
      // Try to connect to MongoDB
      await dbConnect();

      // Check if the productId is a valid MongoDB ObjectId
      let product = null;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        try {
          // Connect directly to the MongoDB collection to avoid TypeScript issues with Mongoose
          const { db } = await dbConnect();
          // Use the raw MongoDB driver which is more TypeScript friendly
          const productsCollection = db.collection('products');
          product = await productsCollection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
          
          // If found, make sure it's in the expected format
          if (product) {
            console.log('Product found in database:', product);
          }
        } catch (queryError) {
          console.error('Error querying product:', queryError);
          product = null;
        }
      } else {
        // If not a valid ObjectId, it's probably a fallback ID like '1', '2', etc.
        // Skip the DB query to avoid the error
        product = null;
      }

      if (product) {
        // Create Razorpay order
        const { id: orderId } = await createOrder(product.discountedPrice);

        // Make sure we return all required fields in the expected format
        return NextResponse.json({
          orderId: orderId,
          amount: product.discountedPrice * 100, // amount in paisa (Razorpay expects amount in smallest currency unit)
          currency: 'INR',
          product_name: product.name,
          product_id: productId
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with fallback if DB error occurs
    }

    // Fallback: use hardcoded product data if DB call failed or product not found
    // First try the exact ID, then fallback to the first product
    const fallbackProduct = fallbackProducts[productId] || fallbackProducts['1'] || {
      _id: '1',
      name: 'Default Product',
      description: 'Default product description',
      originalPrice: 499,
      discountedPrice: 399,
      imageUrl: '/images/default.jpg',
      driveLink: 'https://example.com'
    };

    // Create Razorpay order with fallback product
    const { id: orderId } = await createOrder(fallbackProduct.discountedPrice);

    // Return consistent format with all required fields
    return NextResponse.json({
      orderId: orderId,
      amount: fallbackProduct.discountedPrice * 100, // amount in paisa
      currency: 'INR',
      product_name: fallbackProduct.name,
      product_id: productId
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
