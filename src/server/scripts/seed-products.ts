/**
 * Product seeding script to ensure products exist in MongoDB
 * Run this script with: npm run seed-products
 */

import mongoose from 'mongoose';
// Import directly from model file instead of using env validation
import Product from '../models/product';
import type { IProduct } from '../models/product';

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-products';

// Log env variables to help debug
console.log('MongoDB URI set to:', MONGODB_URI);

const products = [
  {
    name: 'AI Reels Bundle',
    description: '5000+ Trending Reels bundle',
    originalPrice: 499,
    discountedPrice: 399,
    imageUrl: '/images/ai-reels-bundle.jpg',
    driveLink: 'https://drive.google.com/drive/folders/example1'
  },
  {
    name: '500+ Excel Sheet Templates',
    description: 'Complete collection of Excel sheet templates for business and personal use',
    originalPrice: 499,
    discountedPrice: 399,
    imageUrl: '/images/excel-templates.jpg',
    driveLink: 'https://drive.google.com/drive/folders/example2'
  },
  {
    name: 'Instagram Growth Mastery Course',
    description: 'Comprehensive course on growing your Instagram following and engagement',
    originalPrice: 499,
    discountedPrice: 399,
    imageUrl: '/images/instagram-course.jpg',
    driveLink: 'https://drive.google.com/drive/folders/example3'
  },
];

async function seedProducts() {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB with the direct URI
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing products to avoid duplicates
    // Use a different approach without using direct database operations
    try {
      // Get the default Mongoose connection
      const mongooseDB = mongoose.connection;
      
      // Wait for the connection to be ready
      if (mongooseDB.readyState !== 1) {
        await new Promise(resolve => mongooseDB.once('open', resolve));
      }
      
      // Now it's safe to access the database
      if (mongooseDB.db) {
        await mongooseDB.db.collection('products').deleteMany({});
      } else {
        console.log('Could not access the database directly, using alternate method');
        // Alternative approach if db is not accessible
        await mongoose.model('Product').deleteMany().exec();
      }
      console.log('Cleared existing products');
    } catch (error) {
      console.error('Error clearing products:', error);
    }

    // Use a different approach to avoid TypeScript callable union errors
    // Create products one by one to avoid TypeScript errors with bulk creation
    const results = [];
    for (const product of products) {
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
      results.push(savedProduct);
    }
    
    console.log(`Seeded ${results.length} products successfully!`);
    console.log('Product IDs (important for checkout):');
    results.forEach((product: any, index: number) => {
      console.log(`${index + 1}: ${product._id} - ${product.name}`);
    });
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts();
