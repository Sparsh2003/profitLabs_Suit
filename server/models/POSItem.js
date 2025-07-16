import mongoose from 'mongoose';

/**
 * POS Item Schema for Point of Sale System
 * Manages menu items and services for restaurant, spa, etc.
 */
const posItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'beverage', 'alcohol', 'spa', 'laundry', 'telephone', 'internet', 'other']
  },
  
  subcategory: {
    type: String,
    trim: true
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  
  taxRate: {
    type: Number,
    default: 5, // 5% GST for food items
    min: [0, 'Tax rate cannot be negative']
  },
  
  unit: {
    type: String,
    enum: ['piece', 'kg', 'gram', 'liter', 'ml', 'hour', 'service'],
    default: 'piece'
  },
  
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: String, // Time in HH:MM format
      default: '00:00'
    },
    availableTo: {
      type: String, // Time in HH:MM format
      default: '23:59'
    },
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  
  ingredients: [{
    name: String,
    allergen: Boolean
  }],
  
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number
  },
  
  variants: [{
    name: String,
    price: Number,
    description: String
  }],
  
  addOns: [{
    name: String,
    price: Number,
    category: String
  }],
  
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  tags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'spicy', 'popular', 'chef_special', 'new']
  }],
  
  inventory: {
    trackInventory: {
      type: Boolean,
      default: false
    },
    currentStock: {
      type: Number,
      default: 0
    },
    minStock: {
      type: Number,
      default: 0
    },
    maxStock: {
      type: Number,
      default: 0
    }
  },
  
  statistics: {
    totalSold: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    lastSold: Date,
    popularity: {
      type: Number,
      default: 0
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
posItemSchema.index({ name: 1 });
posItemSchema.index({ category: 1 });
posItemSchema.index({ subcategory: 1 });
posItemSchema.index({ price: 1 });
posItemSchema.index({ 'availability.isAvailable': 1 });
posItemSchema.index({ isActive: 1 });

/**
 * Calculate total price including tax
 * @returns {number} - Total price with tax
 */
posItemSchema.methods.calculateTotalPrice = function() {
  const taxAmount = this.price * (this.taxRate / 100);
  return this.price + taxAmount;
};

/**
 * Check if item is available at current time
 * @returns {boolean} - True if available
 */
posItemSchema.methods.isCurrentlyAvailable = function() {
  if (!this.availability.isAvailable || !this.isActive) {
    return false;
  }
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  // Check if current day is in available days
  if (this.availability.availableDays.length > 0 && 
      !this.availability.availableDays.includes(currentDay)) {
    return false;
  }
  
  // Check if current time is within available hours
  if (currentTime < this.availability.availableFrom || 
      currentTime > this.availability.availableTo) {
    return false;
  }
  
  return true;
};

/**
 * Update statistics after sale
 * @param {number} quantity - Quantity sold
 * @param {number} revenue - Revenue generated
 */
posItemSchema.methods.updateStatistics = async function(quantity, revenue) {
  this.statistics.totalSold += quantity;
  this.statistics.totalRevenue += revenue;
  this.statistics.lastSold = new Date();
  
  // Update inventory if tracking is enabled
  if (this.inventory.trackInventory) {
    this.inventory.currentStock -= quantity;
  }
  
  await this.save();
};

/**
 * Check if item is low in stock
 * @returns {boolean} - True if low stock
 */
posItemSchema.methods.isLowStock = function() {
  return this.inventory.trackInventory && 
         this.inventory.currentStock <= this.inventory.minStock;
};

const POSItem = mongoose.model('POSItem', posItemSchema);

export default POSItem;