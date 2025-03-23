import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables to prevent silent failures
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!', {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  });

  // Fallback to empty strings but log the error
  console.warn(
    'Falling back to empty strings for Supabase credentials - expect connection errors',
  );
}

// Create client with connection timeout and auto-retries
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      const [resource, config] = args;
      // Add a timeout to the fetch request
      return fetch(resource, {
        ...config,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    },
  },
});

export default supabase;
