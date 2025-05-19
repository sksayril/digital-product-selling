import mongoose, { Document, Schema } from 'mongoose';
import type { IProduct } from './product';

export interface IOrder extends Document {
  name: string;
  email: string;
  mobile: string;
  product?: mongoose.Types.ObjectId | IProduct; // Make optional since we might use productId instead
  productId?: string;                         // For fallback products with string IDs
  productName?: string;                       // Store product name directly for fallback products
  productDescription?: string;                // Store product description for dashboard
  amount: number;
  paymentId: string;
  orderId: string;
  isPaid: boolean;
  purchaseDate?: Date;                        // Explicit purchase date for admin dashboard
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    // IMPORTANT: At least one of these product identification fields must be present,
    // but we'll handle that in our application logic, not in the schema
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    productId: { type: String }, // For fallback products with string IDs 
    productName: { type: String, required: true }, // Always require the product name for display
    productDescription: { type: String }, // For admin dashboard display
    amount: { type: Number, required: true },
    paymentId: { type: String },
    orderId: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    purchaseDate: { type: Date, default: Date.now }, // Explicit purchase date for admin dashboard
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
