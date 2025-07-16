import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Save, Shield } from 'lucide-react';

/**
 * Payment Settings Component
 * Payment methods and billing configuration
 */
const PaymentSettings: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      isDefault: true,
      expiryDate: '12/25'
    },
    {
      id: '2',
      type: 'bank',
      name: 'HDFC Bank Account',
      isDefault: false,
      accountNumber: '****1234'
    }
  ]);

  const [billingSettings, setBillingSettings] = useState({
    currency: 'INR',
    taxRate: 12,
    invoicePrefix: 'INV',
    paymentTerms: 7,
    latePaymentFee: 5,
    autoGenerateInvoice: true,
    sendPaymentReminders: true
  });

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBillingSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment settings update:', { paymentMethods, billingSettings });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
        <p className="text-gray-600">Manage payment methods and billing configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
            <button
              type="button"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {method.expiryDate && <span>Expires {method.expiryDate}</span>}
                        {method.accountNumber && <span>Account {method.accountNumber}</span>}
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Configuration */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <select
                name="currency"
                value={billingSettings.currency}
                onChange={handleBillingChange}
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
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={billingSettings.taxRate}
                onChange={handleBillingChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Prefix
              </label>
              <input
                type="text"
                name="invoicePrefix"
                value={billingSettings.invoicePrefix}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., INV, BILL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms (Days)
              </label>
              <input
                type="number"
                name="paymentTerms"
                value={billingSettings.paymentTerms}
                onChange={handleBillingChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Late Payment Fee (%)
              </label>
              <input
                type="number"
                name="latePaymentFee"
                value={billingSettings.latePaymentFee}
                onChange={handleBillingChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Automation</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="autoGenerateInvoice"
                checked={billingSettings.autoGenerateInvoice}
                onChange={handleBillingChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Automatically generate invoices on checkout
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="sendPaymentReminders"
                checked={billingSettings.sendPaymentReminders}
                onChange={handleBillingChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Send payment reminders for overdue invoices
              </span>
            </label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  All payment information is encrypted and stored securely. We never store complete card numbers or sensitive payment data on our servers.
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

export default PaymentSettings;