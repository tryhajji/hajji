import User from '../models/user';
import jwt from 'jsonwebtoken';
import { Document, Types } from 'mongoose';

interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  avatar?: string;
}

export class AuthService {
  private static readonly JWT_EXPIRY = '7d'; // Token expires in 7 days

  static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: this.JWT_EXPIRY }
    );
  }

  static async handleGoogleLogin(googleUser: any) {
    try {
      // Find existing user or create new one
      let user = await User.findOne({ email: googleUser.email }) as UserDocument;
      
      if (!user) {
        user = new User({
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          googleId: googleUser.sub,
          avatar: googleUser.picture
        }) as UserDocument;
        await user.save();
      }

      // Generate JWT token
      const token = this.generateToken(user._id.toString());
      
      return {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar
        },
        token
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
} 