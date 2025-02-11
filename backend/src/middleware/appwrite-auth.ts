import { Request, Response, NextFunction } from 'express';
import { Client, Account } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '');

const account = new Account(client);

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const verifyAppwriteToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jwt = req.headers.authorization?.split(' ')[1];
    
    if (!jwt) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the JWT with Appwrite
    const response = await account.get();
    
    if (!response) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add user info to request
    req.userId = response.$id;
    
    // Get user's role from Appwrite teams
    const teams = await account.listMemberships();
    let role = 'client';
    
    for (const membership of teams.memberships) {
      if (membership.teamId === 'admin') {
        role = 'admin';
        break;
      } else if (membership.teamId === 'agency') {
        role = 'agency';
        break;
      } else if (membership.teamId === 'umrah_group') {
        role = 'umrah_group';
        break;
      }
    }
    
    req.userRole = role;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 