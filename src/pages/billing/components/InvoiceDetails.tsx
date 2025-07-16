import React from 'react';
import { format } from 'date-fns';
import { FileText, User, Calendar, CreditCard, Download, Plus, Eye } from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: any;
}

/**
 * Invoice Details Component
 * Displays detailed invoice information and actions
 */
const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Select an invoice to view details</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Invoice Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {invoice.invoiceNumber}
        </h2>
        <div className="mt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
            {invoice.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Guest Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Guest Information</h3>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900">{invoice.guest.name}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900">{invoice.guest.email}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900">
              {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Invoice Summary</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span className="text-gray-900">₹{invoice.summary.subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Tax:</span>
            <span className="text-gray-900">₹{invoice.summary.totalTax.toLocaleString()}</span>
          </div>
          
          {invoice.summary.discounts > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Discounts:</span>
              <span className="text-red-600">-₹{invoice.summary.discounts.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-base font-medium border-t pt-2">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">₹{invoice.summary.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Payment Status</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Paid:</span>
            <span className="text-green-600">₹{invoice.paymentStatus.totalPaid.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Outstanding:</span>
            <span className={`${invoice.paymentStatus.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{invoice.paymentStatus.outstandingBalance.toLocaleString()}
            </span>
          </div>
          
          {invoice.paymentStatus.lastPaymentDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Payment:</span>
              <span className="text-gray-900">
                {format(new Date(invoice.paymentStatus.lastPaymentDate), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Line Items Preview */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
          Line Items ({invoice.lineItems.length})
        </h3>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {invoice.lineItems.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.description}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} × ₹{item.unitPrice} = ₹{item.subtotal}
                </p>
              </div>
              <span className="text-gray-900">₹{item.total.toLocaleString()}</span>
            </div>
          ))}
          {invoice.lineItems.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              +{invoice.lineItems.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Recent Payments ({invoice.payments.length})
          </h3>
          
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {invoice.payments.slice(0, 2).map((payment: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {payment.method} • {format(new Date(payment.receivedAt), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>View Full Invoice</span>
        </button>
        
        {invoice.paymentStatus.outstandingBalance > 0 && (
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Payment</span>
          </button>
        )}
        
        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;