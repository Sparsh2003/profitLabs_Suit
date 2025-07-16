import React from 'react';
import { Plus, Tag, Clock } from 'lucide-react';

interface POSItemGridProps {
  items: any[];
  onAddToCart: (item: any, quantity: number) => void;
}

/**
 * POS Item Grid Component
 * Displays POS items in a grid layout
 */
const POSItemGrid: React.FC<POSItemGridProps> = ({ items, onAddToCart }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food':
        return 'bg-green-100 text-green-800';
      case 'beverage':
        return 'bg-blue-100 text-blue-800';
      case 'alcohol':
        return 'bg-purple-100 text-purple-800';
      case 'spa':
        return 'bg-pink-100 text-pink-800';
      case 'laundry':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, taxRate: number) => {
    const taxAmount = price * (taxRate / 100);
    const totalPrice = price + taxAmount;
    return {
      basePrice: price,
      taxAmount,
      totalPrice
    };
  };

  return (
    <div className="p-6">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const pricing = formatPrice(item.price, item.taxRate);
            
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Item Image Placeholder */}
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <Tag className="h-8 w-8 text-gray-400" />
                </div>

                {/* Item Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize"
                        >
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Availability */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {item.availability.isAvailable ? 'Available' : 'Unavailable'}
                      {item.availability.availableFrom !== '00:00' && 
                       item.availability.availableTo !== '23:59' && (
                        <span className="ml-1">
                          ({item.availability.availableFrom} - {item.availability.availableTo})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Base Price:</span>
                      <span className="text-sm text-gray-900">₹{pricing.basePrice.toFixed(2)}</span>
                    </div>
                    {pricing.taxAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Tax ({item.taxRate}%):</span>
                        <span className="text-xs text-gray-500">₹{pricing.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-1">
                      <span className="text-sm font-medium text-gray-900">Total:</span>
                      <span className="text-sm font-bold text-gray-900">₹{pricing.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => onAddToCart(item, 1)}
                    disabled={!item.availability.isAvailable || !item.isActive}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default POSItemGrid;