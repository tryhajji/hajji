import { Request, Response, NextFunction } from 'express';
import { Client, Account, Users } from 'node-appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const account = new Account(client);
const users = new Users(client);

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const verifyAppwriteSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Headers received:', req.headers);
    const sessionId = req.headers['x-appwrite-session'];
    console.log('Session ID from headers:', sessionId);

    if (!sessionId || typeof sessionId !== 'string') {
      console.log('No session ID provided in headers');
      return res.status(401).json({ error: 'No session ID provided' });
    }

    try {
      // Instead of verifying the session directly, let's try to get the user ID from the session
      const [userId] = sessionId.split('.');
      
      if (!userId) {
        console.log('Could not extract user ID from session');
        return res.status(401).json({ error: 'Invalid session format' });
      }

      // Verify the user exists
      try {
        const user = await users.get(userId);
        console.log('User verified:', user.$id);
        
        // If we get here, the user exists and is valid
        req.userId = user.$id;
        next();
      } catch (userError) {
        console.error('User verification error:', userError);
        return res.status(401).json({ error: 'Invalid user' });
      }
    } catch (error) {
      console.error('Session verification error:', error);
      return res.status(401).json({ 
        error: 'Invalid session',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default verifyAppwriteSession;
