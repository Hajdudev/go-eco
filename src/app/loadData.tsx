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
  const { setShapes, setTrips, setTodayDay } = useAppContext();

  useEffect(() => {
    if (initialShapes && initialShapes.length > 0) {
      setShapes(initialShapes);
    }
    if (initialTrips && initialTrips.length > 0) {
      setTrips(initialTrips);
    }
    if (todayDay) {
      setTodayDay(todayDay);
    }
  }, [
    initialStops,
    initialShapes,
    setShapes,
    initialTrips,
    setTrips,
    setTodayDay,
    todayDay,
  ]);

  return <></>;
}

export default ContextInitializer;
