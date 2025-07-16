import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RoomStatusChartProps {
  data: any[];
}

/**
 * Room Status Chart Component
 * Displays room status distribution as a pie chart
 */
const RoomStatusChart: React.FC<RoomStatusChartProps> = ({ data }) => {
  // Color mapping for room statuses
  const statusColors = {
    available: '#10B981',
    occupied: '#3B82F6',
    dirty: '#F59E0B',
    clean: '#8B5CF6',
    maintenance: '#EF4444',
    out_of_order: '#6B7280'
  };

  // Format data for chart
  const chartData = data.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1).replace('_', ' '),
    value: item.count,
    color: statusColors[item._id as keyof typeof statusColors] || '#6B7280'
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Room Status Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Rooms']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoomStatusChart;