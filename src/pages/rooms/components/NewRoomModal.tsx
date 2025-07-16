import React, { useState } from 'react';
import { X, Bed, Users, DollarSign, Settings } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createRoom } from '../../../store/slices/roomSlice';

interface NewRoomModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * New Room Modal Component
 * Form for creating new rooms
 */
const NewRoomModal: React.FC<NewRoomModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    roomNumber: '',
    roomType: 'standard',
    floor: 1,
    
    // Capacity
    adults: 2,
    children: 1,
    maxOccupancy: 3,
    
    // Bed Configuration
    bedType: 'queen',
    bedCount: 1,
    
    // Pricing
    baseRate: 0,
    currency: 'INR',
    taxRate: 12,
    
    // Features
    smokingAllowed: false,
    petFriendly: false,
    accessible: false,
    connecting: false,
    
    // Amenities
    amenities: [] as string[],
    
    // Description
    description: ''
  });

  const roomTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'presidential', label: 'Presidential' },
    { value: 'family', label: 'Family' },
    { value: 'accessible', label: 'Accessible' }
  ];

  const bedTypes = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'queen', label: 'Queen' },
    { value: 'king', label: 'King' },
    { value: 'twin', label: 'Twin' },
    { value: 'sofa_bed', label: 'Sofa Bed' }
  ];

  const availableAmenities = [
    'wifi', 'ac', 'tv', 'refrigerator', 'minibar', 'safe', 'balcony',
    'bathroom', 'shower', 'bathtub', 'hairdryer', 'iron', 'coffee_maker',
    'room_service', 'laundry', 'newspaper', 'telephone', 'wake_up_service'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const roomData = {
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      floor: formData.floor,
      capacity: {
        adults: formData.adults,
        children: formData.children,
        maxOccupancy: formData.maxOccupancy
      },
      bedConfiguration: {
        bedType: formData.bedType,
        bedCount: formData.bedCount
      },
      pricing: {
        baseRate: formData.baseRate,
        currency: formData.currency,
        taxRate: formData.taxRate
      },
      features: {
        smokingAllowed: formData.smokingAllowed,
        petFriendly: formData.petFriendly,
        accessible: formData.accessible,
        connecting: formData.connecting
      },
      amenities: formData.amenities,
      status: {
        current: 'available'
      },
      housekeeping: {
        maintenanceRequired: false
      },
      isActive: true
    };

    try {
      await dispatch(createRoom(roomData) as any);
      onSuccess();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-0.5 ml-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Capacity & Beds</span>
            <span>Pricing & Features</span>
            <span>Amenities</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Bed className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., 101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Capacity & Bed Configuration */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Capacity & Bed Configuration</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Occupancy
                  </label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    value={formData.maxOccupancy}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bed Type
                  </label>
                  <select
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {bedTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Beds
                  </label>
                  <input
                    type="number"
                    name="bedCount"
                    value={formData.bedCount}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Features */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Pricing & Features</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Rate (per night)
                  </label>
                  <input
                    type="number"
                    name="baseRate"
                    value={formData.baseRate}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Room Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="smokingAllowed"
                      checked={formData.smokingAllowed}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Smoking Allowed</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="petFriendly"
                      checked={formData.petFriendly}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pet Friendly</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="accessible"
                      checked={formData.accessible}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Accessible</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="connecting"
                      checked={formData.connecting}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Connecting Room</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {amenity.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Create Room
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRoomModal;