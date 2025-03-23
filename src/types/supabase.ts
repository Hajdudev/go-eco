/**
 * Type definition for a Supabase query function
 * This generic type allows for strongly-typed query results
 */
export type SupabaseQueryFunction<T> = () => Promise<T>;

/**
 * Generic Supabase response with data and error
 */
export interface SupabaseResponse<T> {
  data: T;
  error: Error | null;
}

/**
 * Type for Supabase error
 */
export interface SupabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}
