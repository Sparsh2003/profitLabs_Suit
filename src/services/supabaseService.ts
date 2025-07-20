import { supabase } from '../lib/supabase';
import type { User, Room, Guest, Booking } from '../lib/supabase';

// Auth Services
export const authService = {
  async signUp(email: string, password: string, role: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Insert user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, email, role }]);
        
      if (insertError) throw insertError;
    }
    
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      return profile;
    }
    
    return null;
  }
};

// Room Services
export const roomService = {
  async getAllRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number');
      
    if (error) throw error;
    return data;
  },

  async createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([room])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateRoom(id: string, updates: Partial<Room>) {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateRoomStatus(id: string, status: Room['status']) {
    const { data, error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};

// Guest Services
export const guestService = {
  async getAllGuests() {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async createGuest(guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('guests')
      .insert([guest])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateGuest(id: string, updates: Partial<Guest>) {
    const { data, error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async searchGuests(query: string) {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};

// Booking Services
export const bookingService = {
  async getAllBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .single();
      
    if (error) throw error;
    return data;
  },

  async getBookingsForDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .gte('check_in_date', startDate)
      .lte('check_out_date', endDate)
      .neq('status', 'cancelled');
      
    if (error) throw error;
    return data;
  },

  async checkIn(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'checked_in' })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update room status to occupied
    if (data) {
      await roomService.updateRoomStatus(data.room_id, 'occupied');
    }
    
    return data;
  },

  async checkOut(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'checked_out' })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update room status to cleaning
    if (data) {
      await roomService.updateRoomStatus(data.room_id, 'cleaning');
    }
    
    return data;
  }
};

// Dashboard Services
export const dashboardService = {
  async getDashboardStats() {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Get total rooms
    const { count: totalRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true });
    
    // Get occupied rooms
    const { count: occupiedRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'occupied');
    
    // Get today's check-ins
    const { count: todayCheckIns } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('check_in_date', today)
      .neq('status', 'cancelled');
    
    // Get today's check-outs
    const { count: todayCheckOuts } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('check_out_date', today)
      .eq('status', 'checked_out');
    
    // Calculate occupancy rate
    const occupancyRate = totalRooms ? ((occupiedRooms || 0) / totalRooms) * 100 : 0;
    
    return {
      totalRooms: totalRooms || 0,
      occupiedRooms: occupiedRooms || 0,
      availableRooms: (totalRooms || 0) - (occupiedRooms || 0),
      todayCheckIns: todayCheckIns || 0,
      todayCheckOuts: todayCheckOuts || 0,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      todayRevenue: 0 // This would be calculated from actual bookings/payments
    };
  },

  async getRoomStatusDistribution() {
    const { data, error } = await supabase
      .from('rooms')
      .select('status')
      .order('status');
      
    if (error) throw error;
    
    // Group by status
    const distribution = data.reduce((acc: any, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(distribution).map(([status, count]) => ({
      _id: status,
      count
    }));
  },

  async getRecentBookings(limit = 10) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        guest:guests(first_name, last_name),
        room:rooms(room_number, room_type)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data.map(booking => ({
      id: booking.id,
      bookingNumber: `BK${booking.id.slice(-6).toUpperCase()}`,
      guest: `${booking.guest.first_name} ${booking.guest.last_name}`,
      room: booking.room.room_number,
      roomType: booking.room.room_type,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      status: booking.status,
      totalAmount: booking.total_amount
    }));
  }
};