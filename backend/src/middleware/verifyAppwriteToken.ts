import { Request, Response, NextFunction } from 'express';
import { Client, Account, Users } from 'node-appwrite';

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
    // Get the Appwrite session token from headers
    const sessionToken = req.headers['x-appwrite-session'];
    
    console.log('Verifying session token:', sessionToken ? 'Token present' : 'No token');
    
    if (!sessionToken) {
      return res.status(401).json({ message: 'No session token provided' });
    }

    try {
      // Get user ID from the session token
      const [userId] = (sessionToken as string).split('.');
      if (!userId) {
        return res.status(401).json({ message: 'Invalid session format' });
      }

      // Verify user exists
      try {
        const user = await users.get(userId);
        console.log('Session verified for user:', user.$id);
        req.userId = user.$id;
        next();
      } catch (error) {
        console.error('User verification error:', error);
        return res.status(401).json({ message: 'Invalid user' });
      }
    } catch (error) {
      console.error('Session verification error:', error);
      if (error instanceof Error) {
        return res.status(401).json({ message: `Invalid session: ${error.message}` });
      }
      return res.status(401).json({ message: 'Invalid session' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 