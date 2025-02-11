import express, { Request, Response } from "express";
import { verifyAppwriteToken } from '../middleware/verifyAppwriteToken';
import { Client, Account } from 'node-appwrite';

const router = express.Router();

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const account = new Account(client);

// Get current user
router.get('/me', verifyAppwriteToken, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user details from Appwrite
    const user = await account.get();
    
    return res.status(200).json({
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
        prefs: user.prefs
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Validate session
router.get("/validate-session", verifyAppwriteToken, (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
});

// Note: Login/Register are handled on the frontend with Appwrite SDK
// These routes are not needed in the backend as Appwrite handles authentication

export default router;
