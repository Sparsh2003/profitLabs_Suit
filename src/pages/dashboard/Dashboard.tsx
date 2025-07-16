import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchDashboardStats, fetchQuickActions } from '../../store/slices/dashboardSlice';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import RoomStatusChart from './components/RoomStatusChart';
import RecentBookings from './components/RecentBookings';
import QuickActions from './components/QuickActions';

/**
 * Dashboard Page Component
 * Main dashboard showing key metrics and quick actions
 */
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, roomStatusDistribution, revenueData, recentBookings, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats() as any);
    dispatch(fetchQuickActions() as any);
  }, [dispatch]);

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
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your hotel operations</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <RoomStatusChart data={roomStatusDistribution} />
      </div>

      {/* Recent Bookings and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings bookings={recentBookings} />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;