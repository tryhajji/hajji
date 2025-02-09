import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'agency' | 'umrah_group' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isLoggedIn, userRole } = useAppContext();

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // If no userRole is set yet, redirect to home
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // If no required role is specified, allow access to any authenticated user
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Admin can access everything
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // For non-admin users, check if they have the required role
  if (requiredRole !== userRole) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'agency':
        return <Navigate to="/agency/dashboard" replace />;
      case 'umrah_group':
        return <Navigate to="/umrah-group/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 