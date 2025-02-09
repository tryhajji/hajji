import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { getCurrentUser, logout } from '../appwrite';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, userRole, handleSignOut } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      handleSignOut();
      setIsProfileOpen(false);
      navigate('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const getDashboardLink = () => {
    // Always return /dashboard for consistency
    return '/dashboard';
  };

  return (
    <header className="bg-primary">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            Hajji
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <div className="flex items-center space-x-6">
                {/* Dashboard Link */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 text-white hover:opacity-90"
                >
                  <i className="fas fa-columns"></i>
                  <span>Dashboard</span>
                </Link>

                {/* Admin Menu */}
                {userRole === 'admin' && (
                  <div className="relative" ref={adminMenuRef}>
                    <button
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className="flex items-center space-x-2 text-white hover:opacity-90"
                    >
                      <i className="fas fa-shield-alt"></i>
                      <span>Admin</span>
                      <i className={`fas fa-chevron-${isAdminMenuOpen ? 'up' : 'down'} text-sm`}></i>
                    </button>
                    
                    {isAdminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-chart-line w-6"></i>
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-users w-6"></i>
                          Users
                        </Link>
                        <Link
                          to="/admin/packages"
                          className="block px-4 py-2 text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-box w-6"></i>
                          Packages
                        </Link>
                        <Link
                          to="/admin/agencies"
                          className="block px-4 py-2 text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-building w-6"></i>
                          Agencies
                        </Link>
                        <Link
                          to="/admin/analytics"
                          className="block px-4 py-2 text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-chart-bar w-6"></i>
                          Analytics
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-white hover:opacity-90"
                  >
                    <i className="fas fa-user-circle"></i>
                    <span>Profile</span>
                    <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'} text-sm`}></i>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-emerald-50"
                      >
                        <i className="fas fa-user w-6"></i>
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-emerald-50"
                      >
                        <i className="fas fa-sign-out-alt w-6"></i>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/register" className="text-white hover:opacity-90">
                  Register
                </Link>
                <Link to="/sign-in" className="px-4 py-2 bg-white text-primary rounded-md hover:bg-opacity-90">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex space-x-8 py-4 text-white">
          <Link to="/agencies" className="flex items-center space-x-2 hover:opacity-90">
            <i className="fas fa-building"></i>
            <span>Travel Agencies</span>
          </Link>
          <Link to="/groups" className="flex items-center space-x-2 hover:opacity-90">
            <i className="fas fa-users"></i>
            <span>Umrah Groups</span>
          </Link>
          <Link to="/packages/umrah" className="flex items-center space-x-2 hover:opacity-90">
            <i className="fas fa-kaaba"></i>
            <span>Umrah Packages</span>
          </Link>
          <Link to="/packages/hajj" className="flex items-center space-x-2 hover:opacity-90">
            <i className="fas fa-mosque"></i>
            <span>Hajj Packages</span>
          </Link>
          <Link to="/guides" className="flex items-center space-x-2 hover:opacity-90">
            <i className="fas fa-book-open"></i>
            <span>Pilgrimage Guides</span>
          </Link>
          <Link to="/resources" className="flex items-center space-x-2 hover:opacity-90">
            <i className="fas fa-info-circle"></i>
            <span>Resources</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 