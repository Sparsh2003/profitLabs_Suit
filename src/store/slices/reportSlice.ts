import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reportAPI } from '../../services/api';

// Types
interface OccupancyReport {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  revenue: number;
}

interface RevenueReport {
  date: string;
  roomRevenue: number;
  foodRevenue: number;
  beverageRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  taxes: number;
  netRevenue: number;
}

interface DailySalesReport {
  date: string;
  transactions: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    paymentMethod: string;
    time: string;
  }>;
  summary: {
    totalSales: number;
    totalTax: number;
    netSales: number;
    transactionCount: number;
  };
}

interface GuestReport {
  totalGuests: number;
  newGuests: number;
  returningGuests: number;
  vipGuests: number;
  guestsByNationality: Array<{
    nationality: string;
    count: number;
  }>;
  averageStayDuration: number;
  guestSatisfactionScore: number;
}

interface RoomReport {
  roomUtilization: Array<{
    roomNumber: string;
    roomType: string;
    occupancyRate: number;
    revenue: number;
    maintenanceHours: number;
  }>;
  roomTypePerformance: Array<{
    roomType: string;
    totalRooms: number;
    averageOccupancy: number;
    averageRate: number;
    totalRevenue: number;
  }>;
  housekeepingEfficiency: Array<{
    date: string;
    roomsCleaned: number;
    averageCleaningTime: number;
    maintenanceIssues: number;
  }>;
}

interface ReportState {
  occupancyReport: OccupancyReport[];
  revenueReport: RevenueReport[];
  dailySalesReport: DailySalesReport | null;
  guestReport: GuestReport | null;
  roomReport: RoomReport | null;
  isLoading: boolean;
  error: string | null;
  dateRange: {
    start: string;
    end: string;
  };
}

// Initial state
const initialState: ReportState = {
  occupancyReport: [],
  revenueReport: [],
  dailySalesReport: null,
  guestReport: null,
  roomReport: null,
  isLoading: false,
  error: null,
  dateRange: {
    start: '',
    end: '',
  },
};

// Async thunks
export const fetchOccupancyReport = createAsyncThunk(
  'reports/fetchOccupancyReport',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await reportAPI.getOccupancyReport(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch occupancy report');
    }
  }
);

export const fetchRevenueReport = createAsyncThunk(
  'reports/fetchRevenueReport',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await reportAPI.getRevenueReport(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue report');
    }
  }
);

export const fetchDailySalesReport = createAsyncThunk(
  'reports/fetchDailySalesReport',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await reportAPI.getDailySalesReport(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch daily sales report');
    }
  }
);

export const fetchGuestReport = createAsyncThunk(
  'reports/fetchGuestReport',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await reportAPI.getGuestReport(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guest report');
    }
  }
);

export const fetchRoomReport = createAsyncThunk(
  'reports/fetchRoomReport',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await reportAPI.getRoomReport(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch room report');
    }
  }
);

// Report slice
const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
    clearReports: (state) => {
      state.occupancyReport = [];
      state.revenueReport = [];
      state.dailySalesReport = null;
      state.guestReport = null;
      state.roomReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch occupancy report
      .addCase(fetchOccupancyReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOccupancyReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.occupancyReport = action.payload.report || [];
      })
      .addCase(fetchOccupancyReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch revenue report
      .addCase(fetchRevenueReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueReport = action.payload.report || [];
      })
      .addCase(fetchRevenueReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch daily sales report
      .addCase(fetchDailySalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailySalesReport = action.payload.report;
      })
      .addCase(fetchDailySalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch guest report
      .addCase(fetchGuestReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuestReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guestReport = action.payload.report;
      })
      .addCase(fetchGuestReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch room report
      .addCase(fetchRoomReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoomReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomReport = action.payload.report;
      })
      .addCase(fetchRoomReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setDateRange,
  clearReports,
} = reportSlice.actions;

export default reportSlice.reducer;