import React from 'react';
import { format } from 'date-fns';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface InvoiceListProps {
  invoices: any[];
  onInvoiceSelect: (invoice: any) => void;
  selectedInvoice: any;
  searchTerm: string;
}

/**
 * Invoice List Component
 * Displays list of invoices with search and selection
 */
const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onInvoiceSelect, selectedInvoice, searchTerm }) => {
  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => {
    const guestName = invoice.guest.name.toLowerCase();
    const invoiceNumber = invoice.invoiceNumber.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return guestName.includes(search) || invoiceNumber.includes(search);
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'partially_paid':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {filteredInvoices.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No invoices found matching your search.' : 'No invoices found.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              onClick={() => onInvoiceSelect(invoice)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedInvoice?.id === invoice.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">{invoice.guest.name}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Total: </span>
                      <span className="font-medium text-gray-900">₹{invoice.summary.totalAmount.toLocaleString()}</span>
                    </div>
                    {invoice.paymentStatus.outstandingBalance > 0 && (
                      <div className="text-xs text-red-600">
                        Outstanding: ₹{invoice.paymentStatus.outstandingBalance.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;