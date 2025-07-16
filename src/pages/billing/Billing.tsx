import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchInvoices } from '../../store/slices/billingSlice';
import { Plus, Search, Filter, FileText, CreditCard, AlertCircle } from 'lucide-react';
import InvoiceList from './components/InvoiceList';
import InvoiceDetails from './components/InvoiceDetails';
import NewInvoiceModal from './components/NewInvoiceModal';

/**
 * Billing Page Component
 * Manages invoices, payments, and guest folios
 */
const Billing: React.FC = () => {
  const dispatch = useDispatch();
  const { invoices, filters, pagination, isLoading, error } = useSelector((state: RootState) => state.billing);
  
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchInvoices() as any);
  }, [dispatch]);

  const handleInvoiceSelect = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const getInvoiceStats = () => {
    const stats = {
      total: invoices.length,
      pending: invoices.filter(inv => inv.status === 'pending').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.summary.totalAmount, 0),
      totalPaid: invoices.reduce((sum, inv) => sum + inv.paymentStatus.totalPaid, 0),
      outstanding: invoices.reduce((sum, inv) => sum + inv.paymentStatus.outstandingBalance, 0)
    };
    return stats;
  };

  const invoiceStats = getInvoiceStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error loading invoices: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoicing</h1>
          <p className="text-gray-600">Manage guest folios and invoices</p>
        </div>
        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoiceStats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{invoiceStats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">{invoiceStats.paid}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">₹{invoiceStats.outstanding.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
            
            <InvoiceList 
              invoices={invoices}
              onInvoiceSelect={handleInvoiceSelect}
              selectedInvoice={selectedInvoice}
              searchTerm={searchTerm}
            />
          </div>
        </div>

        {/* Invoice Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <InvoiceDetails invoice={selectedInvoice} />
          </div>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <NewInvoiceModal 
          onClose={() => setShowNewInvoiceModal(false)}
          onSuccess={() => {
            setShowNewInvoiceModal(false);
            dispatch(fetchInvoices() as any);
          }}
        />
      )}
    </div>
  );
};

export default Billing;