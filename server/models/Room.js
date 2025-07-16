import mongoose from 'mongoose';

/**
 * Room Schema for Hotel Room Management
 * Manages room inventory, status, and housekeeping
 */
const roomSchema = mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true,
    maxlength: [10, 'Room number cannot exceed 10 characters']
  },
  
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['standard', 'deluxe', 'suite', 'presidential', 'family', 'accessible']
  },
  
  floor: {
    type: Number,
    required: [true, 'Floor number is required'],
    min: [1, 'Floor must be at least 1']
  },
  
  capacity: {
    adults: {
      type: Number,
      required: [true, 'Adult capacity is required'],
      min: [1, 'Adult capacity must be at least 1']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children capacity cannot be negative']
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'Max occupancy is required']
    }
  },
  
  bedConfiguration: {
    bedType: {
      type: String,
      enum: ['single', 'double', 'queen', 'king', 'twin', 'sofa_bed'],
      required: [true, 'Bed type is required']
    },
    bedCount: {
      type: Number,
      required: [true, 'Bed count is required'],
      min: [1, 'Bed count must be at least 1']
    }
  },
  
  pricing: {
    baseRate: {
      type: Number,
      required: [true, 'Base rate is required'],
      min: [0, 'Base rate cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    taxRate: {
      type: Number,
      default: 12, // 12% GST in India
      min: [0, 'Tax rate cannot be negative']
    }
  },
  
  status: {
    current: {
      type: String,
      enum: ['available', 'occupied', 'dirty', 'clean', 'maintenance', 'out_of_order'],
      default: 'available'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  housekeeping: {
    lastCleaned: Date,
    cleanedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cleaningNotes: String,
    maintenanceRequired: {
      type: Boolean,
      default: false
    },
    maintenanceNotes: String,
    lastMaintenance: Date
  },
  
  amenities: [{
    type: String,
    enum: [
      'wifi', 'ac', 'tv', 'refrigerator', 'minibar', 'safe', 'balcony',
      'bathroom', 'shower', 'bathtub', 'hairdryer', 'iron', 'coffee_maker',
      'room_service', 'laundry', 'newspaper', 'telephone', 'wake_up_service'
    ]
  }],
  
  features: {
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petFriendly: {
      type: Boolean,
      default: false
    },
    accessible: {
      type: Boolean,
      default: false
    },
    connecting: {
      type: Boolean,
      default: false
    },
    connectingRooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    }]
  },
  
  photos: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
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
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ roomType: 1 });
roomSchema.index({ floor: 1 });
roomSchema.index({ 'status.current': 1 });
roomSchema.index({ isActive: 1 });

/**
 * Update room status
 * @param {string} newStatus - New status to set
 * @param {string} userId - ID of user making the change
 */
roomSchema.methods.updateStatus = async function(newStatus, userId) {
  this.status.current = newStatus;
  this.status.lastUpdated = new Date();
  this.status.updatedBy = userId;
  await this.save();
};

/**
 * Mark room as cleaned
 * @param {string} cleanerId - ID of housekeeper
 * @param {string} notes - Cleaning notes
 */
roomSchema.methods.markAsCleaned = async function(cleanerId, notes) {
  this.housekeeping.lastCleaned = new Date();
  this.housekeeping.cleanedBy = cleanerId;
  this.housekeeping.cleaningNotes = notes;
  this.status.current = 'clean';
  this.status.lastUpdated = new Date();
  this.status.updatedBy = cleanerId;
  await this.save();
};

/**
 * Calculate room rate with taxes
 * @returns {number} - Total rate including taxes
 */
roomSchema.methods.calculateTotalRate = function() {
  const baseRate = this.pricing.baseRate;
  const taxAmount = baseRate * (this.pricing.taxRate / 100);
  return baseRate + taxAmount;
};

/**
 * Check if room is available for booking
 * @returns {boolean} - True if room is available
 */
roomSchema.methods.isAvailable = function() {
  return this.status.current === 'available' && this.isActive;
};

const Room = mongoose.model('Room', roomSchema);

export default Room;