import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Bed, Calendar, Download } from 'lucide-react';
import OccupancyReport from './components/OccupancyReport';
import RevenueReport from './components/RevenueReport';
import GuestReport from './components/GuestReport';
import RoomReport from './components/RoomReport';

/**
 * Reports Page Component
 * Analytics and reporting dashboard
 */
const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState('occupancy');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  });

  const reportTypes = [
    {
      id: 'occupancy',
      name: 'Occupancy Report',
      icon: Bed,
      description: 'Room occupancy rates and trends'
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      icon: TrendingUp,
      description: 'Revenue analysis by source and time'
    },
    {
      id: 'guests',
      name: 'Guest Report',
      icon: Users,
      description: 'Guest demographics and behavior'
    },
    {
      id: 'rooms',
      name: 'Room Report',
      icon: Bed,
      description: 'Room performance and maintenance'
    }
  ];

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const renderActiveReport = () => {
    const reportProps = { dateRange };
    
    switch (activeReport) {
      case 'occupancy':
        return <OccupancyReport {...reportProps} />;
      case 'revenue':
        return <RevenueReport {...reportProps} />;
      case 'guests':
        return <GuestReport {...reportProps} />;
      case 'rooms':
        return <RoomReport {...reportProps} />;
      default:
        return <OccupancyReport {...reportProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Insights into your hotel performance</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  activeReport === report.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activeReport === report.id ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      activeReport === report.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      activeReport === report.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {report.name}
                    </h3>
                    <p className={`text-sm ${
                      activeReport === report.id ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {report.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                setDateRange({
                  start: lastWeek.toISOString().split('T')[0],
                  end: today.toISOString().split('T')[0]
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Last 7 days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                setDateRange({
                  start: lastMonth.toISOString().split('T')[0],
                  end: today.toISOString().split('T')[0]
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Last 30 days
            </button>
          </div>
        </div>
      </div>

      {/* Active Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderActiveReport()}
      </div>
    </div>
  );
};

export default Reports;