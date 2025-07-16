import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchGuestReport } from '../../../store/slices/reportSlice';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, UserPlus, Star, Globe, Clock, Heart } from 'lucide-react';

interface GuestReportProps {
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Guest Report Component
 * Displays guest analytics and demographics
 */
const GuestReport: React.FC<GuestReportProps> = ({ dateRange }) => {
  const dispatch = useDispatch();
  const { guestReport, isLoading, error } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchGuestReport(dateRange) as any);
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
          <p className="text-red-600">Error loading guest report: {error}</p>
        </div>
      </div>
    );
  }

  if (!guestReport) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No guest data available for the selected period.</p>
        </div>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  // Format nationality data for chart
  const nationalityData = guestReport.guestsByNationality.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Report Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Guest Report</h2>
        <p className="text-gray-600">Guest demographics and behavior analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Guests</p>
              <p className="text-2xl font-bold text-blue-900">{guestReport.totalGuests}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">New Guests</p>
              <p className="text-2xl font-bold text-green-900">{guestReport.newGuests}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">VIP Guests</p>
              <p className="text-2xl font-bold text-yellow-900">{guestReport.vipGuests}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Stay Duration</p>
              <p className="text-2xl font-bold text-purple-900">{guestReport.averageStayDuration.toFixed(1)} days</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Type Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{guestReport.newGuests}</div>
              <div className="text-sm text-blue-600">New Guests</div>
              <div className="text-xs text-blue-500 mt-1">
                {((guestReport.newGuests / guestReport.totalGuests) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{guestReport.returningGuests}</div>
              <div className="text-sm text-green-600">Returning Guests</div>
              <div className="text-xs text-green-500 mt-1">
                {((guestReport.returningGuests / guestReport.totalGuests) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Satisfaction</h3>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-3xl font-bold text-gray-900">
                {guestReport.guestSatisfactionScore.toFixed(1)}
              </span>
              <span className="text-lg text-gray-500 ml-1">/5.0</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(guestReport.guestSatisfactionScore / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Average satisfaction score</p>
          </div>
        </div>
      </div>

      {/* Nationality Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Guests by Nationality</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nationalityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nationality, percent }) => `${nationality} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {nationalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nationality Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nationalityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nationality" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Guest Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{guestReport.totalGuests}</div>
            <div className="text-sm text-gray-600">Total Guests</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{guestReport.newGuests}</div>
            <div className="text-sm text-gray-600">New Guests</div>
            <div className="text-xs text-green-600 mt-1">
              {((guestReport.newGuests / guestReport.totalGuests) * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{guestReport.returningGuests}</div>
            <div className="text-sm text-gray-600">Returning Guests</div>
            <div className="text-xs text-blue-600 mt-1">
              {((guestReport.returningGuests / guestReport.totalGuests) * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{guestReport.vipGuests}</div>
            <div className="text-sm text-gray-600">VIP Guests</div>
            <div className="text-xs text-yellow-600 mt-1">
              {((guestReport.vipGuests / guestReport.totalGuests) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Nationality Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Guests by Nationality</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nationality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guestReport.guestsByNationality.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{item.nationality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((item.count / guestReport.totalGuests) * 100).toFixed(1)}%
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

export default GuestReport;