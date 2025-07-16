import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchGuests } from '../../store/slices/guestSlice';
import { Plus, Search, Filter, Users, Star, AlertTriangle } from 'lucide-react';
import GuestList from './components/GuestList';
import GuestProfile from './components/GuestProfile';
import NewGuestModal from './components/NewGuestModal';

/**
 * Guests Page Component
 * Manages guest database and CRM functionality
 */
const Guests: React.FC = () => {
  const dispatch = useDispatch();
  const { guests, filters, pagination, isLoading, error } = useSelector((state: RootState) => state.guests);
  
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchGuests() as any);
  }, [dispatch]);

  const handleGuestSelect = (guest: any) => {
    setSelectedGuest(guest);
  };

  const getGuestStats = () => {
    const stats = {
      total: guests.length,
      vip: guests.filter(g => g.companyInfo?.isVip).length,
      blacklisted: guests.filter(g => g.blacklisted?.isBlacklisted).length,
      newThisMonth: guests.filter(g => {
        const createdDate = new Date(g.createdAt);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
      }).length
    };
    return stats;
  };

  const guestStats = getGuestStats();

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
        <p className="text-red-600">Error loading guests: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guest Management</h1>
          <p className="text-gray-600">Manage guest database and relationships</p>
        </div>
        <button
          onClick={() => setShowNewGuestModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Guest</span>
        </button>
      </div>

      {/* Guest Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{guestStats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">VIP Guests</p>
              <p className="text-2xl font-bold text-yellow-600">{guestStats.vip}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-green-600">{guestStats.newThisMonth}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blacklisted</p>
              <p className="text-2xl font-bold text-red-600">{guestStats.blacklisted}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Guest Database</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search guests..."
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
            
            <GuestList 
              guests={guests}
              onGuestSelect={handleGuestSelect}
              selectedGuest={selectedGuest}
              searchTerm={searchTerm}
            />
          </div>
        </div>

        {/* Guest Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <GuestProfile guest={selectedGuest} />
          </div>
        </div>
      </div>

      {/* New Guest Modal */}
      {showNewGuestModal && (
        <NewGuestModal 
          onClose={() => setShowNewGuestModal(false)}
          onSuccess={() => {
            setShowNewGuestModal(false);
            dispatch(fetchGuests() as any);
          }}
        />
      )}
    </div>
  );
};

export default Guests;