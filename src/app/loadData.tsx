'use client';
import { useEffect } from 'react';
import { useAppContext } from './context/AppProvider';
import { Stop, ShapePoint, Trip } from '@/types/gtfs';

interface ContextInitializerProps {
  initialStops: Stop[];
  initialShapes: ShapePoint[][];
  initialTrips: Trip[];
}

export function ContextInitializer({
  initialStops,
  initialShapes,
  initialTrips,
}: ContextInitializerProps) {
  const { setMarkers, setShapes, setTrips } = useAppContext();

  // Update context with server fetched data
  useEffect(() => {
    if (initialStops && initialStops.length > 0) {
      setMarkers(initialStops);
    }
    if (initialShapes && initialShapes.length > 0) {
      setShapes(initialShapes);
    }
    if (initialTrips && initialTrips.length > 0) {
      setTrips(initialTrips);
    }
  }, [
    initialStops,
    initialShapes,
    setMarkers,
    setShapes,
    initialTrips,
    setTrips,
  ]);

  return <></>;
}

export default ContextInitializer;
