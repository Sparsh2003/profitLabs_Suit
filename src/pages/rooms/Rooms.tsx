import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchRooms, updateRoomStatus, markRoomCleaned } from '../../store/slices/roomSlice';
import { Plus, Filter, Grid, List, Bed, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import RoomGrid from './components/RoomGrid';
import RoomList from './components/RoomList';
import NewRoomModal from './components/NewRoomModal';
import RoomStatusModal from './components/RoomStatusModal';

/**
 * Rooms Page Component
 * Manages hotel rooms and housekeeping operations
 */
const Rooms: React.FC = () => {
  const dispatch = useDispatch();
  const { rooms, filters, isLoading, error } = useSelector((state: RootState) => state.rooms);
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchRooms() as any);
  }, [dispatch]);

  const handleStatusUpdate = (room: any, newStatus: string) => {
    setSelectedRoom(room);
    setShowStatusModal(true);
  };

  const handleMarkCleaned = (roomId: string) => {
    dispatch(markRoomCleaned({
      id: roomId,
      cleaningData: {
        notes: 'Room cleaned and ready for guests'
      }
    }) as any);
  };

  const getRoomStatusStats = () => {
    const stats = {
      available: 0,
      occupied: 0,
      dirty: 0,
      clean: 0,
      maintenance: 0,
      out_of_order: 0
    };

    rooms.forEach(room => {
      if (stats.hasOwnProperty(room.status.current)) {
        stats[room.status.current as keyof typeof stats]++;
      }
    });

    return stats;
  };

  const statusStats = getRoomStatusStats();

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
        <p className="text-red-600">Error loading rooms: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage rooms and housekeeping operations</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView('grid')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Grid</span>
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
          
          {/* New Room Button */}
          <button
            onClick={() => setShowNewRoomModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Room Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{statusStats.available}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">{statusStats.occupied}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dirty</p>
              <p className="text-2xl font-bold text-yellow-600">{statusStats.dirty}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clean</p>
              <p className="text-2xl font-bold text-purple-600">{statusStats.clean}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{statusStats.maintenance}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Order</p>
              <p className="text-2xl font-bold text-red-600">{statusStats.out_of_order}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Room Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {view === 'grid' ? (
          <RoomGrid 
            rooms={rooms}
            onStatusUpdate={handleStatusUpdate}
            onMarkCleaned={handleMarkCleaned}
          />
        ) : (
          <RoomList 
            rooms={rooms}
            onStatusUpdate={handleStatusUpdate}
            onMarkCleaned={handleMarkCleaned}
          />
        )}
      </div>

      {/* Modals */}
      {showNewRoomModal && (
        <NewRoomModal 
          onClose={() => setShowNewRoomModal(false)}
          onSuccess={() => {
            setShowNewRoomModal(false);
            dispatch(fetchRooms() as any);
          }}
        />
      )}

      {showStatusModal && selectedRoom && (
        <RoomStatusModal 
          room={selectedRoom}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRoom(null);
          }}
          onSuccess={() => {
            setShowStatusModal(false);
            setSelectedRoom(null);
            dispatch(fetchRooms() as any);
          }}
        />
      )}
    </div>
  );
};

export default Rooms;