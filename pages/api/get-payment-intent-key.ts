import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Match your Stripe SDK version
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: 'Failed to create client secret' });
  }
}