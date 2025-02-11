import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from '../services/auth.service';
import { UserType } from '../shared/types';
import { Client, Account } from 'node-appwrite';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize Appwrite client
const appwriteClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
  .setProject(process.env.APPWRITE_PROJECT_ID || '');

const account = new Account(appwriteClient);

async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('Invalid Google token');
  }
}

interface AuthRequest extends Omit<Request, 'user' | 'userId' | 'userRole'> {
  user?: UserType;
  userId?: string;
  userRole?: string;
}

export class AuthController {
  constructor(private authService: AuthService) {}

  async googleLogin(req: Request, res: Response) {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
      }

      // Verify Google token and get user info
      const googleUser = await verifyGoogleToken(credential);
      
      if (!googleUser) {
        return res.status(401).json({ message: 'Invalid Google credentials' });
      }

      if (!googleUser.email) {
        return res.status(400).json({ message: 'Email is required from Google account' });
      }

      // Handle login/registration
      const { user, token } = await AuthService.handleGoogleLogin(googleUser);

      if (!user || !token) {
        return res.status(500).json({ message: 'Failed to create or retrieve user' });
      }

      // Set HTTP-only cookie with JWT
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Send user data (but not the token) to frontend
      res.json({ user });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message || 'Authentication failed' });
      } else {
        res.status(500).json({ message: 'Authentication failed' });
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('auth_token');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Error during logout' });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
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
          role: req.userRole || 'user'
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 