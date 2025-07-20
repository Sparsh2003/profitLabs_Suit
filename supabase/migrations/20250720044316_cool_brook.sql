/*
  # Create rooms table for hotel room management

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `room_number` (text, unique)
      - `room_type` (text) - standard, deluxe, suite, presidential
      - `floor` (integer)
      - `capacity` (integer)
      - `price_per_night` (numeric)
      - `status` (text) - available, occupied, maintenance, cleaning, out_of_order
      - `amenities` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `rooms` table
    - Add policies for authenticated users to read rooms
    - Add policies for staff to manage rooms
*/

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number text UNIQUE NOT NULL,
  room_type text NOT NULL DEFAULT 'standard',
  floor integer NOT NULL DEFAULT 1,
  capacity integer NOT NULL DEFAULT 2,
  price_per_night numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT rooms_room_type_check CHECK (room_type IN ('standard', 'deluxe', 'suite', 'presidential')),
  CONSTRAINT rooms_status_check CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'out_of_order')),
  CONSTRAINT rooms_floor_check CHECK (floor > 0),
  CONSTRAINT rooms_capacity_check CHECK (capacity > 0),
  CONSTRAINT rooms_price_check CHECK (price_per_night >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS rooms_room_number_idx ON rooms(room_number);
CREATE INDEX IF NOT EXISTS rooms_status_idx ON rooms(status);
CREATE INDEX IF NOT EXISTS rooms_room_type_idx ON rooms(room_type);
CREATE INDEX IF NOT EXISTS rooms_floor_idx ON rooms(floor);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage rooms"
  ON rooms
  FOR ALL
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, floor, capacity, price_per_night, status, amenities) VALUES
  ('101', 'standard', 1, 2, 2500, 'available', '{"wifi", "tv", "ac"}'),
  ('102', 'standard', 1, 2, 2500, 'occupied', '{"wifi", "tv", "ac"}'),
  ('103', 'deluxe', 1, 3, 3500, 'cleaning', '{"wifi", "tv", "ac", "minibar"}'),
  ('201', 'deluxe', 2, 3, 3500, 'available', '{"wifi", "tv", "ac", "minibar"}'),
  ('202', 'suite', 2, 4, 5500, 'maintenance', '{"wifi", "tv", "ac", "minibar", "balcony"}'),
  ('301', 'presidential', 3, 6, 8500, 'available', '{"wifi", "tv", "ac", "minibar", "balcony", "jacuzzi"}');