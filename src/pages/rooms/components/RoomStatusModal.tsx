import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateRoomStatus } from '../../../store/slices/roomSlice';

interface RoomStatusModalProps {
  room: any;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Room Status Modal Component
 * Modal for updating room status with notes
 */
const RoomStatusModal: React.FC<RoomStatusModalProps> = ({ room, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(room.status.current);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'available', label: 'Available', color: 'text-green-600' },
    { value: 'occupied', label: 'Occupied', color: 'text-blue-600' },
    { value: 'dirty', label: 'Dirty', color: 'text-yellow-600' },
    { value: 'clean', label: 'Clean', color: 'text-purple-600' },
    { value: 'maintenance', label: 'Maintenance', color: 'text-orange-600' },
    { value: 'out_of_order', label: 'Out of Order', color: 'text-red-600' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(updateRoomStatus({
        id: room.id,
        statusData: {
          status: selectedStatus,
          notes: notes
        }
      }) as any);
      onSuccess();
    } catch (error) {
      console.error('Failed to update room status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Update Room Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Room Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Room {room.roomNumber}</h3>
            <p className="text-sm text-gray-600">{room.roomType} • Floor {room.floor}</p>
            <p className="text-sm text-gray-500 mt-1">
              Current Status: <span className="font-medium capitalize">{room.status.current.replace('_', ' ')}</span>
            </p>
          </div>

          {/* Status Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-2 text-sm font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about the status change..."
            />
          </div>

          {/* Warning for certain status changes */}
          {(selectedStatus === 'out_of_order' || selectedStatus === 'maintenance') && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This room will be unavailable for bookings until the status is changed back to available.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedStatus === room.status.current}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomStatusModal;