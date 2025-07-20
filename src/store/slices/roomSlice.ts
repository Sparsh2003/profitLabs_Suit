import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roomService } from '../../services/supabaseService';

// Types
interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  capacity: {
    adults: number;
    children: number;
    maxOccupancy: number;
  };
  bedConfiguration: {
    bedType: string;
    bedCount: number;
  };
  pricing: {
    baseRate: number;
    currency: string;
    taxRate: number;
  };
  status: {
    current: string;
    lastUpdated: string;
    updatedBy?: string;
  };
  housekeeping: {
    lastCleaned?: string;
    cleanedBy?: string;
    cleaningNotes?: string;
    maintenanceRequired: boolean;
    maintenanceNotes?: string;
    lastMaintenance?: string;
  };
  amenities: string[];
  features: {
    smokingAllowed: boolean;
    petFriendly: boolean;
    accessible: boolean;
    connecting: boolean;
  };
  photos: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    roomType: string;
    floor: string;
    isActive: boolean;
  };
  roomTypes: string[];
  roomStatuses: string[];
}

// Initial state
const initialState: RoomState = {
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    roomType: 'all',
    floor: 'all',
    isActive: true,
  },
  roomTypes: ['standard', 'deluxe', 'suite', 'presidential', 'family', 'accessible'],
  roomStatuses: ['available', 'occupied', 'dirty', 'clean', 'maintenance', 'out_of_order'],
};

// Async thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const rooms = await roomService.getAllRooms();
      return { rooms };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch rooms');
    }
  }
);

export const fetchRoom = createAsyncThunk(
  'rooms/fetchRoom',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await roomAPI.getRoom(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch room');
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData: any, { rejectWithValue }) => {
    try {
      const room = await roomService.createRoom(roomData);
      return { room };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create room');
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, roomData }: { id: string; roomData: any }, { rejectWithValue }) => {
    try {
      const response = await roomAPI.updateRoom(id, roomData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update room');
    }
  }
);

export const updateRoomStatus = createAsyncThunk(
  'rooms/updateRoomStatus',
  async ({ id, statusData }: { id: string; statusData: any }, { rejectWithValue }) => {
    try {
      const room = await roomService.updateRoomStatus(id, statusData.status);
      return { room };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update room status');
    }
  }
);

export const markRoomCleaned = createAsyncThunk(
  'rooms/markRoomCleaned',
  async ({ id, cleaningData }: { id: string; cleaningData: any }, { rejectWithValue }) => {
    try {
      const room = await roomService.updateRoomStatus(id, 'available');
      return { room };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark room as cleaned');
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id: string, { rejectWithValue }) => {
    try {
      await roomAPI.deleteRoom(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete room');
    }
  }
);

// Room slice
const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload.rooms || [];
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single room
      .addCase(fetchRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRoom = action.payload.room;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create room
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms.push(action.payload.room);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.rooms.findIndex(room => room.id === action.payload.room.id);
        if (index !== -1) {
          state.rooms[index] = action.payload.room;
        }
        if (state.selectedRoom?.id === action.payload.room.id) {
          state.selectedRoom = action.payload.room;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update room status
      .addCase(updateRoomStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.rooms.findIndex(room => room.id === action.payload.room.id);
        if (index !== -1) {
          state.rooms[index] = action.payload.room;
        }
        if (state.selectedRoom?.id === action.payload.room.id) {
          state.selectedRoom = action.payload.room;
        }
      })
      .addCase(updateRoomStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark room cleaned
      .addCase(markRoomCleaned.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markRoomCleaned.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.rooms.findIndex(room => room.id === action.payload.room.id);
        if (index !== -1) {
          state.rooms[index] = action.payload.room;
        }
        if (state.selectedRoom?.id === action.payload.room.id) {
          state.selectedRoom = action.payload.room;
        }
      })
      .addCase(markRoomCleaned.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
        if (state.selectedRoom?.id === action.payload) {
          state.selectedRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedRoom,
  updateFilters,
  resetFilters,
} = roomSlice.actions;

export default roomSlice.reducer;