import React, { useState } from 'react';
import { X, Tag, DollarSign, Clock, Settings } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createPOSItem } from '../../../store/slices/posSlice';

interface NewItemModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * New Item Modal Component
 * Form for creating new POS items
 */
const NewItemModal: React.FC<NewItemModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'food',
    subcategory: '',
    price: 0,
    currency: 'INR',
    taxRate: 5,
    unit: 'piece',
    
    // Availability
    isAvailable: true,
    availableFrom: '00:00',
    availableTo: '23:59',
    availableDays: [] as string[],
    
    // Features
    tags: [] as string[],
    
    // Inventory
    trackInventory: false,
    currentStock: 0,
    minStock: 0,
    maxStock: 0
  });

  const categories = [
    { value: 'food', label: 'Food' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'alcohol', label: 'Alcohol' },
    { value: 'spa', label: 'Spa' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'telephone', label: 'Telephone' },
    { value: 'internet', label: 'Internet' },
    { value: 'other', label: 'Other' }
  ];

  const units = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'gram', label: 'Gram' },
    { value: 'liter', label: 'Liter' },
    { value: 'ml', label: 'Milliliter' },
    { value: 'hour', label: 'Hour' },
    { value: 'service', label: 'Service' }
  ];

  const availableTags = [
    'vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'spicy', 
    'popular', 'chef_special', 'new'
  ];

  const weekDays = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      price: formData.price,
      currency: formData.currency,
      taxRate: formData.taxRate,
      unit: formData.unit,
      availability: {
        isAvailable: formData.isAvailable,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
        availableDays: formData.availableDays
      },
      tags: formData.tags,
      inventory: {
        trackInventory: formData.trackInventory,
        currentStock: formData.trackInventory ? formData.currentStock : 0,
        minStock: formData.trackInventory ? formData.minStock : 0,
        maxStock: formData.trackInventory ? formData.maxStock : 0
      },
      statistics: {
        totalSold: 0,
        totalRevenue: 0,
        popularity: 0
      },
      isActive: true
    };

    try {
      await dispatch(createPOSItem(itemData) as any);
      onSuccess();
    } catch (error) {
      console.error('Failed to create POS item:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Chicken Biryani"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Main Course, Appetizer"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the item..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  step="0.1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Availability</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Currently Available</span>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available From
                  </label>
                  <input
                    type="time"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available To
                  </label>
                  <input
                    type="time"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days (leave empty for all days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {weekDays.map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-1 text-xs text-gray-700 capitalize">
                        {day.slice(0, 3)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Tags & Features</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableTags.map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-1 text-xs text-gray-700 capitalize">
                      {tag.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="trackInventory"
                checked={formData.trackInventory}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Track Inventory</span>
            </label>
            
            {formData.trackInventory && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Stock
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Stock
                  </label>
                  <input
                    type="number"
                    name="maxStock"
                    value={formData.maxStock}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewItemModal;