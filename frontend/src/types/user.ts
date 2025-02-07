export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'agency' | 'umrah_group';
  createdAt: string;
  updatedAt: string;
} 