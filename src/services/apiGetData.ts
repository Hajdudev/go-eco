'use server';
import supabase from './supabaseClient';

import { Stop, StopTime, Trip, ShapePoint, CalendarDate } from '../types/gtfs';
import { User } from '@/types/session';

// Helper function to handle Supabase query errors with retries
async function executeSupabaseQuery(queryFn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await queryFn();
      return result;
    } catch (error) {
      console.error(`Query attempt ${attempt + 1} failed:`, error);
      lastError = error;

      // Wait before retrying
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export async function getTodayCalendar(): Promise<
  CalendarDate[] | CalendarDate
> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('calendar_dates')
        .select('service_id, date')
        .eq('date', formattedDate),
    );

    if (error) {
      console.error('Error fetching today calendar:', error);
      return { service_id: '', date: '' };
    }

    return data.length > 0
      ? data.map((data) => data)
      : { service_id: '', date: '' };
  } catch (error) {
    console.error('Unexpected error in getTodayCalendar:', error);
    return { service_id: '', date: '' };
  }
}

// Fixed function to properly handle user recent routes
export async function setUserRecentRoute(
  from: string,
  to: string,
  user: User | null,
) {
  // Check if user exists - don't proceed if no user
  if (!user || !user.email) {
    console.error(
      'Cannot save route: No user is logged in or email is missing',
    );
    return;
  }

  try {
    // First, check if user exists in the database
    const { data: existingUser, error: fetchError } =
      await executeSupabaseQuery(() =>
        supabase.from('users').select('*').eq('email', user.email).single(),
      );

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if user exists:', fetchError);
      return;
    }

    // Format the route for storage
    const routeString = `${from} → ${to}`;

    // Create/update user with route
    if (!existingUser) {
      // User doesn't exist, create a new record
      const { error: insertError } = await executeSupabaseQuery(() =>
        supabase.from('users').insert([
          {
            email: user.email,
            name: user.name,
            image: user.image,
            recent_rides: [routeString],
          },
        ]),
      );

      if (insertError) {
        console.error('Error creating user record:', insertError);
      }
    } else {
      // User exists, update their recent routes
      let updatedRoutes = existingUser.recent_rides || [];

      // Add new route to beginning, limit to 5 most recent routes
      if (Array.isArray(updatedRoutes)) {
        // Remove the route if it already exists to avoid duplicates
        updatedRoutes = updatedRoutes.filter((route) => route !== routeString);
        // Add the new route to the beginning
        updatedRoutes.unshift(routeString);
        // Limit to max 7 routes
        updatedRoutes = updatedRoutes.slice(0, 7);
      } else {
        // Handle case where recent_rides is not an array
        updatedRoutes = [routeString];
      }

      const { error: updateError } = await executeSupabaseQuery(() =>
        supabase
          .from('users')
          .update({ recent_rides: updatedRoutes })
          .eq('email', user.email),
      );

      if (updateError) {
        console.error('Error updating user routes:', updateError);
      }
    }
  } catch (error) {
    console.error('Unexpected error in setUserRecentRoute:', error);
  }
}

export async function getUserData(email: string): Promise<User | null> {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('users').select('*').eq('email', email).single(),
    );

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user data after retries:', error);
    return null;
  }
}

export async function getUnfilteredStops(): Promise<Stop[]> {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('stops').select('*'),
    );

    if (error) {
      console.error('Error fetching stops:', error);
      return [];
    }

    // Map all stops without filtering duplicates
    const stops = data.map((stop) => ({
      stop_id: stop.stop_id,
      name: stop.stop_name,
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    }));

    return stops;
  } catch (error) {
    console.error('Failed to get stops after retries:', error);
    return [];
  }
}

export async function getStopTimes(stop_id: string): Promise<StopTime[]> {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('stop_times')
        .select('trip_id, stop_id, arrival_time, departure_time, stop_sequence')
        .eq('stop_id', stop_id),
    );

    if (error) {
      console.error('Error fetching stop times:', error);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Failed to get stop times after retries:', error);
    return [];
  }
}

export async function getTrip(): Promise<Trip[]> {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('trips').select('*'),
    );

    if (error) {
      console.error('Error fetching trips:', error);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Failed to get trips after retries:', error);
    return [];
  }
}

export async function getShapes(): Promise<ShapePoint[][]> {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('shapes').select('*'),
    );

    if (error) {
      console.error('Error fetching shapes:', error);
      return [];
    }

    // Group shapes by shape_id
    const groupedShapes: { [key: string]: ShapePoint[] } = data.reduce(
      (acc, shape) => {
        const shapeId = shape.shape_id;
        if (!acc[shapeId]) {
          acc[shapeId] = [];
        }
        acc[shapeId].push({
          lat: parseFloat(shape.shape_pt_lat),
          lng: parseFloat(shape.shape_pt_lon),
        });
        return acc;
      },
      {},
    );

    // Convert to array of shape paths
    const shapePaths = Object.values(groupedShapes);
    return shapePaths;
  } catch (error) {
    console.error('Failed to get shapes after retries:', error);
    return [];
  }
}

// New function to get stops by name directly - export it
export async function getStopsByName(name: string): Promise<Stop[]> {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('stops')
        .select('stop_id, stop_name, stop_lat, stop_lon')
        .eq('stop_name', name),
    );

    if (error) {
      console.error('Error fetching stops by name:', error);
      return [];
    }

    return data.map((stop) => ({
      stop_id: stop.stop_id,
      name: stop.stop_name,
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    }));
  } catch (error) {
    console.error('Failed to get stops by name after retries:', error);
    return [];
  }
}

// New function to get trips by service IDs - export it
export async function getTripsForServiceIds(
  serviceIds: string[],
): Promise<Trip[]> {
  if (serviceIds.length === 0) return [];

  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('trips').select('*').in('service_id', serviceIds),
    );

    if (error) {
      console.error('Error fetching trips by service IDs:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to get trips for service IDs after retries:', error);
    return [];
  }
}
