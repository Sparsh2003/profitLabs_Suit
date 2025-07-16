import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import Reservations from './pages/reservations/Reservations';
import Rooms from './pages/rooms/Rooms';
import Guests from './pages/guests/Guests';
import POS from './pages/pos/POS';
import Billing from './pages/billing/Billing';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
// import './App.css';

/**
 * Main App Component
 * Handles routing and global state management for ProfitLabs Suite
 */

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="guests" element={<Guests />} />
                <Route path="pos" element={<POS />} />
                <Route path="billing" element={<Billing />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;