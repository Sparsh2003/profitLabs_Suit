import React from 'react';
import { Bed, Users, Settings, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';

interface RoomGridProps {
  rooms: any[];
  onStatusUpdate: (room: any, status: string) => void;
  onMarkCleaned: (roomId: string) => void;
}

/**
 * Room Grid Component
 * Displays rooms in a grid layout with status indicators
 */
const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onStatusUpdate, onMarkCleaned }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dirty':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'clean':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'out_of_order':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'occupied':
        return <Bed className="h-4 w-4" />;
      case 'dirty':
        return <AlertCircle className="h-4 w-4" />;
      case 'clean':
        return <CheckCircle className="h-4 w-4" />;
      case 'maintenance':
        return <Settings className="h-4 w-4" />;
      case 'out_of_order':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Room Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{room.roomNumber}</h3>
                <p className="text-sm text-gray-600">{room.roomType}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Room Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{room.capacity.adults} Adults, {room.capacity.children} Children</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Bed className="h-4 w-4 mr-2" />
                <span>{room.bedConfiguration.bedCount} {room.bedConfiguration.bedType}</span>
              </div>
              <div className="text-sm text-gray-600">
                Floor {room.floor} • ₹{room.pricing.baseRate}/night
              </div>
            </div>

            {/* Room Status */}
            <div className="mb-4">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status.current)}`}>
                {getStatusIcon(room.status.current)}
                <span className="ml-1 capitalize">{room.status.current.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {room.status.current === 'dirty' && (
                <button
                  onClick={() => onMarkCleaned(room.id)}
                  className="w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Mark as Cleaned
                </button>
              )}
              
              {room.status.current === 'available' && (
                <button
                  onClick={() => onStatusUpdate(room, 'maintenance')}
                  className="w-full bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Mark for Maintenance
                </button>
              )}
              
              {room.status.current === 'maintenance' && (
                <button
                  onClick={() => onStatusUpdate(room, 'available')}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Mark as Available
                </button>
              )}
              
              <button
                onClick={() => onStatusUpdate(room, 'change_status')}
                className="w-full bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Change Status
              </button>
            </div>

            {/* Last Updated */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last updated: {new Date(room.status.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-8">
          <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No rooms found. Add your first room to get started.</p>
        </div>
      )}
    </div>
  );
};

export default RoomGrid;