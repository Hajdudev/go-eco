'use server';
import supabase from './supabaseClient';

export async function getStops() {
  const { data, error } = await supabase.from('stops').select('*');
  if (error) {
    console.error('Error fetching stops:', error);
    return [];
  }

  const uniqueStops = Array.from(
    new Set(data.map((stop) => stop.stop_name)),
  ).map((stop_name) => {
    const stop = data.find((s) => s.stop_name === stop_name);
    return {
      name: stop.stop_name,
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    };
  });

  return uniqueStops;
}
