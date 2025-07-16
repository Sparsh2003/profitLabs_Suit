import React from 'react';
import { format } from 'date-fns';
import { Star, AlertTriangle, Phone, Mail } from 'lucide-react';

interface GuestListProps {
  guests: any[];
  onGuestSelect: (guest: any) => void;
  selectedGuest: any;
  searchTerm: string;
}

/**
 * Guest List Component
 * Displays list of guests with search and selection
 */
const GuestList: React.FC<GuestListProps> = ({ guests, onGuestSelect, selectedGuest, searchTerm }) => {
  // Filter guests based on search term
  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.personalInfo.firstName} ${guest.personalInfo.lastName}`.toLowerCase();
    const email = guest.personalInfo.email.toLowerCase();
    const phone = guest.personalInfo.phone.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search) || phone.includes(search);
  });

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'text-purple-600';
      case 'gold':
        return 'text-yellow-600';
      case 'silver':
        return 'text-gray-600';
      default:
        return 'text-bronze-600';
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {filteredGuests.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No guests found matching your search.' : 'No guests found. Add your first guest to get started.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              onClick={() => onGuestSelect(guest)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedGuest?.id === guest.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {guest.personalInfo.firstName} {guest.personalInfo.lastName}
                    </h3>
                    
                    {guest.companyInfo?.isVip && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    
                    {guest.blacklisted?.isBlacklisted && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Mail className="h-3 w-3 mr-1" />
                      {guest.personalInfo.email}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {guest.personalInfo.phone}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      {guest.statistics.totalBookings} bookings • ₹{guest.statistics.totalRevenue.toLocaleString()} revenue
                    </div>
                    <div className={`text-xs font-medium capitalize ${getLoyaltyTierColor(guest.loyaltyInfo.tier)}`}>
                      {guest.loyaltyInfo.tier} ({guest.loyaltyInfo.points} pts)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestList;