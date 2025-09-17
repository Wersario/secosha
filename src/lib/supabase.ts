import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ClothingItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  color: string;
  category: string;
  condition: string;
  images: string[];
  user_id: string;
  created_at: string;
  // Joined via select(`user_profiles(...)`)
  user_profiles?: {
    full_name: string;
    location?: string;
  } | null;
};

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  location?: string;
  delivery_types: string[];
  bio?: string;
  created_at: string;
};