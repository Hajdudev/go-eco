'use client';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context/AppProvider';
import { useEffect, useState, JSX } from 'react';
import { findRoutes } from '@/actions/routeActions';
import InitialModal from '@/app/_components/InitialModal';

// Define RouteResult interface with the new properties
interface RouteResult {
  tripId: string;
  tripName: string;
  fromStopId: string;
  fromStopName: string;
  toStopId: string;
  toStopName: string;
  departureTime: string;
  arrivalTime: string;
  serviceId?: string;
  departureDayOffset?: number;
  arrivalDayOffset?: number;
}

// Import helper functions for UI display
function isRouteToday(
  currentTime: string,
  departureTime: string,
  departureDayOffset?: number,
): boolean {
  // Consider the day offset - a day offset > 0 means the trip is on a future day
  if (departureDayOffset && departureDayOffset > 0) return false;

  const currentMinutes = timeToMinutes(currentTime);
  const departureMinutes = timeToMinutes(departureTime);

  return departureMinutes >= currentMinutes;
}

// Other helper functions
function getWaitTime(currentTime: string, departureTime: string): string {
  let waitMinutes;
  const departureHour = parseInt(departureTime.split(':')[0], 10);
  const currentMinutes = timeToMinutes(currentTime);

  // Handle times with hours >= 24 (next day)
  if (departureHour >= 24) {
    // Calculate how many days in the future
    const daysAhead = Math.floor(departureHour / 24);
    // Get normalized hours for that day
    const normalizedHour = departureHour % 24;
    const normalizedDepartureTime = `${normalizedHour.toString().padStart(2, '0')}:${departureTime.split(':')[1]}`;
    const normalizedDepartureMinutes = timeToMinutes(normalizedDepartureTime);

    // Calculate wait time including the days ahead
    waitMinutes =
      daysAhead * 24 * 60 + normalizedDepartureMinutes - currentMinutes;

    // If still negative, it means we wrap around to the next day
    if (waitMinutes < 0) {
      waitMinutes += 24 * 60;
    }
  } else {
    // Standard case for same day times
    let departureMinutes = timeToMinutes(departureTime);
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

function formatTimeDisplay(timeString: string): string {
  // Simple approach: just split by colon and take first two parts
  const parts = timeString.split(':');
  const hours = parseInt(parts[0], 10) % 24; // Normalize hours to 0-23 range
  const minutes = parts[1]; // Keep minutes exactly as is

  // Return without any additional processing
  return `${hours}:${minutes}`;
}

function formatTime(timeString: string): string {
  return timeString.substring(0, 5);
}

function calculateDuration(startTime: string, endTime: string): string {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  let durationMinutes = end - start;

  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function determineArrivalDay(
  currentTime: string,
  departureTime: string,
  arrivalTime: string,
  departureDayOffset?: number,
  arrivalDayOffset?: number,
): JSX.Element | null {
  // If we have explicit day offsets from the GTFS data
  if (departureDayOffset !== undefined && arrivalDayOffset !== undefined) {
    const dayDifference = arrivalDayOffset - departureDayOffset;

    if (dayDifference > 0) {
      return (
        <span className='ml-2 text-xs text-orange-600'>
          {dayDifference === 1 ? '(next day)' : `(+${dayDifference} days)`}
        </span>
      );
    }
    return null;
  }

  // Fallback to the old logic for compatibility
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

  // Use normalized times for comparison
  const departureMinutes = timeToMinutes(departureTime);
  const arrivalMinutes = timeToMinutes(arrivalTime);

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

export default function Page() {
  const { user, trips } = useAppContext(); // Now we need trips again
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const fromId = searchParams.get('fromId'); // Optional stop ID for optimization
  const toId = searchParams.get('toId'); // Optional stop ID for optimization
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Get current time when component loads
  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  }, []);

  // Use the server action to find routes
  useEffect(() => {
    let isMounted = true;

    async function fetchRoutes() {
      if (
        !from ||
        !to ||
        !currentTime ||
        !Array.isArray(trips) ||
        trips.length === 0
      ) {
        if (isMounted) {
          setError(
            !from || !to
              ? 'Missing from or to location'
              : !currentTime
                ? 'Initializing...'
                : 'No trips data available. Please try refreshing the page.',
          );
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setLoadingStatus('Finding routes...');

        // Call the server action with minimal data, but include trips
        const result = await findRoutes({
          fromId: fromId || undefined,
          toId: toId || undefined,
          fromName: from,
          toName: to,
          currentTime,
          user,
          trips, // Pass trips from context
        });

        if (isMounted) {
          setRoutes(result.routes);
          setError(result.error);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error finding routes:', err);
        if (isMounted) {
          setError('Failed to find routes. Please try again later.');
          setLoading(false);
        }
      }
    }

    fetchRoutes();

    return () => {
      isMounted = false;
    };
  }, [from, to, fromId, toId, currentTime, user, trips]);

  const formattedCurrentTime = currentTime ? formatTime(currentTime) : '--:--';

  return (
    <>
      <InitialModal />
      <div className='bg-secondary mt-8 min-h-[550px] w-full rounded-4xl p-6'>
        <div className='mb-4 grid grid-cols-2 gap-4'>
          <div className='col-span-full text-center'>
            <div className='grid grid-cols-3 grid-rows-2 rounded-lg bg-white px-4 py-2 shadow'>
              <p className='col-start-1 col-end-3 text-left text-lg'>
                <span>From:</span>
                <span className='pl-4 font-semibold'>
                  {from || 'Not selected'}
                </span>
              </p>
              <p className='col-start-1 col-end-3 text-left text-lg'>
                <span>To:</span>
                <span className='pl-4 font-semibold'>
                  {to || 'Not selected'}
                </span>
              </p>
              <p className='col-start-3 col-end-3 row-start-1 text-gray-500'>
                Current time:
              </p>
              <p className='col-start-3 col-end-3 row-start-2 text-xl font-bold text-blue-600'>
                {formattedCurrentTime}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex h-64 flex-col items-center justify-center'>
            <div className='border-primary mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2'></div>
            <p className='text-gray-600'>{loadingStatus}</p>
            <p className='mt-2 text-sm text-gray-500'>
              This might take a moment...
            </p>
          </div>
        ) : error ? (
          <div className='rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
            <p>{error}</p>
          </div>
        ) : routes.length === 0 ? (
          <div className='rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700'>
            <p>No routes found in the next 24 hours between these locations.</p>
          </div>
        ) : (
          <div>
            <div className='max-h-[450px] overflow-y-auto rounded-lg bg-white shadow-lg'>
              {routes.map((route, index) => (
                <div
                  key={index}
                  className='border-b border-gray-100 p-4 transition-colors hover:bg-blue-50'
                >
                  {/* Route UI with updated calendar-based display */}
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center'>
                      <span className='font-medium'>
                        {route.tripName && route.tripName !== 'Unknown Route'
                          ? route.tripName
                          : `Route to ${route.toStopName}`}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      {isRouteToday(
                        currentTime,
                        route.departureTime,
                        route.departureDayOffset,
                      ) ? (
                        <span className='mr-3 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800'>
                          Today
                        </span>
                      ) : route.departureDayOffset &&
                        route.departureDayOffset > 0 ? (
                        <span className='mr-3 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800'>
                          {route.departureDayOffset === 1
                            ? 'Tomorrow'
                            : `+${route.departureDayOffset} days`}
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
                      {/* Fix the problematic div by ensuring no extra text nodes */}
                      <div className='flex items-center'>
                        <p className='font-bold text-blue-600'>
                          {formatTimeDisplay(route.departureTime)}
                        </p>
                        {/* Use a fragment to avoid any potential React quirks with conditional rendering */}
                        <>
                          {route.departureDayOffset &&
                          route.departureDayOffset > 0 ? (
                            <span className='ml-2 text-xs text-orange-600'>
                              {route.departureDayOffset === 1
                                ? '(next day)'
                                : `(+${route.departureDayOffset} days)`}
                            </span>
                          ) : !route.departureDayOffset &&
                            !isRouteToday(currentTime, route.departureTime) ? (
                            <span className='ml-2 text-xs text-orange-600'>
                              (next day)
                            </span>
                          ) : null}
                        </>
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
                          route.departureDayOffset,
                          route.arrivalDayOffset,
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
                      <p>
                        Duration:{' '}
                        {calculateDuration(
                          route.departureTime,
                          route.arrivalTime,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
