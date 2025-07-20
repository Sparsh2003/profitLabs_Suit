/*
  # Create bookings table for reservations

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `guest_id` (uuid, foreign key to guests)
      - `room_id` (uuid, foreign key to rooms)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `adults` (integer)
      - `children` (integer)
      - `total_amount` (numeric)
      - `status` (text) - confirmed, checked_in, checked_out, cancelled
      - `booking_source` (text) - walk_in, online, phone, ota
      - `special_requests` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for authenticated users to manage bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  adults integer NOT NULL DEFAULT 1,
  children integer NOT NULL DEFAULT 0,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'confirmed',
  booking_source text NOT NULL DEFAULT 'walk_in',
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT bookings_status_check CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
  CONSTRAINT bookings_source_check CHECK (booking_source IN ('walk_in', 'online', 'phone', 'ota')),
  CONSTRAINT bookings_adults_check CHECK (adults > 0),
  CONSTRAINT bookings_children_check CHECK (children >= 0),
  CONSTRAINT bookings_dates_check CHECK (check_out_date > check_in_date),
  CONSTRAINT bookings_amount_check CHECK (total_amount >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS bookings_guest_id_idx ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS bookings_room_id_idx ON bookings(room_id);
CREATE INDEX IF NOT EXISTS bookings_check_in_date_idx ON bookings(check_in_date);
CREATE INDEX IF NOT EXISTS bookings_check_out_date_idx ON bookings(check_out_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();