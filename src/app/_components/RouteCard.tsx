import { RouteResult } from '@/types/route';
import React from 'react';

interface RouteCardProps {
  route: RouteResult;
  currentTime: string;
}

function timeToMinutesLocal(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export default function RouteCard({ route, currentTime }: RouteCardProps) {
  // Helper Functions
  function isRouteToday(currentTime: string, departureTime: string): boolean {
    const departureHour = parseInt(departureTime.split(':')[0], 10);
    // If time has hours >= 24, it's always "tomorrow" or later
    if (departureHour >= 24) return false;

    const currentMinutes = timeToMinutesLocal(currentTime);
    const departureMinutes = timeToMinutesLocal(departureTime);
    return departureMinutes >= currentMinutes;
  }

  function getWaitTime(currentTime: string, departureTime: string): string {
    let waitMinutes;
    const departureHour = parseInt(departureTime.split(':')[0], 10);
    const currentMinutes = timeToMinutesLocal(currentTime);

    // Handle times with hours >= 24 (next day)
    if (departureHour >= 24) {
      const daysAhead = Math.floor(departureHour / 24);
      const normalizedHour = departureHour % 24;
      const normalizedDepartureTime = `${normalizedHour.toString().padStart(2, '0')}:${departureTime.split(':')[1]}`;
      const normalizedDepartureMinutes = timeToMinutesLocal(
        normalizedDepartureTime,
      );

      waitMinutes =
        daysAhead * 24 * 60 + normalizedDepartureMinutes - currentMinutes;

      // If still negative, it means we wrap around to the next day
      if (waitMinutes < 0) {
        waitMinutes += 24 * 60;
      }
    } else {
      // Standard case for same day times
      let departureMinutes = timeToMinutesLocal(departureTime);
      if (departureMinutes < currentMinutes) {
        departureMinutes += 24 * 60; // Next day
      }
      waitMinutes = departureMinutes - currentMinutes;
    }

    const waitHours = Math.floor(waitMinutes / 60);
    const remainingMinutes = waitMinutes % 60;

    if (waitHours > 0) {
      return `in ${waitHours}h ${remainingMinutes}m`;
    } else {
      return `in ${remainingMinutes}m`;
    }
  }

  // Format time for display, normalizing hours > 24 to 0-23 range
  function formatTimeDisplay(timeString: string): string {
    const parts = timeString.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    hours = hours % 24; // Normalize hours to 0-23 range
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  function determineArrivalDay(
    currentTime: string,
    departureTime: string,
    arrivalTime: string,
  ) {
    // Extract hours to check if any time is on a future day (hours >= 24)
    const departureHour = parseInt(departureTime.split(':')[0], 10);
    const arrivalHour = parseInt(arrivalTime.split(':')[0], 10);

    // If departure is already on a future day
    if (departureHour >= 24) {
      const departureDays = Math.floor(departureHour / 24);
      const arrivalDays = Math.floor(arrivalHour / 24);

      // If arrival is on an even later day than departure
      if (arrivalDays > departureDays) {
        return (
          <span className='ml-2 text-xs text-red-600'>{`(+${arrivalDays - departureDays + 1} days)`}</span>
        );
      }

      // Normal "next day" case
      return <span className='ml-2 text-xs text-orange-600'>(next day)</span>;
    }

    // If arrival hour is 24+, it's explicitly the next day
    if (arrivalHour >= 24) {
      return <span className='ml-2 text-xs text-orange-600'>(next day)</span>;
    }

    // Use normalized times for comparison
    const departureMinutes = timeToMinutesLocal(departureTime);
    const arrivalMinutes = timeToMinutesLocal(arrivalTime);

    if (
      arrivalMinutes < departureMinutes &&
      departureMinutes - arrivalMinutes > 60
    ) {
      return isRouteToday(currentTime, departureTime) ? (
        <span className='ml-2 text-xs text-orange-600'>(next day)</span>
      ) : (
        <span className='ml-2 text-xs text-red-600'>(+2 days)</span>
      );
    } else if (!isRouteToday(currentTime, departureTime)) {
      return <span className='ml-2 text-xs text-orange-600'>(next day)</span>;
    }

    return null;
  }

  return (
    <div className='border-b border-gray-100 p-4 transition-colors hover:bg-blue-50'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='rounded bg-blue-500 px-2 py-1 text-sm text-white'>
            {route.routeName}
          </span>
          <span className='font-medium'>{route.tripName}</span>
        </div>
        <div className='flex items-center'>
          {isRouteToday(currentTime, route.departureTime) ? (
            <span className='mr-3 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800'>
              Today
            </span>
          ) : (
            <span className='mr-3 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800'>
              Tomorrow
            </span>
          )}
          <div className='text-sm text-gray-500'>
            {getWaitTime(currentTime, route.departureTime)}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='border-r border-gray-100 pr-4'>
          <p className='text-xs text-gray-500'>Departure</p>
          <div className='flex items-center'>
            <p className='font-bold text-blue-600'>
              {formatTimeDisplay(route.departureTime)}
            </p>
            {!isRouteToday(currentTime, route.departureTime) && (
              <span className='ml-2 text-xs text-orange-600'>(next day)</span>
            )}
          </div>
          <p>{route.fromStopName}</p>
        </div>
        <div>
          <p className='text-xs text-gray-500'>Arrival</p>
          <div className='flex items-center'>
            <p className='font-bold text-green-600'>
              {formatTimeDisplay(route.arrivalTime)}
            </p>
            {determineArrivalDay(
              currentTime,
              route.departureTime,
              route.arrivalTime,
            )}
          </div>
          <p>{route.toStopName}</p>
        </div>
      </div>

      <div className='mt-2 text-sm text-gray-600'>
        <div className='flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mr-1 h-4 w-4 text-gray-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p>Duration: {route.duration}</p>
        </div>
      </div>
    </div>
  );
}
