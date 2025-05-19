import { NextResponse } from 'next/server';
import dbConnect from '~/server/db/mongodb';
import Product from '~/server/models/product';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';

// Seed data for our digital products
const seedProducts = [
  {
    name: 'Ai Relles Bundel',
    description: '5000+ Trending Relles bundle',
    originalPrice: 499,
    discountedPrice: 399,
    driveLink: 'https://drive.google.com/drive/folders/example1',
    imageUrl: '/images/ai-reels-bundle.jpg',
  },
  {
    name: '500+ elecel Sheet Template',
    description: 'Complete collection of Excel sheet templates for business and personal use',
    originalPrice: 499,
    discountedPrice: 399,
    driveLink: 'https://drive.google.com/drive/folders/example2',
    imageUrl: '/images/excel-templates.jpg',
  },
  {
    name: 'Instragram growth Mstery course',
    description: 'Comprehensive course on growing your Instagram following and engagement',
    originalPrice: 499,
    discountedPrice: 399,
    driveLink: 'https://drive.google.com/drive/folders/example3',
    imageUrl: '/images/instagram-course.jpg',
  },
];

export async function GET(req: Request) {
  // Only allow admin to seed the database
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Check if products already exist
    const productCount = await Product.countDocuments();

    if (productCount > 0) {
      return NextResponse.json({ message: 'Products already seeded' }, { status: 200 });
    }

    // Insert seed products
    await Product.insertMany(seedProducts);

    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}

// Only allow GET requests to seed the database
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
