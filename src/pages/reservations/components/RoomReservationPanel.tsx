import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Bed, Users, Wifi, Car, Coffee, Tv } from 'lucide-react';

interface Room {
  id: string;
  room_number: string;
  room_type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  floor: number;
  capacity: number;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out_of_order';
  amenities: string[];
}

interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
}

interface RoomReservationPanelProps {
  onNewBooking: (roomId: string, date: Date) => void;
}

/**
 * Enhanced Room Reservation Panel Component
 * Visual room cards with color-coded status and easy booking interface
 */
const RoomReservationPanel: React.FC<RoomReservationPanelProps> = ({ onNewBooking }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Sample data - in production, this would come from your API
  const [rooms] = useState<Room[]>([
    {
      id: '1',
      room_number: '101',
      room_type: 'standard',
      floor: 1,
      capacity: 2,
      price_per_night: 2500,
      status: 'available',
      amenities: ['wifi', 'tv', 'ac']
    },
    {
      id: '2',
      room_number: '102',
      room_type: 'standard',
      floor: 1,
      capacity: 2,
      price_per_night: 2500,
      status: 'occupied',
      amenities: ['wifi', 'tv', 'ac']
    },
    {
      id: '3',
      room_number: '103',
      room_type: 'deluxe',
      floor: 1,
      capacity: 3,
      price_per_night: 3500,
      status: 'cleaning',
      amenities: ['wifi', 'tv', 'ac', 'minibar']
    },
    {
      id: '4',
      room_number: '201',
      room_type: 'deluxe',
      floor: 2,
      capacity: 3,
      price_per_night: 3500,
      status: 'available',
      amenities: ['wifi', 'tv', 'ac', 'minibar']
    },
    {
      id: '5',
      room_number: '202',
      room_type: 'suite',
      floor: 2,
      capacity: 4,
      price_per_night: 5500,
      status: 'maintenance',
      amenities: ['wifi', 'tv', 'ac', 'minibar', 'balcony']
    },
    {
      id: '6',
      room_number: '301',
      room_type: 'presidential',
      floor: 3,
      capacity: 6,
      price_per_night: 8500,
      status: 'available',
      amenities: ['wifi', 'tv', 'ac', 'minibar', 'balcony', 'jacuzzi']
    }
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      room_id: '2',
      guest_name: 'John Doe',
      check_in_date: format(new Date(), 'yyyy-MM-dd'),
      check_out_date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      status: 'checked_in'
    },
    {
      id: '2',
      room_id: '1',
      guest_name: 'Jane Smith',
      check_in_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      check_out_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      status: 'confirmed'
    }
  ]);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'cleaning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'out_of_order':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'standard':
        return 'bg-blue-50 border-blue-200';
      case 'deluxe':
        return 'bg-purple-50 border-purple-200';
      case 'suite':
        return 'bg-indigo-50 border-indigo-200';
      case 'presidential':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBookingForRoom = (roomId: string, date: Date) => {
    return bookings.find(booking => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      return booking.room_id === roomId && date >= checkIn && date < checkOut;
    });
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'tv':
        return <Tv className="h-3 w-3" />;
      case 'car':
        return <Car className="h-3 w-3" />;
      case 'coffee':
        return <Coffee className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleRoomClick = (room: Room, date: Date) => {
    if (room.status === 'available') {
      onNewBooking(room.id, date);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Room Availability</h2>
          <p className="text-gray-600">Click on available rooms to create bookings</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day View
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </span>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-sm text-gray-700">Occupied</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-sm text-gray-700">Cleaning</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm text-gray-700">Maintenance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Out of Order</span>
        </div>
      </div>

      {viewMode === 'week' ? (
        /* Week View */
        <div className="space-y-4">
          {/* Date Headers */}
          <div className="grid grid-cols-8 gap-2">
            <div className="p-3 text-center font-medium text-gray-900">Room</div>
            {weekDays.map(day => (
              <div
                key={day.toISOString()}
                className={`p-3 text-center rounded-lg transition-colors ${
                  isToday(day) 
                    ? 'bg-blue-100 text-blue-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          <div className="space-y-2">
            {rooms.map(room => (
              <div key={room.id} className="grid grid-cols-8 gap-2">
                {/* Room Info */}
                <div className={`p-4 rounded-lg border-2 ${getRoomTypeColor(room.room_type)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{room.room_number}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-3 w-3" />
                      <span className="capitalize">{room.room_type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{room.capacity} guests</span>
                    </div>
                    <div className="font-medium text-gray-900">₹{room.price_per_night}/night</div>
                    <div className="flex items-center space-x-1">
                      {room.amenities.slice(0, 3).map(amenity => (
                        <span key={amenity} className="text-gray-400">
                          {getAmenityIcon(amenity)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date Cells */}
                {weekDays.map(day => {
                  const booking = getBookingForRoom(room.id, day);
                  const isAvailable = room.status === 'available' && !booking;
                  
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => isAvailable && handleRoomClick(room, day)}
                      className={`p-3 rounded-lg border-2 min-h-[80px] transition-all duration-200 ${
                        booking 
                          ? 'bg-blue-100 border-blue-300 cursor-default' 
                          : isAvailable
                          ? 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer hover:shadow-md'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {booking ? (
                        <div className="text-xs">
                          <div className="font-medium text-blue-900 truncate">{booking.guest_name}</div>
                          <div className="text-blue-700 capitalize">{booking.status}</div>
                        </div>
                      ) : isAvailable ? (
                        <div className="flex items-center justify-center h-full">
                          <Plus className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-xs text-gray-500 capitalize">{room.status}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Day View */
        <div className="space-y-4">
          {/* Date Selector */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
              </h3>
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Room Grid for Selected Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms.map(room => {
              const booking = getBookingForRoom(room.id, selectedDate);
              const isAvailable = room.status === 'available' && !booking;
              
              return (
                <div
                  key={room.id}
                  onClick={() => isAvailable && handleRoomClick(room, selectedDate)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    booking 
                      ? 'bg-blue-100 border-blue-300' 
                      : isAvailable
                      ? 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer hover:shadow-lg hover:scale-105'
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  {/* Room Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{room.room_number}</h3>
                      <p className="text-sm text-gray-600 capitalize">{room.room_type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>

                  {/* Room Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Capacity</span>
                      </div>
                      <span className="font-medium text-gray-900">{room.capacity} guests</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Floor</span>
                      </div>
                      <span className="font-medium text-gray-900">{room.floor}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rate</span>
                      <span className="font-bold text-lg text-gray-900">₹{room.price_per_night}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full border">
                          {getAmenityIcon(amenity)}
                          <span className="text-xs text-gray-600 capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Info or Action */}
                  {booking ? (
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-sm font-medium text-blue-900">{booking.guest_name}</div>
                      <div className="text-xs text-blue-700 capitalize">{booking.status}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(booking.check_in_date), 'MMM dd')} - {format(new Date(booking.check_out_date), 'MMM dd')}
                      </div>
                    </div>
                  ) : isAvailable ? (
                    <div className="bg-white p-3 rounded-lg border border-dashed border-green-300 text-center">
                      <Plus className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-medium text-green-700">Available</div>
                      <div className="text-xs text-green-600">Click to book</div>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded-lg border text-center">
                      <div className="text-sm font-medium text-gray-700 capitalize">{room.status}</div>
                      <div className="text-xs text-gray-500">Not available</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomReservationPanel;