import React, { useState } from 'react';
import { Plus, Calendar, Grid, List } from 'lucide-react';
import RoomReservationPanel from './components/RoomReservationPanel';
import BookingList from './components/BookingList';
import NewBookingModal from './components/NewBookingModal';

/**
 * Reservations Page Component
 * Manages hotel reservations and bookings
 */
const Reservations: React.FC = () => {
  const [view, setView] = useState<'rooms' | 'list'>('rooms');
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleNewBooking = (roomId: string, date: Date) => {
    setSelectedRoom(roomId);
    setSelectedDate(date);
    setShowNewBookingModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage hotel bookings and reservations</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView('rooms')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'rooms' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Room View</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
          </div>
          
          {/* New Booking Button */}
          <button
            onClick={() => setShowNewBookingModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {view === 'rooms' ? (
          <RoomReservationPanel onNewBooking={handleNewBooking} />
        ) : (
          <BookingList />
        )}
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <NewBookingModal 
          preselectedRoom={selectedRoom}
          preselectedDate={selectedDate}
          onClose={() => setShowNewBookingModal(false)}
          onSuccess={() => {
            setShowNewBookingModal(false);
            setSelectedRoom(null);
            setSelectedDate(null);
            // Refresh bookings
          }}
        />
      )}
    </div>
  );
};

export default Reservations;