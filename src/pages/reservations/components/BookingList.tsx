import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

/**
 * Booking List Component
 * Displays bookings in a table format
 */
const BookingList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample booking data
  const bookings = [
    {
      id: '1',
      bookingNumber: 'BK001',
      guest: 'John Doe',
      room: '101',
      roomType: 'Standard',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'confirmed',
      adults: 2,
      children: 0,
      totalAmount: 12000,
      source: 'website'
    },
    {
      id: '2',
      bookingNumber: 'BK002',
      guest: 'Jane Smith',
      room: '102',
      roomType: 'Standard',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      status: 'checked_in',
      adults: 1,
      children: 1,
      totalAmount: 16000,
      source: 'walk_in'
    },
    {
      id: '3',
      bookingNumber: 'BK003',
      guest: 'Bob Johnson',
      room: '201',
      roomType: 'Deluxe',
      checkIn: '2024-01-14',
      checkOut: '2024-01-17',
      status: 'checked_out',
      adults: 2,
      children: 0,
      totalAmount: 15000,
      source: 'phone'
    },
  ];

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

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website':
        return 'bg-purple-100 text-purple-800';
      case 'walk_in':
        return 'bg-green-100 text-green-800';
      case 'phone':
        return 'bg-blue-100 text-blue-800';
      case 'ota':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.bookingNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.guest}</div>
                  <div className="text-sm text-gray-500">{booking.adults} Adults, {booking.children} Children</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.room}</div>
                  <div className="text-sm text-gray-500">{booking.roomType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    to {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSourceColor(booking.source)}`}>
                    {booking.source.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{booking.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="text-green-600 hover:text-green-900">
                        <UserCheck className="h-4 w-4" />
                      </button>
                    )}
                    {booking.status === 'checked_in' && (
                      <button className="text-red-600 hover:text-red-900">
                        <UserX className="h-4 w-4" />
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BookingList;