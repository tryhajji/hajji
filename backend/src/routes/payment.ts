import express, { Request, Response } from 'express';
import stripe from '../config/stripe';
import verifyAppwriteSession from '../middleware/auth';
import cors from 'cors';

const router = express.Router();

// Configure CORS for the payment routes
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-appwrite-session']
};

router.use(cors(corsOptions));

// Add OPTIONS handler for CORS preflight
router.options('/create-payment-intent', (req, res) => {
  res.sendStatus(200);
});

router.post('/create-payment-intent', verifyAppwriteSession, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('Payment intent request received:', {
      body: req.body,
      userId: req.user.uid,
      headers: req.headers
    });
    
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount) {
      console.log('No amount provided in request');
      return res.status(400).json({ error: 'Amount is required' });
    }

    console.log('Creating Stripe payment intent with:', {
      amount,
      currency,
      userId: req.user.uid,
      metadata
    });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.uid,
        ...metadata
      }
    });

    console.log('Payment intent created successfully:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 