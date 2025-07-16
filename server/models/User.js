import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema for Hotel Staff
 * Supports role-based access control (RBAC)
 */
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'front_desk', 'housekeeping', 'restaurant', 'manager'],
    default: 'front_desk'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    enum: ['front_office', 'housekeeping', 'restaurant', 'management', 'maintenance']
  },
  permissions: [{
    type: String,
    enum: [
      'view_dashboard',
      'manage_reservations',
      'manage_rooms',
      'manage_guests',
      'manage_pos',
      'manage_billing',
      'view_reports',
      'manage_users',
      'manage_settings'
    ]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

/**
 * Password hashing middleware
 * Automatically hash password before saving
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Update last login timestamp
 */
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

/**
 * Check if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

export default User;