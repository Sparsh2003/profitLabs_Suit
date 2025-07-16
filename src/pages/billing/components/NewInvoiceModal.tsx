import React, { useState } from 'react';
import { X, FileText, User, Plus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createInvoice } from '../../../store/slices/billingSlice';

interface NewInvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * New Invoice Modal Component
 * Form for creating new invoices
 */
const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    bookingId: '',
    guestId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    
    // Company Info
    companyName: 'Hotel ProfitLabs',
    companyAddress: {
      street: '123 Hotel Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001'
    },
    companyContact: {
      phone: '+91 98765 43210',
      email: 'billing@profitlabs.com',
      website: 'www.profitlabs.com'
    },
    companyTax: {
      gstNumber: '27ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F'
    }
  });

  const [lineItems, setLineItems] = useState([
    {
      category: 'room',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 12,
      notes: ''
    }
  ]);

  const categories = [
    { value: 'room', label: 'Room Charges' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'beverage', label: 'Beverages' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'telephone', label: 'Telephone' },
    { value: 'internet', label: 'Internet' },
    { value: 'spa', label: 'Spa Services' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate totals
    if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      const item = updatedItems[index];
      const subtotal = item.quantity * item.unitPrice;
      const taxAmount = subtotal * (item.taxRate / 100);
      updatedItems[index] = {
        ...item,
        subtotal,
        taxAmount,
        total: subtotal + taxAmount
      };
    }
    
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      category: 'other',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 12,
      notes: ''
    }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const calculateSummary = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + itemSubtotal;
    }, 0);
    
    const totalTax = lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemTax = itemSubtotal * (item.taxRate / 100);
      return sum + itemTax;
    }, 0);
    
    const totalAmount = subtotal + totalTax;
    
    return { subtotal, totalTax, totalAmount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const summary = calculateSummary();
    
    // Calculate due date (7 days from invoice date if not specified)
    const dueDate = formData.dueDate || 
      new Date(new Date(formData.invoiceDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const invoiceData = {
      bookingId: formData.bookingId || undefined,
      guestId: formData.guestId,
      invoiceDate: formData.invoiceDate,
      dueDate: dueDate,
      lineItems: lineItems.map(item => ({
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        taxRate: item.taxRate,
        taxAmount: (item.quantity * item.unitPrice) * (item.taxRate / 100),
        total: (item.quantity * item.unitPrice) + ((item.quantity * item.unitPrice) * (item.taxRate / 100)),
        date: new Date().toISOString(),
        notes: item.notes || undefined
      })),
      summary: {
        subtotal: summary.subtotal,
        totalTax: summary.totalTax,
        discounts: 0,
        totalAmount: summary.totalAmount,
        currency: 'INR'
      },
      companyInfo: {
        name: formData.companyName,
        address: formData.companyAddress,
        contact: formData.companyContact,
        taxInfo: formData.companyTax
      },
      status: 'pending',
      paymentStatus: {
        totalPaid: 0,
        outstandingBalance: summary.totalAmount
      }
    };

    try {
      await dispatch(createInvoice(invoiceData) as any);
      onSuccess();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const summary = calculateSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="bookingId"
                    value={formData.bookingId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link to existing booking"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest ID *
                  </label>
                  <input
                    type="text"
                    name="guestId"
                    value={formData.guestId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter guest ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for 7 days from invoice date
                  </p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={formData.companyTax.gstNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyTax: { ...prev.companyTax, gstNumber: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={formData.companyTax.panNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyTax: { ...prev.companyTax, panNumber: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleLineItemChange(index, 'category', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Item description"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => handleLineItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => handleLineItemChange(index, 'notes', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>
                  
                  {/* Item Summary */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({item.taxRate}%):</span>
                      <span>₹{((item.quantity * item.unitPrice) * (item.taxRate / 100)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-1">
                      <span>Total:</span>
                      <span>₹{((item.quantity * item.unitPrice) + ((item.quantity * item.unitPrice) * (item.taxRate / 100))).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">₹{summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tax:</span>
                <span className="text-gray-900">₹{summary.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium border-t pt-2">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-gray-900">₹{summary.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInvoiceModal;