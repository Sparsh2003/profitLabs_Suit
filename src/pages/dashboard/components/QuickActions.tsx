import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { UserPlus, UserMinus, Bed, Settings } from 'lucide-react';

/**
 * Quick Actions Component
 * Displays quick action buttons and pending tasks
 */
const QuickActions: React.FC = () => {
  const { pendingCheckIns, pendingCheckOuts, dirtyRooms, maintenanceRooms } = useSelector(
    (state: RootState) => state.dashboard
  );

  const actionItems = [
    {
      title: 'Pending Check-ins',
      count: pendingCheckIns.length,
      icon: UserPlus,
      color: 'bg-green-500',
      action: 'View Check-ins'
    },
    {
      title: 'Pending Check-outs',
      count: pendingCheckOuts.length,
      icon: UserMinus,
      color: 'bg-blue-500',
      action: 'View Check-outs'
    },
    {
      title: 'Dirty Rooms',
      count: dirtyRooms.length,
      icon: Bed,
      color: 'bg-yellow-500',
      action: 'Assign Cleaning'
    },
    {
      title: 'Maintenance Rooms',
      count: maintenanceRooms.length,
      icon: Settings,
      color: 'bg-red-500',
      action: 'Schedule Maintenance'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actionItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`${item.color} p-2 rounded-full`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.count} pending</p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                {item.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;