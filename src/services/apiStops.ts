import supabase from './supabaseClient';

export async function getStops() {
  'use server';
  const { data, error } = await supabase.from('stops').select('*');
  if (error) {
    console.error('Error fetching stops:', error);
    return [];
  }

  // Filter out duplicate stop_name values
  const uniqueStops = Array.from(
    new Set(data.map((stop) => stop.stop_name)),
  ).map((stop_name) => {
    return data.find((stop) => stop.stop_name === stop_name);
  });

  return uniqueStops;
}
