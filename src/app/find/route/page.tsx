'use client';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context/AppProvider';
import { Trip, StopTime, Stop } from '@/types/gtfs';
import { getStopTimes, setUserRecentRoute } from '@/services/apiGetData';
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
  const { trips, markers, user } = useAppContext();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [currentTime, setCurrentTime] = useState<string>('');

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
        // Get all possible stops with the given names (handling duplicates)
        const fromStops = markers.filter((stop) => stop.name === from);
        const toStops = markers.filter((stop) => stop.name === to);

        if (fromStops.length === 0) {
          if (isMounted) {
            setError(`Could not locate departure stop "${from}"`);
            setLoading(false);
          }
          return;
        }

        if (toStops.length === 0) {
          if (isMounted) {
            setError(`Could not locate arrival stop "${to}"`);
            setLoading(false);
          }
          return;
        }

        // Get stop times for all possible stops
        if (isMounted) setLoadingStatus('Fetching departure times...');

        // Fetch stop times for all possible from stops
        const allFromStopTimes: StopTime[] = [];
        for (const fromStop of fromStops) {
          if (isMounted)
            setLoadingStatus(
              `Fetching times for ${fromStop.name} (${fromStop.stop_id})...`,
            );
          const stopTimes = await getStopTimes(fromStop.stop_id);
          allFromStopTimes.push(...stopTimes);
        }

        if (allFromStopTimes.length === 0) {
          if (isMounted) {
            setError(`No scheduled departures found for stop "${from}"`);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setLoadingStatus('Fetching arrival times...');

        // Fetch stop times for all possible to stops
        const allToStopTimes: StopTime[] = [];
        for (const toStop of toStops) {
          if (isMounted)
            setLoadingStatus(
              `Fetching times for ${toStop.name} (${toStop.stop_id})...`,
            );
          const stopTimes = await getStopTimes(toStop.stop_id);
          allToStopTimes.push(...stopTimes);
        }

        if (allToStopTimes.length === 0) {
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
            fromStops,
            toStops,
            fromStopTimes: allFromStopTimes,
            toStopTimes: allToStopTimes,
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
          if (from && to && user) {
            setUserRecentRoute(from, to, user);
          }
          setLoading(false);
        }, 10);
      } catch {
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
  }, [from, to, trips, markers, currentTime, user]);

  // Synchronous version of route finding to avoid multiple async/await operations
  function findRouteSync({
    fromStops,
    toStops,
    fromStopTimes,
    toStopTimes,
    trips,
    currentTime,
  }: {
    fromStops: Stop[];
    toStops: Stop[];
    fromStopTimes: StopTime[];
    toStopTimes: StopTime[];
    trips: Trip[];
    currentTime: string;
  }): RouteResult[] {
    const results: RouteResult[] = [];

    // Create a set of from stop IDs and to stop IDs for quick lookup
    const fromStopIds = new Set(fromStops.map((stop) => stop.stop_id));
    const toStopIds = new Set(toStops.map((stop) => stop.stop_id));

    // First create an index of all trip IDs that might connect our stops
    const fromTripIds = new Set(fromStopTimes.map((st) => st.trip_id));
    const toTripIds = new Set(toStopTimes.map((st) => st.trip_id));

    // Find trips that visit both from and to stops
    const commonTripIds = new Set(
      [...fromTripIds].filter((id) => toTripIds.has(id)),
    );

    // Create maps for faster lookups
    const tripsInfoMap = new Map<string, Trip>();
    const stopNamesMap = new Map<string, string>();

    // Pre-build trip info map for faster lookups
    trips.forEach((trip) => {
      tripsInfoMap.set(trip.trip_id, trip);
    });

    // Build a map of stop IDs to stop names
    fromStops.forEach((stop) => {
      stopNamesMap.set(stop.stop_id, stop.name);
    });
    toStops.forEach((stop) => {
      stopNamesMap.set(stop.stop_id, stop.name);
    });

    // Group and index stop times by trip_id
    const fromStopTimesByTrip = new Map<string, StopTime[]>();
    const toStopTimesByTrip = new Map<string, StopTime[]>();

    // Only process common trips to improve performance
    fromStopTimes.forEach((stopTime) => {
      if (
        commonTripIds.has(stopTime.trip_id) &&
        fromStopIds.has(stopTime.stop_id)
      ) {
        if (!fromStopTimesByTrip.has(stopTime.trip_id)) {
          fromStopTimesByTrip.set(stopTime.trip_id, []);
        }
        fromStopTimesByTrip.get(stopTime.trip_id)?.push(stopTime);
      }
    });

    toStopTimes.forEach((stopTime) => {
      if (
        commonTripIds.has(stopTime.trip_id) &&
        toStopIds.has(stopTime.stop_id)
      ) {
        if (!toStopTimesByTrip.has(stopTime.trip_id)) {
          toStopTimesByTrip.set(stopTime.trip_id, []);
        }
        toStopTimesByTrip.get(stopTime.trip_id)?.push(stopTime);
      }
    });

    // Process each common trip
    commonTripIds.forEach((tripId) => {
      const fromTimesForTrip = fromStopTimesByTrip.get(tripId) || [];
      const toTimesForTrip = toStopTimesByTrip.get(tripId) || [];

      // Skip if we don't have both departure and arrival data
      if (fromTimesForTrip.length === 0 || toTimesForTrip.length === 0) {
        return;
      }

      // For each departure and arrival on this trip
      for (const fromStopTime of fromTimesForTrip) {
        for (const toStopTime of toTimesForTrip) {
          // Validate that departure comes before arrival in the trip sequence
          if (
            Number(fromStopTime.stop_sequence) >=
            Number(toStopTime.stop_sequence)
          ) {
            continue;
          }

          // Properly handle times - GTFS allows times > 24 hours
          // For example 25:30:00 means 1:30 AM the next day
          const departureMinutes = normalizedTimeToMinutes(
            fromStopTime.departure_time,
          );
          const currentNormalizedMinutes = timeToMinutes(currentTime);

          // Calculate 24 hour window from now
          const windowEnd = currentNormalizedMinutes + 24 * 60;

          // Check if departure is within our 24-hour window
          // For times after midnight, we need special handling
          if (
            (departureMinutes >= currentNormalizedMinutes &&
              departureMinutes <= windowEnd) ||
            (departureMinutes + 24 * 60 >= currentNormalizedMinutes &&
              departureMinutes + 24 * 60 <= windowEnd)
          ) {
            const tripInfo = tripsInfoMap.get(tripId);

            results.push({
              tripId: tripId,
              tripName: tripInfo?.trip_headsign || 'Unknown',
              routeName: tripInfo?.route_id || 'Unknown',
              departureTime: fromStopTime.departure_time,
              arrivalTime: toStopTime.arrival_time,
              fromStopName:
                stopNamesMap.get(fromStopTime.stop_id) || fromStopTime.stop_id,
              toStopName:
                stopNamesMap.get(toStopTime.stop_id) || toStopTime.stop_id,
            });
          }
        }
      }
    });

    // Sort by departure time, with proper handling of times > 24h
    return results.sort((a, b) => {
      const aDepartureMinutes = normalizedTimeToMinutes(a.departureTime);
      const bDepartureMinutes = normalizedTimeToMinutes(b.departureTime);
      const currentNormalizedMinutes = timeToMinutes(currentTime);

      // Adjust times to be relative to current time for sorting
      let adjustedA = aDepartureMinutes;
      let adjustedB = bDepartureMinutes;

      // If time is earlier today, it's actually tomorrow (add 24h)
      if (adjustedA < currentNormalizedMinutes) adjustedA += 24 * 60;
      if (adjustedB < currentNormalizedMinutes) adjustedB += 24 * 60;

      return adjustedA - adjustedB;
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
                        {formatTimeDisplay(route.departureTime)}
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
  const departureHour = parseInt(departureTime.split(':')[0], 10);

  // If time has hours >= 24, it's always "tomorrow" or later
  if (departureHour >= 24) {
    return false;
  }

  const currentMinutes = timeToMinutes(currentTime);
  const departureMinutes = timeToMinutes(departureTime);

  return departureMinutes >= currentMinutes;
}

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

// Format time for display, normalizing hours > 24 to 0-23 range
function formatTimeDisplay(timeString: string): string {
  const parts = timeString.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  // Normalize hours to 0-23 range for display
  hours = hours % 24;

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Original formatTime function keeps original GTFS format but just trims seconds
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

// This function handles GTFS times that can exceed 24 hours
// It normalizes them to standard 0-23 hour format for comparisons
function normalizedTimeToMinutes(timeString: string): number {
  const [hoursStr, minutesStr] = timeString.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Normalize hours to 0-23 range for comparison
  hours = hours % 24;

  return hours * 60 + minutes;
}

function determineArrivalDay(
  currentTime: string,
  departureTime: string,
  arrivalTime: string,
): JSX.Element | null {
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
