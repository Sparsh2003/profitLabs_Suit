import mongoose from 'mongoose';

/**
 * Guest Schema for Hotel CRM
 * Maintains comprehensive guest information and history
 */
const guestSchema = mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    nationality: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    }
  },
  
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  identification: {
    type: {
      type: String,
      enum: ['passport', 'drivers_license', 'national_id', 'other'],
      required: [true, 'ID type is required']
    },
    number: {
      type: String,
      required: [true, 'ID number is required'],
      trim: true
    },
    issuedBy: String,
    expiryDate: Date
  },
  
  preferences: {
    roomType: {
      type: String,
      enum: ['standard', 'deluxe', 'suite', 'presidential']
    },
    floor: {
      type: String,
      enum: ['low', 'high', 'no_preference']
    },
    bedType: {
      type: String,
      enum: ['single', 'double', 'queen', 'king', 'twin']
    },
    smokingPreference: {
      type: String,
      enum: ['smoking', 'non_smoking'],
      default: 'non_smoking'
    },
    specialRequests: [String],
    dietaryRestrictions: [String],
    allergies: [String]
  },
  
  companyInfo: {
    companyName: String,
    designation: String,
    gstNumber: String,
    isVip: {
      type: Boolean,
      default: false
    },
    vipTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum']
    }
  },
  
  loyaltyInfo: {
    loyaltyNumber: String,
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    }
  },
  
  statistics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageStayDuration: {
      type: Number,
      default: 0
    },
    lastStayDate: Date,
    favouriteRoomType: String,
    frequentCompanions: [{
      name: String,
      relationship: String
    }]
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
  
  blacklisted: {
    isBlacklisted: {
      type: Boolean,
      default: false
    },
    reason: String,
    blacklistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    blacklistedAt: Date
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
guestSchema.index({ 'personalInfo.email': 1 });
guestSchema.index({ 'personalInfo.phone': 1 });
guestSchema.index({ 'identification.number': 1 });
guestSchema.index({ 'companyInfo.gstNumber': 1 });
guestSchema.index({ 'loyaltyInfo.loyaltyNumber': 1 });

/**
 * Virtual for full name
 */
guestSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

/**
 * Update guest statistics after booking
 * @param {number} revenue - Revenue from the booking
 * @param {number} stayDuration - Duration of stay in days
 */
guestSchema.methods.updateStatistics = async function(revenue, stayDuration) {
  this.statistics.totalBookings += 1;
  this.statistics.totalRevenue += revenue;
  this.statistics.lastStayDate = new Date();
  
  // Calculate average stay duration
  const totalStayDays = (this.statistics.averageStayDuration * (this.statistics.totalBookings - 1)) + stayDuration;
  this.statistics.averageStayDuration = totalStayDays / this.statistics.totalBookings;
  
  await this.save();
};

/**
 * Add loyalty points
 * @param {number} points - Points to add
 */
guestSchema.methods.addLoyaltyPoints = async function(points) {
  this.loyaltyInfo.points += points;
  
  // Update tier based on points
  if (this.loyaltyInfo.points >= 10000) {
    this.loyaltyInfo.tier = 'platinum';
  } else if (this.loyaltyInfo.points >= 5000) {
    this.loyaltyInfo.tier = 'gold';
  } else if (this.loyaltyInfo.points >= 2000) {
    this.loyaltyInfo.tier = 'silver';
  }
  
  await this.save();
};

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;