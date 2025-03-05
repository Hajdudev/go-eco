'use client';
import { useEffect } from 'react';
import { useAppContext } from './context/AppProvider';
import { Stop, ShapePoint, Trip, CalendarDate } from '@/types/gtfs';

interface ContextInitializerProps {
  initialStops: Stop[];
  initialShapes: ShapePoint[][];
  initialTrips: Trip[];
  todayDay: CalendarDate | CalendarDate[];
}

export function ContextInitializer({
  initialStops,
  initialShapes,
  initialTrips,
  todayDay,
}: ContextInitializerProps) {
  const { setMarkers, setShapes, setTrips, setTodayDay } = useAppContext();

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
    if (todayDay) {
      console.log(todayDay);
      setTodayDay(todayDay);
    }
  }, [
    initialStops,
    initialShapes,
    setMarkers,
    setShapes,
    initialTrips,
    setTrips,
    setTodayDay,
    todayDay,
  ]);

  return <></>;
}

export default ContextInitializer;
