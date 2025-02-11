import { Document } from 'mongoose';

export interface UserType extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface HotelBookingType {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  userId: string;
  totalCost: number;
}

export interface HotelType extends Document {
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: HotelBookingType[];
}

export interface HotelSearchResponse {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface BookingType extends Document {
  userId: string;
  hotelId?: string;
  packageId?: string;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalCost: number;
  status: string;
  paymentIntentId?: string;
  bookingType: 'HOTEL' | 'PACKAGE';
  createdAt: Date;
  updatedAt: Date;
} 