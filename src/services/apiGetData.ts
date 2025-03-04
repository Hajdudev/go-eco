'use server';
import supabase from './supabaseClient';

import { Stop, StopTime, Trip, ShapePoint } from '../types/gtfs';
import { User } from '@/types/session';

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
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if user exists:', fetchError);
      return;
    }

    // Format the route for storage
    const routeString = `${from} → ${to}`;

    // Create/update user with route
    if (!existingUser) {
      // User doesn't exist, create a new record
      const { error: insertError } = await supabase.from('users').insert([
        {
          email: user.email,
          name: user.name,
          image: user.image,
          recent_rides: [routeString],
        },
      ]);

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
        // Limit to 5 routes
        updatedRoutes = updatedRoutes.slice(0, 7);
      } else {
        // Handle case where recent_rides is not an array
        updatedRoutes = [routeString];
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ recent_rides: updatedRoutes })
        .eq('email', user.email);

      if (updateError) {
        console.error('Error updating user routes:', updateError);
      }
    }
  } catch (error) {
    console.error('Unexpected error in setUserRecentRoute:', error);
  }
}
export async function getUserData(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    return null;
  }

  return data;
}

export async function getUnfilteredStops(): Promise<Stop[]> {
  const { data, error } = await supabase
    .from('stops')
    // .select('stop_id, stop_name as name, stop_lat as lat , stop_lon as lng ');
    .select('*');
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
}

export async function getStopTimes(stop_id: string): Promise<StopTime[]> {
  const { data, error } = await supabase
    .from('stop_times')
    .select('trip_id, stop_id, arrival_time, departure_time, stop_sequence')
    .eq('stop_id', stop_id);

  if (error) {
    console.error('Error fetching stop times:', error);
    return [];
  }
  return data;
}

export async function getTrip(): Promise<Trip[]> {
  const { data, error } = await supabase.from('trips').select('*');
  if (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
  return data;
}

export async function getShapes(): Promise<ShapePoint[][]> {
  const { data, error } = await supabase.from('shapes').select('* ');

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
}
