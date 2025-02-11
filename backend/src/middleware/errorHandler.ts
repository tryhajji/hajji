import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Rate limit error handling
  if (err.status === 429) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests. Please try again later.',
      retryAfter: err.headers['Retry-After']
    });
  }

  // Handle other errors
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'An unexpected error occurred'
  });
}; 