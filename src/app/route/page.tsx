'use client';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../context/AppProvider';
import { Trip, StopTime, Stop } from '@/types/gtfs';
import { getStopTimes } from '@/services/apiGetData';
import { useState, useEffect, JSX } from 'react';

interface RouteResult {
  tripId: string;
  tripName?: string;
  routeName?: string;
  departureTime: string;
  arrivalTime: string;
  fromStopName: string;
  toStopName: string;
}

export default function Page() {
  const { trips, markers } = useAppContext();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Debug info
  useEffect(() => {
    console.log('Data check:', {
      haveFrom: !!from,
      haveTo: !!to,
      markersLength: markers.length,
      tripsLength: trips.length,
      haveCurrentTime: !!currentTime,
    });
  }, [from, to, markers, trips, currentTime]);

  // Get and format current time when component loads
  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRoutes() {
      if (!from || !to) {
        if (isMounted) {
          setError('Missing from or to location');
          setLoading(false);
        }
        return;
      }

      if (!currentTime) {
        // Wait for current time to be set
        return;
      }

      if (markers.length === 0) {
        if (isMounted) {
          setError('No stops data available. Please try refreshing the page.');
          setLoading(false);
        }
        return;
      }

      if (trips.length === 0) {
        if (isMounted) {
          setError('No trips data available. Please try refreshing the page.');
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);

        // Find the stops by name
        if (isMounted) setLoadingStatus('Finding stops...');
        const fromStop = markers.find((stop) => stop.name === from);
        const toStop = markers.find((stop) => stop.name === to);

        if (!fromStop) {
          if (isMounted) {
            setError(`Could not locate departure stop "${from}"`);
            setLoading(false);
          }
          return;
        }

        if (!toStop) {
          if (isMounted) {
            setError(`Could not locate arrival stop "${to}"`);
            setLoading(false);
          }
          return;
        }

        // Get stop times
        if (isMounted) setLoadingStatus('Fetching departure times...');
        const fromStopTimes = await getStopTimes(fromStop.stop_id);

        if (fromStopTimes.length === 0) {
          if (isMounted) {
            setError(`No scheduled departures found for stop "${from}"`);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setLoadingStatus('Fetching arrival times...');
        const toStopTimes = await getStopTimes(toStop.stop_id);

        if (toStopTimes.length === 0) {
          if (isMounted) {
            setError(`No scheduled arrivals found for stop "${to}"`);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setLoadingStatus('Finding routes...');
        // Process in batches to avoid UI freezing
        setTimeout(() => {
          if (!isMounted) return;

          const results = findRouteSync({
            fromStop,
            toStop,
            fromStopTimes,
            toStopTimes,
            trips,
            currentTime,
          });

          if (results.length === 0) {
            setError(
              'No direct routes found between these stops in the next 24 hours',
            );
          } else {
            setError(null);
          }

          setRoutes(results);
          setLoading(false);
        }, 10); // Small delay to let UI update
      } catch (err) {
        console.error('Error finding routes:', err);
        if (isMounted) {
          setError('Failed to find routes. Please try again later.');
          setLoading(false);
        }
      }
    }

    loadRoutes();

    return () => {
      isMounted = false;
    };
  }, [from, to, trips, markers, currentTime]);

  // Synchronous version of route finding to avoid multiple async/await operations
  function findRouteSync({
    fromStop,
    toStop,
    fromStopTimes,
    toStopTimes,
    trips,
    currentTime,
  }: {
    fromStop: Stop;
    toStop: Stop;
    fromStopTimes: StopTime[];
    toStopTimes: StopTime[];
    trips: Trip[];
    currentTime: string;
  }): RouteResult[] {
    const results: RouteResult[] = [];

    // Calculate current time in minutes
    const currentMinutes = timeToMinutes(currentTime);

    // Calculate 24 hours from now in minutes
    const twentyFourHoursLater = currentMinutes + 24 * 60; // 24 hours in minutes

    console.log(
      `Finding routes from ${currentMinutes} to ${twentyFourHoursLater} minutes`,
    );
    console.log(
      `From stop times: ${fromStopTimes.length}, To stop times: ${toStopTimes.length}`,
    );

    // Quick lookup maps to improve performance
    const tripMap = new Map<string, StopTime[]>();
    const tripsInfoMap = new Map<string, Trip>();

    // Pre-build trip info map for faster lookups
    trips.forEach((trip) => {
      tripsInfoMap.set(trip.trip_id, trip);
    });

    // Group from stop times by trip_id - only process what we need
    let withinTimeWindow = 0;
    fromStopTimes.forEach((stopTime) => {
      let departureMinutes = timeToMinutes(stopTime.departure_time);

      // Handle time wrapping around midnight (when departure is earlier in the day than current time)
      if (departureMinutes < currentMinutes) {
        departureMinutes += 24 * 60; // Add 24 hours if it's earlier than current time
      }

      // Only include departures in the next 24 hours
      if (
        departureMinutes >= currentMinutes &&
        departureMinutes <= twentyFourHoursLater
      ) {
        withinTimeWindow++;
        if (!tripMap.has(stopTime.trip_id)) {
          tripMap.set(stopTime.trip_id, []);
        }
        tripMap.get(stopTime.trip_id)?.push(stopTime);
      }
    });

    console.log(`Departures within time window: ${withinTimeWindow}`);
    console.log(`Trip map size: ${tripMap.size}`);

    // Find matching trips and valid sequences
    let matchingTrips = 0;
    let sequenceIssues = 0;
    for (const toStopTime of toStopTimes) {
      const fromStopTimesForTrip = tripMap.get(toStopTime.trip_id);

      if (fromStopTimesForTrip) {
        matchingTrips++;
        // For this trip, find from stops that come before the to stop
        const validFromStops = fromStopTimesForTrip.filter(
          (fromTime) =>
            Number(fromTime.stop_sequence) < Number(toStopTime.stop_sequence),
        );

        if (validFromStops.length === 0) {
          sequenceIssues++;
          continue;
        }

        // Use the earliest valid from stop
        const validFromStop = validFromStops.reduce((earliest, current) =>
          earliest.departure_time < current.departure_time ? earliest : current,
        );

        const tripInfo = tripsInfoMap.get(toStopTime.trip_id);

        results.push({
          tripId: toStopTime.trip_id,
          tripName: tripInfo?.trip_headsign || 'Unknown',
          routeName: tripInfo?.route_id || 'Unknown',
          departureTime: validFromStop.departure_time,
          arrivalTime: toStopTime.arrival_time,
          fromStopName: fromStop.name,
          toStopName: toStop.name,
        });
      }
    }

    console.log(
      `Matching trips: ${matchingTrips}, Sequence issues: ${sequenceIssues}, Final results: ${results.length}`,
    );

    return results.sort((a, b) => {
      let aMinutes = timeToMinutes(a.departureTime);
      let bMinutes = timeToMinutes(b.departureTime);

      if (aMinutes < currentMinutes) aMinutes += 24 * 60;
      if (bMinutes < currentMinutes) bMinutes += 24 * 60;

      return aMinutes - bMinutes;
    });
  }

  const formattedCurrentTime = currentTime ? formatTime(currentTime) : '--:--';

  return (
    <div className='bg-secondary mt-8 min-h-[550px] w-full rounded-4xl p-6'>
      <div className='mb-4 grid grid-cols-2 gap-4'>
        {/* <div>
          <p className='text-lg'>
            From:{' '}
            <span className='font-semibold'>{from || 'Not selected'}</span>
          </p>
          <p className='text-lg'>
            To: <span className='font-semibold'>{to || 'Not selected'}</span>
          </p>
        </div> */}
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
              <span className='pl-4 font-semibold'>{to || 'Not selected'}</span>
            </p>
            {/* <p className='text-xs text-gray-500'>Time Window</p> */}
            <p className='col-start-3 col-end-3 row-start-1 text-gray-500'>
              Current time :
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
                <div className='mb-2 flex items-center justify-between'>
                  <div className='flex items-center'>
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
                        {formatTime(route.departureTime)}
                      </p>
                      {!isRouteToday(currentTime, route.departureTime) && (
                        <span className='ml-2 text-xs text-orange-600'>
                          (next day)
                        </span>
                      )}
                    </div>
                    <p>{route.fromStopName}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Arrival</p>
                    <div className='flex items-center'>
                      <p className='font-bold text-green-600'>
                        {formatTime(route.arrivalTime)}
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
  );
}

function isRouteToday(currentTime: string, departureTime: string): boolean {
  const currentMinutes = timeToMinutes(currentTime);
  const departureMinutes = timeToMinutes(departureTime);

  return departureMinutes >= currentMinutes;
}

function getWaitTime(currentTime: string, departureTime: string): string {
  const currentMinutes = timeToMinutes(currentTime);
  let departureMinutes = timeToMinutes(departureTime);

  if (departureMinutes < currentMinutes) {
    departureMinutes += 24 * 60;
  }

  const waitMinutes = departureMinutes - currentMinutes;
  const waitHours = Math.floor(waitMinutes / 60);
  const remainingMinutes = waitMinutes % 60;

  if (waitHours > 0) {
    return `in ${waitHours}h ${remainingMinutes}m`;
  } else {
    return `in ${remainingMinutes}m`;
  }
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

// Convert time string to minutes since midnight
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function determineArrivalDay(
  currentTime: string,
  departureTime: string,
  arrivalTime: string,
): JSX.Element | null {
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
