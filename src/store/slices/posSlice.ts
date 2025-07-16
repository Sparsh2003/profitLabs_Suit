import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { posAPI } from '../../services/api';

// Types
interface POSItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  taxRate: number;
  unit: string;
  availability: {
    isAvailable: boolean;
    availableFrom: string;
    availableTo: string;
    availableDays: string[];
  };
  ingredients: Array<{
    name: string;
    allergen: boolean;
  }>;
  variants: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  addOns: Array<{
    name: string;
    price: number;
    category: string;
  }>;
  images: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  tags: string[];
  inventory: {
    trackInventory: boolean;
    currentStock: number;
    minStock: number;
    maxStock: number;
  };
  statistics: {
    totalSold: number;
    totalRevenue: number;
    lastSold?: string;
    popularity: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  item: POSItem;
  quantity: number;
  selectedVariant?: any;
  selectedAddOns: any[];
  notes?: string;
  subtotal: number;
  taxAmount: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer?: {
    name: string;
    room?: string;
    phone?: string;
  };
  orderType: 'dine_in' | 'room_service' | 'takeaway';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface POSState {
  items: POSItem[];
  categories: string[];
  cart: CartItem[];
  currentOrder: Order | null;
  orders: Order[];
  selectedItem: POSItem | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    availability: boolean;
    search: string;
  };
}

// Initial state
const initialState: POSState = {
  items: [],
  categories: ['food', 'beverage', 'alcohol', 'spa', 'laundry', 'telephone', 'internet', 'other'],
  cart: [],
  currentOrder: null,
  orders: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    availability: true,
    search: '',
  },
};

// Async thunks
export const fetchPOSItems = createAsyncThunk(
  'pos/fetchItems',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await posAPI.getItems(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch POS items');
    }
  }
);

export const fetchPOSItem = createAsyncThunk(
  'pos/fetchItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await posAPI.getItem(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch POS item');
    }
  }
);

export const createPOSItem = createAsyncThunk(
  'pos/createItem',
  async (itemData: any, { rejectWithValue }) => {
    try {
      const response = await posAPI.createItem(itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create POS item');
    }
  }
);

export const updatePOSItem = createAsyncThunk(
  'pos/updateItem',
  async ({ id, itemData }: { id: string; itemData: any }, { rejectWithValue }) => {
    try {
      const response = await posAPI.updateItem(id, itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update POS item');
    }
  }
);

export const deletePOSItem = createAsyncThunk(
  'pos/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await posAPI.deleteItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete POS item');
    }
  }
);

export const createOrder = createAsyncThunk(
  'pos/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await posAPI.createOrder(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'pos/fetchOrders',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await posAPI.getOrders(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const postToRoom = createAsyncThunk(
  'pos/postToRoom',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await posAPI.postToRoom(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to post to room');
    }
  }
);

// POS slice
const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedItem: (state, action: PayloadAction<POSItem | null>) => {
      state.selectedItem = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.cart.findIndex(
        item => item.item.id === action.payload.item.id &&
        JSON.stringify(item.selectedVariant) === JSON.stringify(action.payload.selectedVariant) &&
        JSON.stringify(item.selectedAddOns) === JSON.stringify(action.payload.selectedAddOns)
      );

      if (existingItemIndex >= 0) {
        state.cart[existingItemIndex].quantity += action.payload.quantity;
        state.cart[existingItemIndex].subtotal += action.payload.subtotal;
        state.cart[existingItemIndex].taxAmount += action.payload.taxAmount;
        state.cart[existingItemIndex].total += action.payload.total;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart.splice(action.payload, 1);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ index: number; quantity: number }>) => {
      const { index, quantity } = action.payload;
      if (state.cart[index]) {
        const item = state.cart[index];
        const unitPrice = item.subtotal / item.quantity;
        const unitTax = item.taxAmount / item.quantity;
        
        item.quantity = quantity;
        item.subtotal = unitPrice * quantity;
        item.taxAmount = unitTax * quantity;
        item.total = item.subtotal + item.taxAmount;
      }
    },
    clearCart: (state) => {
      state.cart = [];
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
      // Fetch POS items
      .addCase(fetchPOSItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPOSItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchPOSItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single POS item
      .addCase(fetchPOSItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPOSItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedItem = action.payload.item;
      })
      .addCase(fetchPOSItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create POS item
      .addCase(createPOSItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPOSItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload.item);
      })
      .addCase(createPOSItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update POS item
      .addCase(updatePOSItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePOSItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.item.id);
        if (index !== -1) {
          state.items[index] = action.payload.item;
        }
        if (state.selectedItem?.id === action.payload.item.id) {
          state.selectedItem = action.payload.item;
        }
      })
      .addCase(updatePOSItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete POS item
      .addCase(deletePOSItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePOSItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deletePOSItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
        state.cart = []; // Clear cart after successful order
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Post to room
      .addCase(postToRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postToRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle successful post to room
      })
      .addCase(postToRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedItem,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  updateFilters,
  resetFilters,
} = posSlice.actions;

export default posSlice.reducer;