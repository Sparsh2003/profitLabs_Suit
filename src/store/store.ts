import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import reservationReducer from './slices/reservationSlice';
import roomReducer from './slices/roomSlice';
import guestReducer from './slices/guestSlice';
import posReducer from './slices/posSlice';
import billingReducer from './slices/billingSlice';
import reportReducer from './slices/reportSlice';

/**
 * Redux Store Configuration
 * Centralized state management for ProfitLabs Suite
 */
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    reservations: reservationReducer,
    rooms: roomReducer,
    guests: guestReducer,
    pos: posReducer,
    billing: billingReducer,
    reports: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;