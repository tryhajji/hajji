import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import Package from "../models/package";
import { bookingService, BookingStatus } from '../services/BookingService';
import stripe from '../config/stripe';
import { Types } from 'mongoose';

const router = express.Router();

// Get all user's bookings (both hotel and package bookings)
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const bookings = await Booking.find({ userId: req.userId })
      .populate('hotelId')
      .populate('packageId')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

// Create a new booking
router.post("/create-booking", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log('Creating booking with data:', req.body);
    const { packageId, startDate, endDate, guests, totalAmount, paymentIntentId } = req.body;

    // Verify payment intent first
    console.log('Verifying payment intent:', paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      console.log('Payment intent not succeeded:', paymentIntent.status);
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Verify package exists
    console.log('Verifying package:', packageId);
    const package_data = await Package.findById(packageId);
    if (!package_data) {
      console.log('Package not found:', packageId);
      return res.status(404).json({ message: "Package not found" });
    }

    // Create booking
    console.log('Creating booking object with:', {
      userId: req.userId.toString(),
      packageId,
      checkIn: new Date(startDate),
      checkOut: new Date(endDate),
      numberOfGuests: guests,
      totalCost: totalAmount,
      status: BookingStatus.PAYMENT_COMPLETED,
      bookingType: 'PACKAGE',
      paymentIntentId
    });

    const booking = new Booking({
      userId: req.userId.toString(),
      packageId,
      checkIn: new Date(startDate),
      checkOut: new Date(endDate),
      numberOfGuests: guests,
      totalCost: totalAmount,
      status: BookingStatus.PAYMENT_COMPLETED,
      bookingType: 'PACKAGE',
      paymentIntentId
    });

    console.log('Saving booking to database...');
    await booking.save();
    console.log('Booking saved successfully:', booking._id);

    // Send confirmation
    res.status(201).json({
      success: true,
      booking,
      message: "Booking created successfully"
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ 
      message: "Error creating booking", 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.name : 'Unknown error type'
    });
  }
});

// Confirm payment for a booking
router.post("/confirm-payment", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { bookingId, paymentIntentId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update booking status
      const booking = await bookingService.updateBookingStatus(
        typeof bookingId === 'string' ? bookingId : bookingId.toString(),
        BookingStatus.PAYMENT_COMPLETED,
        req.userId.toString()
      );

      res.json({ success: true, booking });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: "Error confirming payment" });
  }
});

export default router;
