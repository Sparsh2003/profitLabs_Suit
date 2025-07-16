import React from 'react';
import { Users, UserCheck, UserX, Bed, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  stats: any;
}

/**
 * Stats Cards Component
 * Displays key metrics in card format
 */
const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: "Today's Check-outs",
      value: stats.todayCheckOuts,
      icon: UserX,
      color: 'bg-blue-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Occupied Rooms',
      value: stats.occupiedRooms,
      icon: Bed,
      color: 'bg-purple-500',
      change: `${stats.occupancyRate}%`,
      changeType: 'neutral'
    },
    {
      title: 'Available Rooms',
      value: stats.availableRooms,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: `${stats.totalRooms} total`,
      changeType: 'neutral'
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 
                    card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {card.change}
                  </span>
                  {card.changeType !== 'neutral' && (
                    <span className="text-xs text-gray-500 ml-1">from yesterday</span>
                  )}
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;