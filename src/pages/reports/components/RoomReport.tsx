import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchRoomReport } from '../../../store/slices/reportSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Bed, TrendingUp, Settings, Clock } from 'lucide-react';

interface RoomReportProps {
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Room Report Component
 * Displays room performance and maintenance analytics
 */
const RoomReport: React.FC<RoomReportProps> = ({ dateRange }) => {
  const dispatch = useDispatch();
  const { roomReport, isLoading, error } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchRoomReport(dateRange) as any);
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
          <p className="text-red-600">Error loading room report: {error}</p>
        </div>
      </div>
    );
  }

  if (!roomReport) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No room data available for the selected period.</p>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalRooms = roomReport.roomUtilization.length;
  const averageOccupancy = totalRooms > 0 
    ? roomReport.roomUtilization.reduce((sum, room) => sum + room.occupancyRate, 0) / totalRooms 
    : 0;
  const totalRevenue = roomReport.roomUtilization.reduce((sum, room) => sum + room.revenue, 0);
  const totalMaintenanceHours = roomReport.roomUtilization.reduce((sum, room) => sum + room.maintenanceHours, 0);

  // Best and worst performing rooms
  const bestPerformingRoom = roomReport.roomUtilization.reduce((best, room) => 
    room.occupancyRate > best.occupancyRate ? room : best, roomReport.roomUtilization[0] || {});
  const worstPerformingRoom = roomReport.roomUtilization.reduce((worst, room) => 
    room.occupancyRate < worst.occupancyRate ? room : worst, roomReport.roomUtilization[0] || {});

  return (
    <div className="p-6 space-y-6">
      {/* Report Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Room Performance Report</h2>
        <p className="text-gray-600">Room utilization, performance, and maintenance analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Rooms</p>
              <p className="text-2xl font-bold text-blue-900">{totalRooms}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Occupancy</p>
              <p className="text-2xl font-bold text-green-900">{averageOccupancy.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
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
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Maintenance Hours</p>
              <p className="text-2xl font-bold text-red-900">{totalMaintenanceHours}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <Settings className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Room Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Occupancy Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Room Occupancy Rates</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomReport.roomUtilization} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="roomNumber" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
                <Bar dataKey="occupancyRate" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Room Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomReport.roomUtilization} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="roomNumber" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Room Type Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Room Type Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomReport.roomTypePerformance.map((roomType, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {roomType.roomType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {roomType.totalRooms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      roomType.averageOccupancy >= 80 
                        ? 'bg-green-100 text-green-800'
                        : roomType.averageOccupancy >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {roomType.averageOccupancy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{roomType.averageRate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{roomType.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Housekeeping Efficiency */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Housekeeping Efficiency</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roomReport.housekeepingEfficiency} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="roomsCleaned" fill="#3B82F6" name="Rooms Cleaned" />
              <Line yAxisId="right" type="monotone" dataKey="averageCleaningTime" stroke="#10B981" strokeWidth={2} name="Avg Cleaning Time (min)" />
              <Line yAxisId="right" type="monotone" dataKey="maintenanceIssues" stroke="#EF4444" strokeWidth={2} name="Maintenance Issues" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top and Bottom Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-4">Best Performing Room</h3>
          {bestPerformingRoom && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Room Number:</span>
                <span className="font-medium text-green-900">{bestPerformingRoom.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Room Type:</span>
                <span className="font-medium text-green-900 capitalize">{bestPerformingRoom.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Occupancy Rate:</span>
                <span className="font-medium text-green-900">{bestPerformingRoom.occupancyRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Revenue:</span>
                <span className="font-medium text-green-900">₹{bestPerformingRoom.revenue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 mb-4">Needs Attention</h3>
          {worstPerformingRoom && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-700">Room Number:</span>
                <span className="font-medium text-red-900">{worstPerformingRoom.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Room Type:</span>
                <span className="font-medium text-red-900 capitalize">{worstPerformingRoom.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Occupancy Rate:</span>
                <span className="font-medium text-red-900">{worstPerformingRoom.occupancyRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Maintenance Hours:</span>
                <span className="font-medium text-red-900">{worstPerformingRoom.maintenanceHours}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Individual Room Performance Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Individual Room Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomReport.roomUtilization.map((room, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {room.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {room.roomType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      room.occupancyRate >= 80 
                        ? 'bg-green-100 text-green-800'
                        : room.occupancyRate >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {room.occupancyRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{room.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {room.maintenanceHours}h
                    </div>
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

export default RoomReport;