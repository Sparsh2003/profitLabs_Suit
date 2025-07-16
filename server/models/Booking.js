import mongoose from 'mongoose';

/**
 * Booking Schema for Hotel Reservations
 * Comprehensive booking management with guest and room relationships
 */
const bookingSchema = mongoose.Schema({
  bookingNumber: {
    type: String,
    required: [true, 'Booking number is required'],
    unique: true,
    trim: true
  },
  
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: [true, 'Guest is required']
  },
  
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room is required']
  },
  
  dates: {
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    actualCheckIn: Date,
    actualCheckOut: Date,
    earlyCheckIn: {
      type: Boolean,
      default: false
    },
    lateCheckOut: {
      type: Boolean,
      default: false
    }
  },
  
  occupancy: {
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'At least 1 adult required']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children count cannot be negative']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants count cannot be negative']
    }
  },
  
  pricing: {
    roomRate: {
      type: Number,
      required: [true, 'Room rate is required'],
      min: [0, 'Room rate cannot be negative']
    },
    totalNights: {
      type: Number,
      required: [true, 'Total nights is required'],
      min: [1, 'Minimum 1 night required']
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    taxes: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    }
  },
  
  source: {
    type: String,
    enum: ['walk_in', 'phone', 'email', 'website', 'ota', 'agent', 'corporate'],
    required: [true, 'Booking source is required']
  },
  
  otaDetails: {
    otaName: String,
    otaBookingId: String,
    commission: {
      type: Number,
      default: 0
    },
    commissionType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  
  status: {
    current: {
      type: String,
      enum: ['confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
      default: 'confirmed'
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
  
  payments: [{
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'online'],
      required: [true, 'Payment method is required']
    },
    reference: String,
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receivedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  specialRequests: [{
    request: String,
    fulfilled: {
      type: Boolean,
      default: false
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fulfilledAt: Date,
    notes: String
  }],
  
  companions: [{
    name: String,
    age: Number,
    relation: String,
    idType: String,
    idNumber: String
  }],
  
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    cancellationFee: {
      type: Number,
      default: 0
    }
  },
  
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isImportant: {
      type: Boolean,
      default: false
    }
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ 'dates.checkIn': 1 });
bookingSchema.index({ 'dates.checkOut': 1 });
bookingSchema.index({ 'status.current': 1 });
bookingSchema.index({ source: 1 });

/**
 * Generate unique booking number
 * @returns {string} - Unique booking number
 */
bookingSchema.statics.generateBookingNumber = function() {
  const prefix = 'BK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

/**
 * Calculate total nights between check-in and check-out
 * @returns {number} - Number of nights
 */
bookingSchema.methods.calculateTotalNights = function() {
  const checkIn = new Date(this.dates.checkIn);
  const checkOut = new Date(this.dates.checkOut);
  const timeDiff = checkOut - checkIn;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

/**
 * Calculate total amount paid
 * @returns {number} - Total amount paid
 */
bookingSchema.methods.getTotalPaid = function() {
  return this.payments.reduce((total, payment) => total + payment.amount, 0);
};

/**
 * Calculate outstanding balance
 * @returns {number} - Outstanding balance
 */
bookingSchema.methods.getOutstandingBalance = function() {
  return this.pricing.totalAmount - this.getTotalPaid();
};

/**
 * Check if booking can be cancelled
 * @returns {boolean} - True if can be cancelled
 */
bookingSchema.methods.canBeCancelled = function() {
  return ['confirmed'].includes(this.status.current) && !this.cancellation.isCancelled;
};

/**
 * Check if guest can check in
 * @returns {boolean} - True if can check in
 */
bookingSchema.methods.canCheckIn = function() {
  const today = new Date();
  const checkInDate = new Date(this.dates.checkIn);
  return this.status.current === 'confirmed' && today >= checkInDate;
};

/**
 * Check if guest can check out
 * @returns {boolean} - True if can check out
 */
bookingSchema.methods.canCheckOut = function() {
  return this.status.current === 'checked_in';
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;