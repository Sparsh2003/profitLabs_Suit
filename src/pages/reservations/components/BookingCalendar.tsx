import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Booking Calendar Component
 * Visual calendar grid showing room bookings
 */
const BookingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample room data
  const rooms = [
    { id: '1', number: '101', type: 'Standard', floor: 1 },
    { id: '2', number: '102', type: 'Standard', floor: 1 },
    { id: '3', number: '201', type: 'Deluxe', floor: 2 },
    { id: '4', number: '202', type: 'Deluxe', floor: 2 },
    { id: '5', number: '301', type: 'Suite', floor: 3 },
  ];

  // Sample booking data
  const bookings = [
    {
      id: '1',
      roomId: '1',
      guest: 'John Doe',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'confirmed'
    },
    {
      id: '2',
      roomId: '2',
      guest: 'Jane Smith',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      status: 'checked_in'
    },
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(subDays(monthStart, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addDays(monthEnd, 1));
  };

  const getBookingForRoomAndDate = (roomId: string, date: Date) => {
    return bookings.find(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return booking.roomId === roomId && date >= checkIn && date < checkOut;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'checked_in':
        return 'bg-green-500';
      case 'checked_out':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Date Headers */}
          <div className="grid grid-cols-32 gap-px bg-gray-200 rounded-lg p-2">
            <div className="bg-white p-2 rounded font-medium text-gray-900">Room</div>
            {days.map(day => (
              <div
                key={day.toISOString()}
                className={`bg-white p-2 rounded text-center text-sm font-medium ${
                  isSameDay(day, selectedDate) 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>

          {/* Room Rows */}
          <div className="mt-2 space-y-1">
            {rooms.map(room => (
              <div key={room.id} className="grid grid-cols-32 gap-px bg-gray-200 rounded-lg p-2">
                <div className="bg-white p-2 rounded">
                  <div className="font-medium text-gray-900">{room.number}</div>
                  <div className="text-xs text-gray-500">{room.type}</div>
                </div>
                {days.map(day => {
                  const booking = getBookingForRoomAndDate(room.id, day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`bg-white p-2 rounded min-h-[60px] cursor-pointer hover:bg-gray-50 ${
                        booking ? `${getStatusColor(booking.status)} text-white` : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {booking && (
                        <div className="text-xs">
                          <div className="font-medium">{booking.guest}</div>
                          <div className="opacity-75">{booking.status}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Checked In</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-sm text-gray-600">Checked Out</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;