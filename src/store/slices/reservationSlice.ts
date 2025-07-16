import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reservationAPI } from '../../services/api';

// Types
interface Booking {
  id: string;
  bookingNumber: string;
  guest: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  room: {
    id: string;
    roomNumber: string;
    roomType: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    actualCheckIn?: string;
    actualCheckOut?: string;
  };
  occupancy: {
    adults: number;
    children: number;
    infants: number;
  };
  pricing: {
    roomRate: number;
    totalNights: number;
    subtotal: number;
    taxes: number;
    discounts: number;
    totalAmount: number;
  };
  status: string;
  source: string;
  specialRequests: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReservationState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
    roomType: string;
    source: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Initial state
const initialState: ReservationState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: {
      start: '',
      end: '',
    },
    roomType: 'all',
    source: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'reservations/fetchBookings',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.getBookings(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBooking = createAsyncThunk(
  'reservations/fetchBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.getBooking(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const createBooking = createAsyncThunk(
  'reservations/createBooking',
  async (bookingData: any, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.createBooking(bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'reservations/updateBooking',
  async ({ id, bookingData }: { id: string; bookingData: any }, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.updateBooking(id, bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
    }
  }
);

export const checkInGuest = createAsyncThunk(
  'reservations/checkInGuest',
  async ({ id, checkInData }: { id: string; checkInData: any }, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.checkIn(id, checkInData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check in guest');
    }
  }
);

export const checkOutGuest = createAsyncThunk(
  'reservations/checkOutGuest',
  async ({ id, checkOutData }: { id: string; checkOutData: any }, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.checkOut(id, checkOutData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check out guest');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'reservations/cancelBooking',
  async ({ id, cancellationData }: { id: string; cancellationData: any }, { rejectWithValue }) => {
    try {
      const response = await reservationAPI.cancelBooking(id, cancellationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

// Reservation slice
const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updatePagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single booking
      .addCase(fetchBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBooking = action.payload.booking;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.selectedBooking?.id === action.payload.booking.id) {
          state.selectedBooking = action.payload.booking;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check in guest
      .addCase(checkInGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkInGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.selectedBooking?.id === action.payload.booking.id) {
          state.selectedBooking = action.payload.booking;
        }
      })
      .addCase(checkInGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check out guest
      .addCase(checkOutGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOutGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.selectedBooking?.id === action.payload.booking.id) {
          state.selectedBooking = action.payload.booking;
        }
      })
      .addCase(checkOutGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.selectedBooking?.id === action.payload.booking.id) {
          state.selectedBooking = action.payload.booking;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedBooking,
  updateFilters,
  updatePagination,
  resetFilters,
} = reservationSlice.actions;

export default reservationSlice.reducer;