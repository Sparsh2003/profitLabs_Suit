import React from 'react';
import { Bed, Users, Settings, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';

interface RoomListProps {
  rooms: any[];
  onStatusUpdate: (room: any, status: string) => void;
  onMarkCleaned: (roomId: string) => void;
}

/**
 * Room List Component
 * Displays rooms in a table format
 */
const RoomList: React.FC<RoomListProps> = ({ rooms, onStatusUpdate, onMarkCleaned }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'out_of_order':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'occupied':
        return <Bed className="h-4 w-4" />;
      case 'cleaning':
        return <Settings className="h-4 w-4" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4" />;
      case 'out_of_order':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Floor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bed Configuration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{room.room_number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{room.room_type}</div>
                  <div className="text-sm text-gray-500">Floor {room.floor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="h-4 w-4 mr-1" />
                    {room.capacity} max
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Bed className="h-4 w-4 mr-1" />
                    <span className="capitalize">{room.room_type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{room.price_per_night}</div>
                  <div className="text-sm text-gray-500">per night</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {getStatusIcon(room.status)}
                    <span className="ml-1 capitalize">{room.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(room.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {room.status === 'cleaning' && (
                      <button
                        onClick={() => onMarkCleaned(room.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Cleaned"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onStatusUpdate(room, 'change_status')}
                      className="text-blue-600 hover:text-blue-900"
                      title="Change Status"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    
                    <button className="text-green-600 hover:text-green-900" title="Edit Room">
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button className="text-red-600 hover:text-red-900" title="Delete Room">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default RoomList;