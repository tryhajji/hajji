import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const getDisplayName = () => {
    if (!user) {
      return 'Profile';
    }

    if (user.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    
    // Fallback to email if name is not available
    if (user.email) {
      const username = user.email.split('@')[0];
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    return 'Profile';
  };

  const navItems = [
    { 
      path: '/agencies', 
      label: 'Travel Agencies', 
      icon: <i className="fas fa-building"></i>
    },
    { 
      path: '/groups', 
      label: 'Umrah Groups', 
      icon: <i className="fas fa-users"></i>
    },
    { 
      path: '/packages/umrah', 
      label: 'Umrah Packages', 
      icon: <i className="fas fa-kaaba"></i>
    },
    { 
      path: '/packages/hajj', 
      label: 'Hajj Packages', 
      icon: <i className="fas fa-mosque"></i>
    },
    { 
      path: '/guides', 
      label: 'Pilgrimage Guides', 
      icon: <i className="fas fa-book-open"></i>
    },
    { 
      path: '/resources', 
      label: 'Resources', 
      icon: <i className="fas fa-info-circle"></i>
    }
  ];

  return (
    <header className="bg-primary border-b border-primary-dark">
      <nav className="h-[64px] border-b border-primary-dark">
        <div className="max-w-[1536px] mx-auto h-full px-6">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section - Left */}
            <div className="flex-none w-40">
              <Link to="/" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight hover:opacity-90">
                Hajji
              </Link>
            </div>

            {/* Primary Navigation - Center */}
            <div className="flex items-center justify-center px-4">
              <div className="flex items-center space-x-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative flex items-center text-sm font-medium
                      transition-all duration-200 group
                      ${isActive(item.path) 
                        ? 'text-white' 
                        : 'text-white/90 hover:text-white'}
                    `}
                  >
                    <span className="flex items-center gap-2 py-2 px-3 rounded-lg group-hover:bg-primary-light/30">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    
                    {/* Active/Hover indicator line */}
                    <div className={`
                      absolute bottom-0 left-0 w-full h-0.5 bg-white 
                      transform scale-x-0 transition-transform duration-200
                      ${isActive(item.path) ? 'scale-x-100' : 'group-hover:scale-x-100'}
                    `} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Navigation */}
            <div className="flex-none flex items-center justify-end space-x-2">
              {!!user ? (
                <div className="flex items-center h-full space-x-2">
                  {/* Admin Menu */}
                  {user?.role === 'admin' && (
                    <div className="relative h-full" ref={adminMenuRef}>
                      <button
                        onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                        className="relative flex items-center h-full px-3 text-sm font-medium text-white group transition-all duration-200"
                      >
                        <span className="flex items-center gap-2 py-2 px-3 rounded-lg group-hover:bg-primary-light/30">
                          <i className="fas fa-shield-alt"></i>
                          <span>Admin</span>
                          <i className={`fas fa-chevron-${isAdminMenuOpen ? 'up' : 'down'} text-sm ml-1`}></i>
                        </span>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                      </button>
                      
                      {isAdminMenuOpen && (
                        <div className="absolute right-0 mt-0 w-48 bg-white rounded-b-lg shadow-lg py-1 z-50">
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                          >
                            <i className="fas fa-chart-line w-6"></i>
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                          >
                            <i className="fas fa-users w-6"></i>
                            Users
                          </Link>
                          <Link
                            to="/admin/packages"
                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                          >
                            <i className="fas fa-box w-6"></i>
                            Packages
                          </Link>
                          <Link
                            to="/admin/agencies"
                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                          >
                            <i className="fas fa-building w-6"></i>
                            Agencies
                          </Link>
                          <Link
                            to="/admin/analytics"
                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                          >
                            <i className="fas fa-chart-bar w-6"></i>
                            Analytics
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profile Menu */}
                  <div className="relative h-full" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="relative flex items-center h-full px-3 text-sm font-medium text-white group transition-all duration-200"
                    >
                      <span className="flex items-center gap-2 py-2 px-3 rounded-lg group-hover:bg-primary-light/30">
                        <i className="fas fa-user-circle"></i>
                        <span>{getDisplayName()}</span>
                        <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'} text-sm ml-1`}></i>
                      </span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                    </button>
                    
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-0 w-48 bg-white rounded-b-lg shadow-lg py-1 z-50">
                        <Link
                          to="/dashboard"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <i className="fas fa-columns w-6"></i>
                          Dashboard
                        </Link>
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-user w-6"></i>
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
                        >
                          <i className="fas fa-sign-out-alt w-6"></i>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/register" 
                    className="relative text-sm font-medium text-white group transition-all duration-200"
                  >
                    <span className="flex items-center px-4 py-2 rounded-lg group-hover:bg-primary-light/30">
                      Register
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                  <Link 
                    to="/sign-in" 
                    className="text-sm font-medium group"
                  >
                    <span className="flex items-center px-4 py-2 bg-white text-primary rounded-lg group-hover:bg-gray-50">
                      Sign In
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar; 