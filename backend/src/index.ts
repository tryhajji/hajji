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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/hajji')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api", paymentRoutes);
app.use("/api/packages", packagesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: 'Hajji API is running' });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Ensure PORT is a number and provide a default
const DEFAULT_PORT = 8000;
const PORT: number = parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10);

const startServer = () => {
  let currentPort = PORT;
  
  const attemptListen = (port: number) => {
    const server = app.listen(port)
      .on('listening', () => {
        console.log(`Server is running on port ${port}`);
      })
      .on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          server.close();
          attemptListen(port + 1);
        } else {
          console.error('Error starting server:', error);
        }
      });
  };

  attemptListen(currentPort);
};

startServer();
