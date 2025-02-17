import { Request, Response, NextFunction } from 'express';
import { Client, Account, Users } from 'node-appwrite';
import { auth } from 'firebase-admin';
import { db } from '../config/firebase';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const users = new Users(client);

// Middleware to verify Appwrite session
export const verifyAppwriteToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth().verifyIdToken(token);
    
    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Set user information in the request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData?.role || 'client',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || ''
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 