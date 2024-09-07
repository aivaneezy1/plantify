// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: "2024-06-20",
});

export const POST = async (req: NextRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { amount } = await req.json(); // amount in euros

    
      console.log('Amount:', amount);
       console.log("API", process.env.STRIPE_PRIVATE_KEY)
      // Convert amount to a number to avoid potential issues
      const totalAmount = Number(amount);

      if (typeof(amount) != 'number' || totalAmount <= 0) {
        return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Bits Purchase',
              },
              unit_amount: amount * 100, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/`,
        cancel_url: `http://localhost:3000/`,
      });

      return NextResponse.json({ sessionId: session.id }, { status: 200 });
  
    } catch (error) {
      console.error(error); // Log the error for debugging
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  } else {
      return NextResponse.json({ message: 'Method is not allowed :(' }, { status: 400 });
  }
};
