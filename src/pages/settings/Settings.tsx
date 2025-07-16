import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Building, CreditCard, Bell, Shield, Globe } from 'lucide-react';
import ProfileSettings from './components/ProfileSettings';
import HotelSettings from './components/HotelSettings';
import PaymentSettings from './components/PaymentSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import SystemSettings from './components/SystemSettings';

/**
 * Settings Page Component
 * Comprehensive settings management for the hotel system
 */
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const settingsTabs = [
    {
      id: 'profile',
      name: 'Profile',
      icon: User,
      description: 'Personal account settings'
    },
    {
      id: 'hotel',
      name: 'Hotel',
      icon: Building,
      description: 'Hotel information and branding'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      description: 'Payment methods and billing'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Email and push notifications'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Password and security settings'
    },
    {
      id: 'system',
      name: 'System',
      icon: Globe,
      description: 'System preferences and integrations'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'hotel':
        return <HotelSettings />;
      case 'payments':
        return <PaymentSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'system':
        return <SystemSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;