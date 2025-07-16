import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchRevenueReport } from '../../../store/slices/reportSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Bed, Coffee } from 'lucide-react';

interface RevenueReportProps {
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Revenue Report Component
 * Displays revenue analytics by source and time
 */
const RevenueReport: React.FC<RevenueReportProps> = ({ dateRange }) => {
  const dispatch = useDispatch();
  const { revenueReport, isLoading, error } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchRevenueReport(dateRange) as any);
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
          <p className="text-red-600">Error loading revenue report: {error}</p>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalRevenue = revenueReport.reduce((sum, day) => sum + day.totalRevenue, 0);
  const totalRoomRevenue = revenueReport.reduce((sum, day) => sum + day.roomRevenue, 0);
  const totalFoodRevenue = revenueReport.reduce((sum, day) => sum + day.foodRevenue, 0);
  const totalBeverageRevenue = revenueReport.reduce((sum, day) => sum + day.beverageRevenue, 0);
  const totalOtherRevenue = revenueReport.reduce((sum, day) => sum + day.otherRevenue, 0);
  const totalTaxes = revenueReport.reduce((sum, day) => sum + day.taxes, 0);
  const totalNetRevenue = revenueReport.reduce((sum, day) => sum + day.netRevenue, 0);

  const averageDailyRevenue = revenueReport.length > 0 ? totalRevenue / revenueReport.length : 0;

  // Format data for charts
  const chartData = revenueReport.map(day => ({
    date: format(new Date(day.date), 'MMM dd'),
    roomRevenue: day.roomRevenue,
    foodRevenue: day.foodRevenue,
    beverageRevenue: day.beverageRevenue,
    otherRevenue: day.otherRevenue,
    totalRevenue: day.totalRevenue,
    netRevenue: day.netRevenue
  }));

  // Revenue breakdown for pie chart
  const revenueBreakdown = [
    { name: 'Room Revenue', value: totalRoomRevenue, color: '#3B82F6' },
    { name: 'Food Revenue', value: totalFoodRevenue, color: '#10B981' },
    { name: 'Beverage Revenue', value: totalBeverageRevenue, color: '#F59E0B' },
    { name: 'Other Revenue', value: totalOtherRevenue, color: '#8B5CF6' }
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Report Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Revenue Report</h2>
        <p className="text-gray-600">
          {format(new Date(dateRange.start), 'MMM dd, yyyy')} - {format(new Date(dateRange.end), 'MMM dd, yyyy')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Room Revenue</p>
              <p className="text-2xl font-bold text-green-900">₹{totalRoomRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Bed className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">F&B Revenue</p>
              <p className="text-2xl font-bold text-yellow-900">₹{(totalFoodRevenue + totalBeverageRevenue).toLocaleString()}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Coffee className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Daily Average</p>
              <p className="text-2xl font-bold text-purple-900">₹{averageDailyRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="roomRevenue" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                name="Room Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="foodRevenue" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                name="Food Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="beverageRevenue" 
                stackId="1"
                stroke="#F59E0B" 
                fill="#F59E0B"
                name="Beverage Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="otherRevenue" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                name="Other Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Summary Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-900">Room Revenue</span>
              <span className="font-bold text-blue-900">₹{totalRoomRevenue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Food Revenue</span>
              <span className="font-bold text-green-900">₹{totalFoodRevenue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-900">Beverage Revenue</span>
              <span className="font-bold text-yellow-900">₹{totalBeverageRevenue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-900">Other Revenue</span>
              <span className="font-bold text-purple-900">₹{totalOtherRevenue.toLocaleString()}</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-900">Total Taxes</span>
                <span className="font-bold text-gray-900">₹{totalTaxes.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-900 text-white rounded-lg mt-2">
                <span className="font-medium">Net Revenue</span>
                <span className="font-bold">₹{totalNetRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Revenue Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Food Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beverage Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Other Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueReport.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(new Date(day.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{day.roomRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{day.foodRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{day.beverageRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{day.otherRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{day.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{day.netRevenue.toLocaleString()}
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

export default RevenueReport;