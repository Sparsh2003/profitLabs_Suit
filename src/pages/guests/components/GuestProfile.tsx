import React from 'react';
import { format } from 'date-fns';
import { User, Mail, Phone, MapPin, CreditCard, Star, AlertTriangle, Calendar, DollarSign, MessageSquare } from 'lucide-react';

interface GuestProfileProps {
  guest: any;
}

/**
 * Guest Profile Component
 * Displays detailed guest information and history
 */
const GuestProfile: React.FC<GuestProfileProps> = ({ guest }) => {
  if (!guest) {
    return (
      <div className="p-6 text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Select a guest to view their profile</p>
      </div>
    );
  }

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="p-6">
      {/* Guest Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {guest.personalInfo.firstName} {guest.personalInfo.lastName}
        </h2>
        <div className="flex items-center justify-center space-x-2 mt-2">
          {guest.companyInfo?.isVip && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1" />
              VIP {guest.companyInfo.vipTier}
            </span>
          )}
          {guest.blacklisted?.isBlacklisted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Blacklisted
            </span>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900">{guest.personalInfo.email}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900">{guest.personalInfo.phone}</span>
          </div>
          
          {guest.address?.city && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900">
                {guest.address.city}, {guest.address.country}
              </span>
            </div>
          )}
          
          {guest.personalInfo.nationality && (
            <div className="text-sm">
              <span className="text-gray-500">Nationality: </span>
              <span className="text-gray-900">{guest.personalInfo.nationality}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loyalty Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Loyalty Program</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Tier</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getLoyaltyTierColor(guest.loyaltyInfo.tier)}`}>
              {guest.loyaltyInfo.tier}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Points</span>
            <span className="text-sm font-medium text-gray-900">{guest.loyaltyInfo.points}</span>
          </div>
          
          {guest.loyaltyInfo.loyaltyNumber && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Loyalty Number</span>
              <span className="text-sm font-medium text-gray-900">{guest.loyaltyInfo.loyaltyNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Stay Statistics</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{guest.statistics.totalBookings}</div>
            <div className="text-xs text-gray-500">Total Stays</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-gray-900">₹{guest.statistics.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Average Stay</span>
            <span className="text-gray-900">{guest.statistics.averageStayDuration} days</span>
          </div>
          
          {guest.statistics.lastStayDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Stay</span>
              <span className="text-gray-900">{format(new Date(guest.statistics.lastStayDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {guest.statistics.favouriteRoomType && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Preferred Room</span>
              <span className="text-gray-900 capitalize">{guest.statistics.favouriteRoomType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Preferences */}
      {guest.preferences && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Preferences</h3>
          
          <div className="space-y-2">
            {guest.preferences.roomType && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Room Type</span>
                <span className="text-gray-900 capitalize">{guest.preferences.roomType}</span>
              </div>
            )}
            
            {guest.preferences.bedType && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Bed Type</span>
                <span className="text-gray-900 capitalize">{guest.preferences.bedType}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Smoking</span>
              <span className="text-gray-900 capitalize">{guest.preferences.smokingPreference}</span>
            </div>
            
            {guest.preferences.specialRequests?.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500">Special Requests:</span>
                <div className="mt-1 space-y-1">
                  {guest.preferences.specialRequests.map((request: string, index: number) => (
                    <div key={index} className="text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded">
                      {request}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      {guest.notes && guest.notes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Recent Notes</h3>
          
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {guest.notes.slice(0, 3).map((note: any) => (
              <div key={note.id} className="text-sm">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-3 w-3 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-900">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(note.addedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          View Full Profile
        </button>
        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
          Add Note
        </button>
      </div>
    </div>
  );
};

export default GuestProfile;