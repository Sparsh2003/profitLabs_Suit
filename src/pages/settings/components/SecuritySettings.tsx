import React, { useState } from 'react';
import { Shield, Key, Smartphone, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';

/**
 * Security Settings Component
 * Password and security configuration
 */
const SecuritySettings: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    loginAttempts: 5,
    requirePasswordChange: false,
    allowMultipleSessions: true
  });

  const [loginHistory] = useState([
    {
      id: '1',
      timestamp: '2024-01-15 09:30:00',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-01-14 18:45:00',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-01-14 09:15:00',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      status: 'success'
    }
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) : value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    console.log('Password change:', passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Security settings update:', securitySettings);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        <p className="text-gray-600">Manage your password and security preferences</p>
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password should be at least 8 characters with uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!passwordForm.currentPassword || !passwordForm.newPassword || 
                       passwordForm.newPassword !== passwordForm.confirmPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Authenticator App</h4>
              <p className="text-sm text-gray-600 mt-1">
                Use an authenticator app to generate secure codes for login
              </p>
              <div className="mt-3">
                {securitySettings.twoFactorEnabled ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                    <button
                      type="button"
                      onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: false }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Disable
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }))}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Enable 2FA
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Preferences */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Preferences</h3>
          
          <form onSubmit={handleSecuritySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <select
                  name="sessionTimeout"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={480}>8 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Expiry (days)
                </label>
                <select
                  name="passwordExpiry"
                  value={securitySettings.passwordExpiry}
                  onChange={handleSecurityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={365}>1 year</option>
                  <option value={0}>Never</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Login Attempts
                </label>
                <select
                  name="loginAttempts"
                  value={securitySettings.loginAttempts}
                  onChange={handleSecurityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 attempts</option>
                  <option value={5}>5 attempts</option>
                  <option value={10}>10 attempts</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requirePasswordChange"
                  checked={securitySettings.requirePasswordChange}
                  onChange={handleSecurityChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Require password change on first login
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allowMultipleSessions"
                  checked={securitySettings.allowMultipleSessions}
                  onChange={handleSecurityChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Allow multiple active sessions
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Security Settings</span>
            </button>
          </form>
        </div>

        {/* Login History */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>
          
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    login.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{login.device}</p>
                    <p className="text-xs text-gray-500">{login.location} • {login.ipAddress}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{new Date(login.timestamp).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{new Date(login.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alert */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">Security Reminder</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Always log out when using shared computers and never share your login credentials with others.
                  If you notice any suspicious activity, change your password immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;