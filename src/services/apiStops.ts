'use server';
import supabase from './supabaseClient';

export async function getUnfilteredStops() {
  const { data, error } = await supabase.from('stops').select('*');
  if (error) {
    console.error('Error fetching stops:', error);
    return [];
  }

  // Map all stops without filtering duplicates
  const stops = data.map((stop) => ({
    name: stop.stop_name,
    lat: parseFloat(stop.stop_lat),
    lng: parseFloat(stop.stop_lon),
  }));

  return stops;
}

type ShapePoint = {
  lat: number;
  lng: number;
};

export async function getShapes(): Promise<ShapePoint[][]> {
  const { data, error } = await supabase.from('shapes').select('*');

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
