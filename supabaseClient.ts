import { createClient } from '@supabase/supabase-js';

// Ensure the environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Error handling if env variables are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
