import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchOccupancyReport } from '../../../store/slices/reportSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { Bed, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface OccupancyReportProps {
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Occupancy Report Component
 * Displays room occupancy analytics and trends
 */
const OccupancyReport: React.FC<OccupancyReportProps> = ({ dateRange }) => {
  const dispatch = useDispatch();
  const { occupancyReport, isLoading, error } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchOccupancyReport(dateRange) as any);
  }, [dispatch, dateRange]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error loading occupancy report: {error}</p>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalDays = occupancyReport.length;
  const averageOccupancy = totalDays > 0 
    ? occupancyReport.reduce((sum, day) => sum + day.occupancyRate, 0) / totalDays 
    : 0;
  const totalRevenue = occupancyReport.reduce((sum, day) => sum + day.revenue, 0);
  const peakOccupancy = Math.max(...occupancyReport.map(day => day.occupancyRate), 0);

  // Format data for charts
  const chartData = occupancyReport.map(day => ({
    date: format(new Date(day.date), 'MMM dd'),
    occupancyRate: day.occupancyRate,
    occupiedRooms: day.occupiedRooms,
    availableRooms: day.availableRooms,
    revenue: day.revenue
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Report Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Occupancy Report</h2>
        <p className="text-gray-600">
          {format(new Date(dateRange.start), 'MMM dd, yyyy')} - {format(new Date(dateRange.end), 'MMM dd, yyyy')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Average Occupancy</p>
              <p className="text-2xl font-bold text-blue-900">{averageOccupancy.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Peak Occupancy</p>
              <p className="text-2xl font-bold text-green-900">{peakOccupancy.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Days</p>
              <p className="text-2xl font-bold text-purple-900">{totalDays}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Total Revenue</p>
              <p className="text-2xl font-bold text-yellow-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Occupancy Trend Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Occupancy Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'occupancyRate' ? `${value}%` : value,
                  name === 'occupancyRate' ? 'Occupancy Rate' : name
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="occupancyRate" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Occupancy Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Distribution Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Room Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupiedRooms" stackId="a" fill="#3B82F6" name="Occupied Rooms" />
              <Bar dataKey="availableRooms" stackId="a" fill="#E5E7EB" name="Available Rooms" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {occupancyReport.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(new Date(day.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.totalRooms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.occupiedRooms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.availableRooms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      day.occupancyRate >= 80 
                        ? 'bg-green-100 text-green-800'
                        : day.occupancyRate >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {day.occupancyRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{day.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OccupancyReport;