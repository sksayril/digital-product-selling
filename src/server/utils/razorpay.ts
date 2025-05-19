import Razorpay from 'razorpay';
import { env } from '~/env';
import crypto from 'crypto';

const razorpayKeyId = env.RAZORPAY_KEY_ID;
const razorpayKeySecret = env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined');
}

// Initialize Razorpay with your key ID and secret
const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export const createOrder = async (amount: number): Promise<{ id: string }> => {
  try {
    const options = {
      amount: amount * 100, // convert to paisa (Razorpay expects amount in the smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { id: order.id };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

// Verify Razorpay payment signature
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

export default razorpay;
