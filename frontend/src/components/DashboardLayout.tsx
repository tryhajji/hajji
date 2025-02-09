import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface SidebarLink {
  to: string;
  icon: string;
  label: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { userRole } = useAppContext();

  const getLinks = (): SidebarLink[] => {
    switch (userRole) {
      case 'admin':
        return [
          { to: '/dashboard', icon: 'fas fa-home', label: 'User Dashboard' },
          { to: '/admin/dashboard', icon: 'fas fa-shield-alt', label: 'Admin Dashboard' },
          { to: '/admin/users', icon: 'fas fa-users', label: 'Users' },
          { to: '/admin/packages', icon: 'fas fa-box', label: 'Packages' },
          { to: '/admin/agencies', icon: 'fas fa-building', label: 'Agencies' },
          { to: '/admin/groups', icon: 'fas fa-user-friends', label: 'Groups' },
          { to: '/admin/analytics', icon: 'fas fa-chart-bar', label: 'Analytics' },
          { to: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
        ];
      case 'agency':
        return [
          { to: '/agency/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
          { to: '/agency/packages', icon: 'fas fa-box', label: 'My Packages' },
          { to: '/agency/bookings', icon: 'fas fa-calendar', label: 'Bookings' },
          { to: '/agency/clients', icon: 'fas fa-users', label: 'Clients' },
          { to: '/agency/reviews', icon: 'fas fa-star', label: 'Reviews' },
          { to: '/agency/settings', icon: 'fas fa-cog', label: 'Settings' }
        ];
      case 'umrah_group':
        return [
          { to: '/umrah-group/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
          { to: '/umrah-group/create', icon: 'fas fa-plus', label: 'Create Group' },
          { to: '/umrah-group/manage', icon: 'fas fa-tasks', label: 'Manage Groups' },
          { to: '/umrah-group/members', icon: 'fas fa-users', label: 'Members' },
          { to: '/umrah-group/schedule', icon: 'fas fa-calendar', label: 'Schedule' },
          { to: '/umrah-group/settings', icon: 'fas fa-cog', label: 'Settings' }
        ];
      default:
        return [
          { to: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
          { to: '/packages', icon: 'fas fa-box', label: 'Browse Packages' },
          { to: '/groups', icon: 'fas fa-users', label: 'Join Groups' },
          { to: '/profile', icon: 'fas fa-user', label: 'My Profile' },
          { to: '/bookings', icon: 'fas fa-calendar', label: 'My Bookings' },
          { to: '/saved', icon: 'fas fa-heart', label: 'Saved Packages' },
          { to: '/guides', icon: 'fas fa-book', label: 'Resources' }
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {(userRole || 'User')?.charAt(0).toUpperCase() + (userRole || 'User')?.slice(1)} Portal
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {links.find(link => link.to === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 