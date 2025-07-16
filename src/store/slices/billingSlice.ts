import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { billingAPI } from '../../services/api';

// Types
interface LineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  date: string;
  addedBy?: string;
  notes?: string;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  reference?: string;
  receivedBy?: string;
  receivedAt: string;
  notes?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  booking: {
    id: string;
    bookingNumber: string;
  };
  guest: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  summary: {
    subtotal: number;
    totalTax: number;
    discounts: number;
    totalAmount: number;
    currency: string;
  };
  payments: Payment[];
  status: string;
  paymentStatus: {
    totalPaid: number;
    outstandingBalance: number;
    lastPaymentDate?: string;
  };
  companyInfo: {
    name: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
    contact: {
      phone?: string;
      email?: string;
      website?: string;
    };
    taxInfo: {
      gstNumber?: string;
      panNumber?: string;
    };
  };
  notes: Array<{
    id: string;
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface BillingState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  guestFolio: Invoice | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    paymentStatus: string;
    dateRange: {
      start: string;
      end: string;
    };
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Initial state
const initialState: BillingState = {
  invoices: [],
  selectedInvoice: null,
  guestFolio: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    paymentStatus: 'all',
    dateRange: {
      start: '',
      end: '',
    },
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'billing/fetchInvoices',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.getInvoices(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const fetchInvoice = createAsyncThunk(
  'billing/fetchInvoice',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await billingAPI.getInvoice(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'billing/createInvoice',
  async (invoiceData: any, { rejectWithValue }) => {
    try {
      const response = await billingAPI.createInvoice(invoiceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'billing/updateInvoice',
  async ({ id, invoiceData }: { id: string; invoiceData: any }, { rejectWithValue }) => {
    try {
      const response = await billingAPI.updateInvoice(id, invoiceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update invoice');
    }
  }
);

export const addPayment = createAsyncThunk(
  'billing/addPayment',
  async ({ id, paymentData }: { id: string; paymentData: any }, { rejectWithValue }) => {
    try {
      const response = await billingAPI.addPayment(id, paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add payment');
    }
  }
);

export const fetchGuestFolio = createAsyncThunk(
  'billing/fetchGuestFolio',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await billingAPI.getGuestFolio(bookingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guest folio');
    }
  }
);

export const generateInvoicePDF = createAsyncThunk(
  'billing/generateInvoicePDF',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await billingAPI.generateInvoicePDF(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate invoice PDF');
    }
  }
);

// Billing slice
const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
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
    clearGuestFolio: (state) => {
      state.guestFolio = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload.invoices || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single invoice
      .addCase(fetchInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInvoice = action.payload.invoice;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices.unshift(action.payload.invoice);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.invoices.findIndex(invoice => invoice.id === action.payload.invoice.id);
        if (index !== -1) {
          state.invoices[index] = action.payload.invoice;
        }
        if (state.selectedInvoice?.id === action.payload.invoice.id) {
          state.selectedInvoice = action.payload.invoice;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add payment
      .addCase(addPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.invoices.findIndex(invoice => invoice.id === action.payload.invoice.id);
        if (index !== -1) {
          state.invoices[index] = action.payload.invoice;
        }
        if (state.selectedInvoice?.id === action.payload.invoice.id) {
          state.selectedInvoice = action.payload.invoice;
        }
        if (state.guestFolio?.id === action.payload.invoice.id) {
          state.guestFolio = action.payload.invoice;
        }
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch guest folio
      .addCase(fetchGuestFolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuestFolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guestFolio = action.payload.folio;
      })
      .addCase(fetchGuestFolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate invoice PDF
      .addCase(generateInvoicePDF.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateInvoicePDF.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(generateInvoicePDF.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedInvoice,
  updateFilters,
  updatePagination,
  resetFilters,
  clearGuestFolio,
} = billingSlice.actions;

export default billingSlice.reducer;