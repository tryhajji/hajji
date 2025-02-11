import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import paymentRoutes from "./routes/payment";
import packagesRoutes from "./routes/packages";
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { createServer } from 'http';
import { initializeSocket } from './config/socket';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/hajji')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Add MongoDB connection monitoring
mongoose.connection.on('error', (error: Error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  // Log database name and collections
  const db = mongoose.connection.db;
  if (db) {
    db.listCollections().toArray().then((collections) => {
      console.log('Available collections:', collections.map(c => c.name));
    }).catch((error: Error) => {
      console.error('Error listing collections:', error);
    });
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res) => {
    res.status(429).send('Too many requests from this IP, please try again after 15 minutes');
  }
});

// Create specific limiters for different routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  handler: (req, res) => {
    res.status(429).send('Too many login attempts, please try again after 15 minutes');
  }
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  handler: (req, res) => {
    res.status(429).send('Too many payment attempts, please try again later');
  }
});

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
    "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
    "style-src * 'unsafe-inline' data:; " +
    "style-src-elem * 'unsafe-inline' data:; " +
    "font-src * data:; " +
    "img-src * data: blob:; " +
    "frame-src *; " +
    "connect-src * data: blob: ws: wss:; " +
    "worker-src * 'unsafe-inline' 'unsafe-eval' blob:; " +
    "media-src *; " +
    "object-src 'none';"
  );
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'x-appwrite-session',
      'Origin',
      'X-Requested-With',
      'Accept'
    ]
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Apply the rate limiter to all routes
app.use(limiter);

// Apply specific limiters to sensitive routes
app.use("/api/auth/login", authLimiter);  // Stricter limit for login attempts
app.use("/api/auth/register", authLimiter); // Stricter limit for registration
app.use("/api/payment", paymentLimiter);   // Strict limits for payment endpoints

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/packages", packagesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: 'Hajji API is running' });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Add error handler after all routes
app.use(errorHandler);

// Ensure PORT is a number and provide a default
const DEFAULT_PORT = 8000;
const PORT: number = parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10);

const startServer = () => {
  let currentPort = PORT;
  
  const attemptListen = (port: number) => {
    httpServer.listen(port)
      .on('listening', () => {
        console.log(`Server is running on port ${port}`);
      })
      .on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          httpServer.close();
          attemptListen(port + 1);
        } else {
          console.error('Error starting server:', error);
        }
      });
  };

  attemptListen(currentPort);
};

startServer();
