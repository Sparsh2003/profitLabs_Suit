import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchPOSItems, addToCart, clearCart } from '../../store/slices/posSlice';
import { Plus, ShoppingCart, Grid, List } from 'lucide-react';
import POSItemGrid from './components/POSItemGrid';
import POSCart from './components/POSCart';
import NewItemModal from './components/NewItemModal';

/**
 * POS Page Component
 * Point of Sale system for restaurant and ancillary services
 */
const POS: React.FC = () => {
  const dispatch = useDispatch();
  const { items, cart, categories, filters, isLoading, error } = useSelector((state: RootState) => state.pos);
  
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchPOSItems() as any);
  }, [dispatch]);

  const handleAddToCart = (item: any, quantity: number = 1) => {
    const cartItem = {
      item,
      quantity,
      selectedVariant: null,
      selectedAddOns: [],
      subtotal: item.price * quantity,
      taxAmount: (item.price * quantity) * (item.taxRate / 100),
      total: (item.price * quantity) + ((item.price * quantity) * (item.taxRate / 100))
    };
    
    dispatch(addToCart(cartItem));
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const cartTotal = cart.reduce((total, item) => total + item.total, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error loading POS items: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Restaurant and ancillary services</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNewItemModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedCategory === 'all' ? 'All Items' : selectedCategory.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredItems.length} items available
              </p>
            </div>
            
            <POSItemGrid 
              items={filteredItems}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Current Order</h2>
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{cartItemCount} items</span>
                </div>
              </div>
              {cartTotal > 0 && (
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">₹{cartTotal.toFixed(2)}</p>
                </div>
              )}
            </div>
            
            <POSCart />
          </div>
        </div>
      </div>

      {/* New Item Modal */}
      {showNewItemModal && (
        <NewItemModal 
          onClose={() => setShowNewItemModal(false)}
          onSuccess={() => {
            setShowNewItemModal(false);
            dispatch(fetchPOSItems() as any);
          }}
        />
      )}
    </div>
  );
};

export default POS;