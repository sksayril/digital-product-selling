import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '~/server/db/mongodb';
import Order from '~/server/models/order';
import { isAdminAuthenticated } from '~/server/utils/adminAuth';
import { MongoClient } from 'mongodb';

// Handler for GET /api/orders (Admin only)
export async function GET(req: Request) {
  // Check admin authentication
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to MongoDB using Mongoose
    await dbConnect();
    
    // Use Mongoose model to fetch orders
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
      
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Handler for POST /api/orders (Create initial order)
export async function POST(req: Request) {
  try {
    // Connect to MongoDB using Mongoose
    await dbConnect();
    
    // Get direct MongoDB connection for collection operations
    const client = mongoose.connection.getClient();
    const db = client.db();
    
    // Parse the request data
    const data = await req.json();
    console.log('Received order data:', data);

    // Validate required fields
    const requiredFields = ['name', 'email', 'mobile', 'amount', 'orderId'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Special check for product ID - either product or productId must be present
    if (!data.product && !data.productId) {
      return NextResponse.json({ error: 'Either product or productId is required' }, { status: 400 });
    }
    
    // Define the fallback products for consistent reference
    const fallbackProducts: Record<string, any> = {
      '1': {
        name: 'AI Reels Bundle',
        description: '5000+ Trending Reels bundle',
        price: 399
      },
      '2': {
        name: '500+ Excel Sheet Templates',
        description: 'Excel templates',
        price: 399
      },
      '3': {
        name: 'Instagram Growth Mastery Course',
        description: 'Instagram course',
        price: 399
      },
    };
    
    // Extract the product ID from the request
    // data.product might be an ObjectId string or a fallback ID like '1', '2', etc.
    const productId = data.product || data.productId;
    let productData = null;
    let orderData: any = {};
    
    // Build the common order data fields
    orderData = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      amount: data.amount,
      orderId: data.orderId,
      paymentId: data.paymentId || null,
      isPaid: false,
      purchaseDate: new Date(),
      // Always provide a productName since it's required
      productName: data.productName || 'Unknown Product'
    };
    
    // Handle different product ID types
    if (mongoose.Types.ObjectId.isValid(productId)) {
      try {
        // For valid MongoDB ObjectId: try to find the product in the database
        console.log('Looking up MongoDB product with ID:', productId);
        // Use the client's db connection to get the collection
        const productsCollection = db.collection('products');
        const product = await productsCollection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
        
        if (product) {
          console.log('Found product in database:', product);
          // MongoDB product found - store the reference and details
          orderData.product = new mongoose.Types.ObjectId(productId);
          orderData.productName = product.name;
          orderData.productDescription = product.description;
        } else {
          console.log('Valid ObjectId but product not found in database');
          // Valid ObjectId but no product found - revert to fallback
          orderData.productId = productId;
          // Make sure we set productName since it's required by the schema
          orderData.productName = data.productName || 'Unknown Product';
          orderData.productDescription = 'Product not found in database';
        }
      } catch (findError) {
        console.error('Error finding product:', findError);
        // If there's an error finding the product, continue with fallback
        orderData.productId = productId;
        orderData.productName = data.productName || 'Error Looking Up Product';
        orderData.productDescription = 'Database error occurred';
      }
    } else {
      // For string IDs: use the fallback product data
      console.log('Using fallback product data for ID:', productId);
      productData = fallbackProducts[productId] || {
        name: data.productName || 'Unknown Product',
        description: 'Product details not available',
        price: data.amount
      };
      
      // Store the string ID and product details
      orderData.productId = productId;
      orderData.productName = productData.name;
      orderData.productDescription = productData.description;
    }
    
    // Insert directly into MongoDB collection to bypass Mongoose validation
    try {
      console.log('Creating order with data:', orderData);
      
      // Add timestamps manually since we're bypassing Mongoose
      orderData.createdAt = new Date();
      orderData.updatedAt = new Date();
      
      // Make sure we have a productName as it's required
      if (!orderData.productName) {
        orderData.productName = data.productName || 'Unknown Product';
      }
      
      // Use direct MongoDB operation with the client's db connection
      const ordersCollection = db.collection('orders');
      const result = await ordersCollection.insertOne(orderData);
      
      // Add the _id to the response
      orderData._id = result.insertedId;
      
      console.log('Order created successfully:', result.insertedId);
      return NextResponse.json(orderData, { status: 201 });
    } catch (saveError: any) {
      console.error('Error saving order document:', saveError);
      throw saveError; // Re-throw the error
    }
  } catch (error: any) {
    // Detailed error logging for debugging
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
      return NextResponse.json({ 
        error: 'Failed to create order: Validation error', 
        details: Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`)
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Failed to create order', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
