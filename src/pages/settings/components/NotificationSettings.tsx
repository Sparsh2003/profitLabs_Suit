import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';

/**
 * Notification Settings Component
 * Email and push notification preferences
 */
const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    newBookings: true,
    checkInReminders: true,
    checkOutNotifications: true,
    paymentReceived: true,
    lowInventory: false,
    maintenanceAlerts: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [pushNotifications, setPushNotifications] = useState({
    newBookings: true,
    checkInReminders: true,
    checkOutNotifications: false,
    paymentReceived: false,
    lowInventory: true,
    maintenanceAlerts: true,
    systemAlerts: true
  });

  const [generalSettings, setGeneralSettings] = useState({
    emailAddress: 'user@profitlabs.com',
    phoneNumber: '+91 98765 43210',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'immediate' // immediate, hourly, daily
  });

  const handleEmailChange = (key: string) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handlePushChange = (key: string) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setGeneralSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev] as any,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setGeneralSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Notification settings update:', {
      emailNotifications,
      pushNotifications,
      generalSettings
    });
  };

  const notificationCategories = [
    {
      title: 'Bookings & Reservations',
      items: [
        { key: 'newBookings', label: 'New bookings received', description: 'Get notified when new reservations are made' },
        { key: 'checkInReminders', label: 'Check-in reminders', description: 'Reminders for upcoming check-ins' },
        { key: 'checkOutNotifications', label: 'Check-out notifications', description: 'Notifications when guests check out' }
      ]
    },
    {
      title: 'Payments & Billing',
      items: [
        { key: 'paymentReceived', label: 'Payment received', description: 'Notifications when payments are processed' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { key: 'lowInventory', label: 'Low inventory alerts', description: 'Alerts when POS items are running low' },
        { key: 'maintenanceAlerts', label: 'Maintenance alerts', description: 'Notifications for room maintenance issues' }
      ]
    },
    {
      title: 'Reports',
      items: [
        { key: 'dailyReports', label: 'Daily reports', description: 'Daily summary reports' },
        { key: 'weeklyReports', label: 'Weekly reports', description: 'Weekly performance reports' },
        { key: 'monthlyReports', label: 'Monthly reports', description: 'Monthly analytics reports' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
        <p className="text-gray-600">Manage your email and push notification preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="emailAddress"
                  value={generalSettings.emailAddress}
                  onChange={handleGeneralChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={generalSettings.phoneNumber}
                  onChange={handleGeneralChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Frequency
              </label>
              <select
                name="frequency"
                value={generalSettings.frequency}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly digest</option>
                <option value="daily">Daily digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quiet Hours</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="quietHours.enabled"
                checked={generalSettings.quietHours.enabled}
                onChange={handleGeneralChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable quiet hours (no notifications during specified times)
              </span>
            </label>

            {generalSettings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="quietHours.start"
                    value={generalSettings.quietHours.start}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="quietHours.end"
                    value={generalSettings.quietHours.end}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification Categories */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
          
          {notificationCategories.map((category) => (
            <div key={category.title} className="mb-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">{category.title}</h4>
              
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900">{item.label}</h5>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={emailNotifications[item.key as keyof typeof emailNotifications]}
                            onChange={() => handleEmailChange(item.key)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-1 text-xs text-gray-600">Email</span>
                        </label>
                      </div>
                      
                      {item.key !== 'dailyReports' && item.key !== 'weeklyReports' && item.key !== 'monthlyReports' && (
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-gray-400" />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={pushNotifications[item.key as keyof typeof pushNotifications] || false}
                              onChange={() => handlePushChange(item.key)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-1 text-xs text-gray-600">Push</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System Notifications */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900">System alerts</h5>
                <p className="text-sm text-gray-600 mt-1">Critical system updates and maintenance notifications</p>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={pushNotifications.systemAlerts}
                      onChange={() => handlePushChange('systemAlerts')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-1 text-xs text-gray-600">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;