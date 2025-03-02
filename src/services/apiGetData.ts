'use server';
import supabase from './supabaseClient';

import { Stop, StopTime, Trip, ShapePoint } from '../types/gtfs';

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

export async function getStopTimes(
  stop_id: string,
  limit: number = 500,
): Promise<StopTime[]> {
  const { data, error } = await supabase
    .from('stop_times')
    .select('trip_id, stop_id, arrival_time, departure_time, stop_sequence')
    .eq('stop_id', stop_id)
    .limit(limit); // Limit the number of results

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
