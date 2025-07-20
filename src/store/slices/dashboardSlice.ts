import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/supabaseService';

// Types
interface DashboardStats {
  todayCheckIns: number;
  todayCheckOuts: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  todayRevenue: number;
}

interface RoomStatusDistribution {
  _id: string;
  count: number;
}

interface RevenueData {
  _id: string;
  revenue: number;
}

interface RecentBooking {
  id: string;
  bookingNumber: string;
  guest: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
}

interface PendingCheckIn {
  id: string;
  bookingNumber: string;
  guest: string;
  room: string;
  roomType: string;
  checkIn: string;
  adults: number;
  children: number;
}

interface PendingCheckOut {
  id: string;
  bookingNumber: string;
  guest: string;
  room: string;
  roomType: string;
  checkOut: string;
  totalAmount: number;
}

interface DirtyRoom {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  lastUpdated: string;
}

interface MaintenanceRoom {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  maintenanceNotes: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  roomStatusDistribution: RoomStatusDistribution[];
  revenueData: RevenueData[];
  recentBookings: RecentBooking[];
  pendingCheckIns: PendingCheckIn[];
  pendingCheckOuts: PendingCheckOut[];
  dirtyRooms: DirtyRoom[];
  maintenanceRooms: MaintenanceRoom[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  stats: null,
  roomStatusDistribution: [],
  revenueData: [],
  recentBookings: [],
  pendingCheckIns: [],
  pendingCheckOuts: [],
  dirtyRooms: [],
  maintenanceRooms: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const [stats, roomStatusDistribution, recentBookings] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRoomStatusDistribution(),
        dashboardService.getRecentBookings()
      ]);
      
      return {
        stats,
        roomStatusDistribution,
        recentBookings,
        revenueData: [] // Mock data for now
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchQuickActions = createAsyncThunk(
  'dashboard/fetchQuickActions',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data for quick actions
      return {
        pendingCheckIns: [],
        pendingCheckOuts: [],
        dirtyRooms: [],
        maintenanceRooms: []
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quick actions');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.roomStatusDistribution = action.payload.roomStatusDistribution;
        state.revenueData = action.payload.revenueData;
        state.recentBookings = action.payload.recentBookings;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch quick actions
      .addCase(fetchQuickActions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuickActions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingCheckIns = action.payload.pendingCheckIns;
        state.pendingCheckOuts = action.payload.pendingCheckOuts;
        state.dirtyRooms = action.payload.dirtyRooms;
        state.maintenanceRooms = action.payload.maintenanceRooms;
      })
      .addCase(fetchQuickActions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;