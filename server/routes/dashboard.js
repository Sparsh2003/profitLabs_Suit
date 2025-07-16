import express from 'express';
import { protect, requirePermission } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Invoice from '../models/Invoice.js';
import Guest from '../models/Guest.js';

const router = express.Router();

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', protect, requirePermission('view_dashboard'), asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  // Get today's check-ins
  const todayCheckIns = await Booking.countDocuments({
    'dates.checkIn': { $gte: startOfDay, $lt: endOfDay },
    'status.current': { $ne: 'cancelled' }
  });
  
  // Get today's check-outs
  const todayCheckOuts = await Booking.countDocuments({
    'dates.checkOut': { $gte: startOfDay, $lt: endOfDay },
    'status.current': 'checked_out'
  });
  
  // Get room statistics
  const totalRooms = await Room.countDocuments({ isActive: true });
  const occupiedRooms = await Room.countDocuments({ 
    'status.current': 'occupied',
    isActive: true
  });
  const availableRooms = await Room.countDocuments({ 
    'status.current': 'available',
    isActive: true
  });
  
  // Get room status distribution
  const roomStatusDistribution = await Room.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$status.current',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get revenue for last 7 days
  const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  const revenueData = await Invoice.aggregate([
    {
      $match: {
        invoiceDate: { $gte: sevenDaysAgo, $lt: endOfDay },
        status: { $in: ['paid', 'partially_paid'] }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$invoiceDate' }
        },
        revenue: { $sum: '$paymentStatus.totalPaid' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  // Get recent bookings
  const recentBookings = await Booking.find({
    'status.current': { $ne: 'cancelled' }
  })
  .populate('guest', 'personalInfo')
  .populate('room', 'roomNumber roomType')
  .sort({ createdAt: -1 })
  .limit(10);
  
  // Get today's revenue
  const todayRevenue = await Invoice.aggregate([
    {
      $match: {
        invoiceDate: { $gte: startOfDay, $lt: endOfDay },
        status: { $in: ['paid', 'partially_paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$paymentStatus.totalPaid' }
      }
    }
  ]);
  
  // Calculate occupancy rate
  const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;
  
  res.json({
    success: true,
    data: {
      stats: {
        todayCheckIns,
        todayCheckOuts,
        totalRooms,
        occupiedRooms,
        availableRooms,
        occupancyRate: parseFloat(occupancyRate),
        todayRevenue: todayRevenue[0]?.totalRevenue || 0
      },
      roomStatusDistribution,
      revenueData,
      recentBookings: recentBookings.map(booking => ({
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        guest: booking.guest.personalInfo.firstName + ' ' + booking.guest.personalInfo.lastName,
        room: booking.room.roomNumber,
        roomType: booking.room.roomType,
        checkIn: booking.dates.checkIn,
        checkOut: booking.dates.checkOut,
        status: booking.status.current,
        totalAmount: booking.pricing.totalAmount
      }))
    }
  });
}));

/**
 * @route   GET /api/v1/dashboard/quick-actions
 * @desc    Get data for quick actions
 * @access  Private
 */
router.get('/quick-actions', protect, requirePermission('view_dashboard'), asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  // Get pending check-ins
  const pendingCheckIns = await Booking.find({
    'dates.checkIn': { $gte: startOfDay, $lt: endOfDay },
    'status.current': 'confirmed'
  })
  .populate('guest', 'personalInfo')
  .populate('room', 'roomNumber roomType')
  .sort({ 'dates.checkIn': 1 });
  
  // Get pending check-outs
  const pendingCheckOuts = await Booking.find({
    'dates.checkOut': { $gte: startOfDay, $lt: endOfDay },
    'status.current': 'checked_in'
  })
  .populate('guest', 'personalInfo')
  .populate('room', 'roomNumber roomType')
  .sort({ 'dates.checkOut': 1 });
  
  // Get dirty rooms
  const dirtyRooms = await Room.find({
    'status.current': 'dirty',
    isActive: true
  }).sort({ roomNumber: 1 });
  
  // Get maintenance rooms
  const maintenanceRooms = await Room.find({
    'status.current': 'maintenance',
    isActive: true
  }).sort({ roomNumber: 1 });
  
  res.json({
    success: true,
    data: {
      pendingCheckIns: pendingCheckIns.map(booking => ({
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        guest: booking.guest.personalInfo.firstName + ' ' + booking.guest.personalInfo.lastName,
        room: booking.room.roomNumber,
        roomType: booking.room.roomType,
        checkIn: booking.dates.checkIn,
        adults: booking.occupancy.adults,
        children: booking.occupancy.children
      })),
      pendingCheckOuts: pendingCheckOuts.map(booking => ({
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        guest: booking.guest.personalInfo.firstName + ' ' + booking.guest.personalInfo.lastName,
        room: booking.room.roomNumber,
        roomType: booking.room.roomType,
        checkOut: booking.dates.checkOut,
        totalAmount: booking.pricing.totalAmount
      })),
      dirtyRooms: dirtyRooms.map(room => ({
        id: room._id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        floor: room.floor,
        lastUpdated: room.status.lastUpdated
      })),
      maintenanceRooms: maintenanceRooms.map(room => ({
        id: room._id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        floor: room.floor,
        maintenanceNotes: room.housekeeping.maintenanceNotes
      }))
    }
  });
}));

export default router;