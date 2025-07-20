/*
  # Create guests table for guest management

  1. New Tables
    - `guests`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `id_proof_type` (text)
      - `id_proof_number` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `guests` table
    - Add policies for authenticated users to manage guests
*/

CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text,
  id_proof_type text NOT NULL DEFAULT 'passport',
  id_proof_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT guests_id_proof_type_check CHECK (id_proof_type IN ('passport', 'drivers_license', 'national_id', 'other'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS guests_email_idx ON guests(email);
CREATE INDEX IF NOT EXISTS guests_phone_idx ON guests(phone);
CREATE INDEX IF NOT EXISTS guests_name_idx ON guests(first_name, last_name);

-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage guests"
  ON guests
  FOR ALL
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();