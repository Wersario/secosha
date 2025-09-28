-- Test script to verify database schema and insert a test item
-- Run this in your Supabase SQL Editor

-- Check if the clothing_items table exists and has the correct structure
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'clothing_items' 
ORDER BY ordinal_position;

-- Test insert with a simple placeholder image
INSERT INTO clothing_items (
  user_id,
  title,
  description,
  price,
  size,
  color,
  category,
  condition,
  images
) VALUES (
  auth.uid(),
  'Test Item',
  'This is a test item to verify database insert works',
  29.99,
  'M',
  'Blue',
  'Tops',
  'Good',
  '["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="]'
);

-- Check if the insert worked
SELECT * FROM clothing_items WHERE title = 'Test Item' ORDER BY created_at DESC LIMIT 1;
