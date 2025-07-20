import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  room_type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  floor: number;
  capacity: number;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out_of_order';
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  id_proof_type: string;
  id_proof_number: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  total_amount: number;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  booking_source: 'walk_in' | 'online' | 'phone' | 'ota';
  special_requests: string;
  created_at: string;
  updated_at: string;
}