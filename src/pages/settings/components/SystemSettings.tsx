import React, { useState } from 'react';
import { Globe, Database, Wifi, Key, Save, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * System Settings Component
 * System preferences and integrations
 */
const SystemSettings: React.FC = () => {
  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    currency: 'INR',
    language: 'en',
    backupFrequency: 'daily',
    maintenanceMode: false,
    debugMode: false
  });

  const [integrations, setIntegrations] = useState({
    booking: {
      enabled: false,
      apiKey: '',
      webhookUrl: ''
    },
    makemytrip: {
      enabled: false,
      apiKey: '',
      webhookUrl: ''
    },
    stripe: {
      enabled: false,
      publicKey: '',
      secretKey: ''
    },
    razorpay: {
      enabled: true,
      keyId: 'rzp_test_1234567890',
      keySecret: '••••••••••••••••'
    }
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    autoBackup: true,
    backupRetention: 30, // days
    compressionEnabled: true,
    encryptionEnabled: true
  });

  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSystemSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleIntegrationChange = (provider: string, field: string, value: string | boolean) => {
    setIntegrations(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setDatabaseSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('System settings update:', {
      systemSettings,
      integrations,
      databaseSettings
    });
  };

  const testIntegration = (provider: string) => {
    console.log(`Testing ${provider} integration...`);
    // Simulate API test
    setTimeout(() => {
      alert(`${provider} integration test completed`);
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure system preferences and integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General System Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="timezone"
                  value={systemSettings.timezone}
                  onChange={handleSystemChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                name="dateFormat"
                value={systemSettings.dateFormat}
                onChange={handleSystemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                name="timeFormat"
                value={systemSettings.timeFormat}
                onChange={handleSystemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24">24 Hour</option>
                <option value="12">12 Hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <select
                name="currency"
                value={systemSettings.currency}
                onChange={handleSystemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={systemSettings.language}
                onChange={handleSystemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backup Frequency
              </label>
              <select
                name="backupFrequency"
                value={systemSettings.backupFrequency}
                onChange={handleSystemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={systemSettings.maintenanceMode}
                onChange={handleSystemChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable maintenance mode (restricts access to admin users only)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="debugMode"
                checked={systemSettings.debugMode}
                onChange={handleSystemChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable debug mode (shows detailed error messages)
              </span>
            </label>
          </div>
        </div>

        {/* Database Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Database Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backup Retention (Days)
              </label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="backupRetention"
                  value={databaseSettings.backupRetention}
                  onChange={handleDatabaseChange}
                  min="1"
                  max="365"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="autoBackup"
                checked={databaseSettings.autoBackup}
                onChange={handleDatabaseChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable automatic database backups
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="compressionEnabled"
                checked={databaseSettings.compressionEnabled}
                onChange={handleDatabaseChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable backup compression
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="encryptionEnabled"
                checked={databaseSettings.encryptionEnabled}
                onChange={handleDatabaseChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable backup encryption
              </span>
            </label>
          </div>
        </div>

        {/* API Integrations */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">API Integrations</h3>
          
          <div className="space-y-6">
            {/* Booking.com Integration */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Wifi className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Booking.com</h4>
                    <p className="text-sm text-gray-600">Online travel agency integration</p>
                  </div>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={integrations.booking.enabled}
                    onChange={(e) => handleIntegrationChange('booking', 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enabled</span>
                </label>
              </div>
              
              {integrations.booking.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        value={integrations.booking.apiKey}
                        onChange={(e) => handleIntegrationChange('booking', 'apiKey', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter API key"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={integrations.booking.webhookUrl}
                      onChange={(e) => handleIntegrationChange('booking', 'webhookUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://your-webhook-url.com"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => testIntegration('Booking.com')}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Test Connection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Razorpay Integration */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Razorpay</h4>
                    <p className="text-sm text-gray-600">Payment gateway integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={integrations.razorpay.enabled}
                      onChange={(e) => handleIntegrationChange('razorpay', 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enabled</span>
                  </label>
                </div>
              </div>
              
              {integrations.razorpay.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key ID
                    </label>
                    <input
                      type="text"
                      value={integrations.razorpay.keyId}
                      onChange={(e) => handleIntegrationChange('razorpay', 'keyId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Secret
                    </label>
                    <input
                      type="password"
                      value={integrations.razorpay.keySecret}
                      onChange={(e) => handleIntegrationChange('razorpay', 'keySecret', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => testIntegration('Razorpay')}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Test Connection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-900">Database</span>
              </div>
              <p className="text-xs text-green-700 mt-1">Connected and operational</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-900">API Services</span>
              </div>
              <p className="text-xs text-green-700 mt-1">All services running</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-900">Backup Status</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">Last backup: 2 hours ago</p>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Changes to system settings may affect all users. Please ensure you understand the implications before making changes.
                  It's recommended to create a backup before modifying critical settings.
                </p>
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

export default SystemSettings;