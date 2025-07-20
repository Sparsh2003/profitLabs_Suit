import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Calendar, Bed, Users, ShoppingCart, FileText, BarChart3, Settings, Hotel } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Sidebar Component
 * Navigation sidebar with role-based menu items
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { hasRole, state } = useAuth();

  // Navigation items with permissions
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Reservations',
      href: '/reservations',
      icon: Calendar,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Rooms',
      href: '/rooms',
      icon: Bed,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Guests',
      href: '/guests',
      icon: Users,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'POS',
      href: '/pos',
      icon: ShoppingCart,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Billing',
      href: '/billing',
      icon: FileText,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  // Filter navigation items based on user roles
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(state.user?.role || '')
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <Hotel className="h-8 w-8" />
            <span className="text-xl font-bold">ProfitLabs Suite</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-blue-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;