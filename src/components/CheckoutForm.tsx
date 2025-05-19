'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { loadScript } from '~/lib/utils';

interface CheckoutFormProps {
  productId: string;
  productName: string;
  productPrice: number;
}

export function CheckoutForm({ productId, productName, productPrice }: CheckoutFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.mobile) {
        toast.error('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Regular expression for mobile number (10 digits)
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobile)) {
        toast.error('Please enter a valid 10-digit mobile number');
        setIsLoading(false);
        return;
      }

      // 1. Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // 2. Create initial order in our database
      const createOrderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          product: productId,  // This could be a MongoDB ObjectId or a string ID like '1', '2', etc.
          productId: productId, // Explicitly include this as a fallback
          productName: productName, // Include the product name directly
          amount: productPrice,
          orderId: orderData.orderId,
          // Include additional debug info
          productType: typeof productId === 'string' && (productId === '1' || productId === '2' || productId === '3') ? 'fallback' : 'regular',
        }),
      });

      if (!createOrderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const dbOrder = await createOrderResponse.json();

      // 3. Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        toast.error('Razorpay SDK failed to load. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Debug the order data received from the server
      console.log('Order data received:', orderData);

      // Get Razorpay key from environment variable or use a fallback for development
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Oy62IkchWuGtwR'; // Provide fallback key
      
      // 4. Initialize Razorpay options
      const options = {
        key: razorpayKey,
        amount: orderData.amount, // Amount should already be in paisa from the API
        currency: orderData.currency || 'INR',
        name: 'Digital Product Store',
        description: `Payment for ${productName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 5. Verify payment and update order
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                orderDbId: dbOrder._id,
                productId: productId, // Add productId to the verification request
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            // 6. Redirect to success page with productId as fallback
            router.push(`/success?orderId=${dbOrder._id}&productId=${productId}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#3399cc',
        },
      };

      // 7. Initialize Razorpay with error handling
      try {
        console.log('Initializing Razorpay with options:', JSON.stringify(options, null, 2));
        const paymentObject = new (window as any).Razorpay(options);
        
        // Set up event handlers before opening
        paymentObject.on('payment.failed', function (response: any) {
          toast.error('Payment failed. Please try again.');
          console.error('Payment failed:', response.error);
        });
        
        // Open the payment dialog
        paymentObject.open();
      } catch (razorpayError) {
        console.error('Razorpay initialization error:', razorpayError);
        toast.error('Payment gateway initialization failed. Please check console for details.');
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error('Checkout error:', error);
      // Provide more specific error messages based on where the failure occurred
      if (error.message === 'Failed to create payment order') {
        toast.error('Payment initialization failed. Please check your product selection.');
      } else if (error.message === 'Failed to create order') {
        toast.error('Order creation failed. Please check your information and try again.');
      } else if (error.message === 'Failed to load Razorpay SDK') {
        toast.error('Payment gateway failed to load. Please check your internet connection.');
      } else {
        toast.error(`Error: ${error.message || 'Something went wrong. Please try again later.'}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-green-300 to-blue-500 rounded-full opacity-20 blur-xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Purchase Now</h2>
        
        <div className="space-y-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-700 dark:text-blue-300 font-medium">Your Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border-blue-200 dark:border-blue-800 focus:border-green-400 focus:ring-green-400 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-700 dark:text-blue-300 font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-blue-200 dark:border-blue-800 focus:border-green-400 focus:ring-green-400 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-blue-700 dark:text-blue-300 font-medium">Mobile Number</Label>
            <Input
              id="mobile"
              name="mobile"
              placeholder="Enter your 10-digit mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="border-blue-200 dark:border-blue-800 focus:border-green-400 focus:ring-green-400 transition-all duration-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Pay ₹{productPrice}
              </span>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-blue-500 dark:text-blue-400 mt-4">
          By clicking Pay, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </form>
  );
}
