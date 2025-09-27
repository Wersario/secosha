-- Update the clothing_items table to support base64 images
-- Run this in your Supabase SQL Editor

-- First, let's check the current schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clothing_items' AND column_name = 'images';

-- If the images column is currently text[], we need to change it to text
-- This will allow us to store base64 encoded images as JSON strings
ALTER TABLE clothing_items 
ALTER COLUMN images TYPE text;

-- Update the RLS policies (if not already created)
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Anyone can view clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can update their own clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can delete their own clothing items" ON clothing_items;

-- Create new policies
CREATE POLICY "Users can insert their own clothing items" ON clothing_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view clothing items" ON clothing_items
FOR SELECT USING (true);

CREATE POLICY "Users can update their own clothing items" ON clothing_items
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothing items" ON clothing_items
FOR DELETE USING (auth.uid() = user_id);

-- Also ensure user_profiles has RLS enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create user_profiles policies
CREATE POLICY "Users can insert their own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view user profiles" ON user_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);
