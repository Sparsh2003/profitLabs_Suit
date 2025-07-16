import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public (Admin only in production)
 */
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role, phoneNumber, employeeId, department } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'front_desk',
    phoneNumber,
    employeeId,
    department,
    permissions: getDefaultPermissions(role || 'front_desk')
  });
  
  // Generate token
  const token = generateToken(user._id);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      token
    }
  });
}));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Check for user (include password in query)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is disabled. Please contact administrator.'
    });
  }
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Update last login
  await user.updateLastLogin();
  
  // Generate token
  const token = generateToken(user._id);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        lastLogin: user.lastLogin
      },
      token
    }
  });
}));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        phoneNumber: user.phoneNumber,
        employeeId: user.employeeId,
        department: user.department,
        lastLogin: user.lastLogin
      }
    }
  });
}));

/**
 * @route   PUT /api/v1/auth/updateprofile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/updateprofile', protect, asyncHandler(async (req, res) => {
  const { name, phoneNumber } = req.body;
  
  const user = await User.findById(req.user.id);
  
  if (name) user.name = name;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber
      }
    }
  });
}));

/**
 * @route   PUT /api/v1/auth/updatepassword
 * @desc    Update user password
 * @access  Private
 */
router.put('/updatepassword', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current password and new password'
    });
  }
  
  // Get user with password
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

/**
 * Get default permissions based on role
 * @param {string} role - User role
 * @returns {Array} - Array of permissions
 */
const getDefaultPermissions = (role) => {
  const permissions = {
    admin: [
      'view_dashboard', 'manage_reservations', 'manage_rooms', 'manage_guests',
      'manage_pos', 'manage_billing', 'view_reports', 'manage_users', 'manage_settings'
    ],
    manager: [
      'view_dashboard', 'manage_reservations', 'manage_rooms', 'manage_guests',
      'manage_pos', 'manage_billing', 'view_reports'
    ],
    front_desk: [
      'view_dashboard', 'manage_reservations', 'manage_rooms', 'manage_guests',
      'manage_billing'
    ],
    housekeeping: [
      'view_dashboard', 'manage_rooms'
    ],
    restaurant: [
      'view_dashboard', 'manage_pos'
    ]
  };
  
  return permissions[role] || [];
};

export default router;