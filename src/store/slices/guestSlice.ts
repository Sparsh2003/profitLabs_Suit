import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { guestService } from '../../services/supabaseService';

// Types
interface Guest {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: string;
  };
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  identification: {
    type: string;
    number: string;
    issuedBy?: string;
    expiryDate?: string;
  };
  preferences: {
    roomType?: string;
    floor?: string;
    bedType?: string;
    smokingPreference: string;
    specialRequests: string[];
    dietaryRestrictions: string[];
    allergies: string[];
  };
  companyInfo: {
    companyName?: string;
    designation?: string;
    gstNumber?: string;
    isVip: boolean;
    vipTier?: string;
  };
  loyaltyInfo: {
    loyaltyNumber?: string;
    points: number;
    tier: string;
  };
  statistics: {
    totalBookings: number;
    totalRevenue: number;
    averageStayDuration: number;
    lastStayDate?: string;
    favouriteRoomType?: string;
  };
  notes: Array<{
    id: string;
    note: string;
    addedBy: string;
    addedAt: string;
    isImportant: boolean;
  }>;
  blacklisted: {
    isBlacklisted: boolean;
    reason?: string;
    blacklistedBy?: string;
    blacklistedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GuestState {
  guests: Guest[];
  selectedGuest: Guest | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    vipStatus: string;
    loyaltyTier: string;
    blacklisted: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Initial state
const initialState: GuestState = {
  guests: [],
  selectedGuest: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    vipStatus: 'all',
    loyaltyTier: 'all',
    blacklisted: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchGuests = createAsyncThunk(
  'guests/fetchGuests',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const guests = await guestService.getAllGuests();
      return { guests, pagination: { page: 1, limit: 50, total: guests.length, totalPages: 1 } };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch guests');
    }
  }
);

export const fetchGuest = createAsyncThunk(
  'guests/fetchGuest',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await guestAPI.getGuest(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guest');
    }
  }
);

export const createGuest = createAsyncThunk(
  'guests/createGuest',
  async (guestData: any, { rejectWithValue }) => {
    try {
      const guest = await guestService.createGuest(guestData);
      return { guest };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create guest');
    }
  }
);

export const updateGuest = createAsyncThunk(
  'guests/updateGuest',
  async ({ id, guestData }: { id: string; guestData: any }, { rejectWithValue }) => {
    try {
      const response = await guestAPI.updateGuest(id, guestData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update guest');
    }
  }
);

export const addGuestNote = createAsyncThunk(
  'guests/addGuestNote',
  async ({ id, noteData }: { id: string; noteData: any }, { rejectWithValue }) => {
    try {
      const response = await guestAPI.addGuestNote(id, noteData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add guest note');
    }
  }
);

export const fetchGuestBookings = createAsyncThunk(
  'guests/fetchGuestBookings',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await guestAPI.getGuestBookings(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guest bookings');
    }
  }
);

export const deleteGuest = createAsyncThunk(
  'guests/deleteGuest',
  async (id: string, { rejectWithValue }) => {
    try {
      await guestAPI.deleteGuest(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete guest');
    }
  }
);

// Guest slice
const guestSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedGuest: (state, action: PayloadAction<Guest | null>) => {
      state.selectedGuest = action.payload;
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
      // Fetch guests
      .addCase(fetchGuests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guests = action.payload.guests || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchGuests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single guest
      .addCase(fetchGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedGuest = action.payload.guest;
      })
      .addCase(fetchGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create guest
      .addCase(createGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guests.unshift(action.payload.guest);
      })
      .addCase(createGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update guest
      .addCase(updateGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.guests.findIndex(guest => guest.id === action.payload.guest.id);
        if (index !== -1) {
          state.guests[index] = action.payload.guest;
        }
        if (state.selectedGuest?.id === action.payload.guest.id) {
          state.selectedGuest = action.payload.guest;
        }
      })
      .addCase(updateGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add guest note
      .addCase(addGuestNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addGuestNote.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedGuest?.id === action.payload.guest.id) {
          state.selectedGuest = action.payload.guest;
        }
        const index = state.guests.findIndex(guest => guest.id === action.payload.guest.id);
        if (index !== -1) {
          state.guests[index] = action.payload.guest;
        }
      })
      .addCase(addGuestNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete guest
      .addCase(deleteGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guests = state.guests.filter(guest => guest.id !== action.payload);
        if (state.selectedGuest?.id === action.payload) {
          state.selectedGuest = null;
        }
      })
      .addCase(deleteGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedGuest,
  updateFilters,
  updatePagination,
  resetFilters,
} = guestSlice.actions;

export default guestSlice.reducer;