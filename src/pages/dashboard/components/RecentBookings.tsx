import React from 'react';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

interface RecentBookingsProps {
  bookings: any[];
}

/**
 * Recent Bookings Component
 * Displays list of recent bookings
 */
const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-green-100 text-green-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent bookings</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{booking.guest}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span>{booking.bookingNumber}</span> • 
                  <span className="ml-1">{booking.room} ({booking.roomType})</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{booking.totalAmount.toLocaleString()}</p>
                <button className="text-blue-600 hover:text-blue-800 mt-1">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBookings;