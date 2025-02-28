'use client';
import { useEffect } from 'react';
import { useAppContext } from './context/AppProvider';
import { Stop, ShapePoint, StopTime, Trip } from '@/types/gtfs';

interface ContextInitializerProps {
  initialStops: Stop[];
  initialShapes: ShapePoint[][];
  initialStopTimes: StopTime[];
  initialTrips: Trip[];
}

export function ContextInitializer({
  initialStops,
  initialShapes,
  initialTrips,
  initialStopTimes,
}: ContextInitializerProps) {
  const { setMarkers, setShapes } = useAppContext();

  // Update context with server fetched data
  useEffect(() => {
    if (initialStops && initialStops.length > 0) {
      setMarkers(initialStops);
    }
    if (initialShapes && initialShapes.length > 0) {
      setShapes(initialShapes);
    }
    if (initialTrips && initialTrips.length > 0) {
    }
    if (initialStopTimes && initialStopTimes.length > 0) {
    }
  }, [
    initialStops,
    initialShapes,
    setMarkers,
    setShapes,
    initialTrips,
    initialStopTimes,
  ]);

  return <></>;
}

export default ContextInitializer;
