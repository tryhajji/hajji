import express, { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import Booking from "../models/booking";
import Package from "../models/package";
import Stripe from "stripe";
import { cacheMiddleware } from '../middleware/cache';
import { clearCache } from '../middleware/cache';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();

// Mock data for now - you'll want to replace this with your database
const packages = [
  {
    id: "standard-umrah",
    title: "Standard Umrah Package",
    type: "umrah",
    image: "https://example.com/umrah-package.jpg",
    rating: 4.5,
    reviews: 128,
    price: 285,
    cleaning_fee: 50,
    service_fee: 30
  },
  {
    id: "deluxe-umrah",
    title: "Deluxe Umrah Package",
    type: "umrah",
    image: "https://example.com/deluxe-umrah.jpg",
    rating: 4.8,
    reviews: 256,
    price: 485,
    cleaning_fee: 75,
    service_fee: 45
  }
];

// Get package by ID
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Package ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const package_data = await Package.findById(req.params.id);

      if (!package_data) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.json(package_data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching package" });
    }
  }
);

// Create booking after successful payment
router.post(
  "/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { paymentIntentId, packageId, startDate, endDate, guests, totalAmount } = req.body;

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not successful' });
      }

      // Verify package exists
      const package_data = await Package.findById(packageId);
      if (!package_data) {
        return res.status(404).json({ message: 'Package not found' });
      }

      // Create booking
      const booking = new Booking({
        userId: req.userId,
        packageId,
        paymentIntentId,
        startDate,
        endDate,
        guests,
        totalAmount,
      });

      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Error creating booking' });
    }
  }
);

// Get user's bookings
router.get(
  "/bookings/my",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const bookings = await Booking.find({ userId: req.userId })
        .populate('packageId')  // Populate package details
        .sort({ bookingDate: -1 }); // Most recent first

      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  }
);

// Get all packages
router.get('/', cacheMiddleware, async (req: Request, res: Response) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages' });
  }
});

// Create new package
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const newPackage = await Package.create(req.body);
    // Clear the packages cache
    await clearCache('/api/packages*');
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package' });
  }
});

// Similar for update and delete routes
// ... rest of your routes

export default router; 