import { UserType } from '../../shared/types';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      user?: UserType;
    }
  }
} 