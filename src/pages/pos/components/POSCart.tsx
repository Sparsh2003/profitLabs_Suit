import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { removeFromCart, updateCartItemQuantity, clearCart, createOrder, postToRoom } from '../../../store/slices/posSlice';
import { Minus, Plus, Trash2, CreditCard, Home, X } from 'lucide-react';

/**
 * POS Cart Component
 * Displays cart items and handles checkout
 */
const POSCart: React.FC = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.pos);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState<'dine_in' | 'room_service' | 'takeaway'>('dine_in');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    room: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const cartSubtotal = cart.reduce((total, item) => total + item.subtotal, 0);
  const cartTaxAmount = cart.reduce((total, item) => total + item.taxAmount, 0);
  const cartTotal = cart.reduce((total, item) => total + item.total, 0);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(index));
    } else {
      dispatch(updateCartItemQuantity({ index, quantity: newQuantity }));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const orderData = {
      items: cart,
      customer: customerInfo.name ? customerInfo : undefined,
      orderType,
      subtotal: cartSubtotal,
      taxAmount: cartTaxAmount,
      totalAmount: cartTotal,
      paymentMethod,
      paymentStatus: 'paid'
    };

    try {
      await dispatch(createOrder(orderData) as any);
      setShowCheckout(false);
      setCustomerInfo({ name: '', room: '', phone: '' });
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handlePostToRoom = async () => {
    if (cart.length === 0 || !customerInfo.room) return;

    const orderData = {
      items: cart,
      roomNumber: customerInfo.room,
      guestName: customerInfo.name,
      subtotal: cartSubtotal,
      taxAmount: cartTaxAmount,
      totalAmount: cartTotal
    };

    try {
      await dispatch(postToRoom(orderData) as any);
      setShowCheckout(false);
      setCustomerInfo({ name: '', room: '', phone: '' });
    } catch (error) {
      console.error('Failed to post to room:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Your cart is empty</p>
        <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Cart Items */}
      <div className="p-6 space-y-4">
        {cart.map((cartItem, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{cartItem.item.name}</h4>
              <p className="text-xs text-gray-600">₹{cartItem.item.price} each</p>
              {cartItem.taxAmount > 0 && (
                <p className="text-xs text-gray-500">Tax: ₹{cartItem.taxAmount.toFixed(2)}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(index, cartItem.quantity - 1)}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => handleQuantityChange(index, cartItem.quantity + 1)}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">₹{cartItem.total.toFixed(2)}</p>
              <button
                onClick={() => dispatch(removeFromCart(index))}
                className="text-red-600 hover:text-red-800 mt-1"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-gray-200 p-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900">₹{cartSubtotal.toFixed(2)}</span>
        </div>
        {cartTaxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="text-gray-900">₹{cartTaxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-medium border-t pt-2">
          <span className="text-gray-900">Total:</span>
          <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-6 space-y-3">
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Checkout
        </button>
        
        <button
          onClick={() => dispatch(clearCart())}
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'dine_in', label: 'Dine In' },
                    { value: 'room_service', label: 'Room Service' },
                    { value: 'takeaway', label: 'Takeaway' }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setOrderType(type.value as any)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        orderType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>

                {orderType === 'room_service' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.room}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter room number"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="room_charge">Room Charge</option>
                </select>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{cartTaxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-6 space-y-3">
              {orderType === 'room_service' && customerInfo.room ? (
                <button
                  onClick={handlePostToRoom}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Post to Room {customerInfo.room}</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Complete Order</span>
                </button>
              )}
              
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSCart;