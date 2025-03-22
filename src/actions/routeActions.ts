'use server';

import { Trip, StopTime, Stop } from '@/types/gtfs';
import { getStopTimes, getStopsByName } from '@/services/apiGetData';
import { User } from '@/types/session';
import { setUserRecentRoute } from '@/services/apiGetData';

// Define the result interface same as in the page component
export interface RouteResult {
  tripId: string;
  tripName?: string;
  routeName?: string;
  departureTime: string;
  arrivalTime: string;
  fromStopName: string;
  toStopName: string;
}

// Helper functions
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function normalizedTimeToMinutes(timeString: string): number {
  const [hoursStr, minutesStr] = timeString.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Normalize hours to 0-23 range for comparison
  hours = hours % 24;

  return hours * 60 + minutes;
}

/**
 * Server action for finding routes between two stops
 * This version is optimized to reduce payload size for Vercel
 */
export async function findRoutes({
  fromId,
  toId,
  fromName,
  toName,
  currentTime,
  user,
  trips,
}: {
  fromId?: string;
  toId?: string;
  fromName: string;
  toName: string;
  currentTime: string;
  user: User | null;
  trips: Trip[]; // Accept trips from client instead of fetching based on service_ids
}): Promise<{
  routes: RouteResult[];
  error: string | null;
}> {
  try {
    // 1. Get stop information - either use provided IDs or look them up by name
    let fromStops: Stop[] = [];
    let toStops: Stop[] = [];

    // Instead of getting all stops, just get the ones we need
    if (fromId) {
      // If stop ID is provided directly, construct minimal stop object
      fromStops = [{ stop_id: fromId, name: fromName, lat: 0, lng: 0 }];
    } else {
      // Otherwise look up the stop by name (more expensive operation)
      const matchingStops = await getStopsByName(fromName);
      if (matchingStops.length === 0) {
        return {
          routes: [],
          error: `Could not locate departure stop "${fromName}"`,
        };
      }
      fromStops = matchingStops;
    }

    if (toId) {
      toStops = [{ stop_id: toId, name: toName, lat: 0, lng: 0 }];
    } else {
      const matchingStops = await getStopsByName(toName);
      if (matchingStops.length === 0) {
        return {
          routes: [],
          error: `Could not locate arrival stop "${toName}"`,
        };
      }
      toStops = matchingStops;
    }

    // 2. Get stop times directly - no need to pass them from client
    const allFromStopTimes: StopTime[] = [];
    for (const fromStop of fromStops) {
      const stopTimes = await getStopTimes(fromStop.stop_id);
      allFromStopTimes.push(...stopTimes);
    }

    if (allFromStopTimes.length === 0) {
      return {
        routes: [],
        error: `No scheduled departures found for stop "${fromName}"`,
      };
    }

    const allToStopTimes: StopTime[] = [];
    for (const toStop of toStops) {
      const stopTimes = await getStopTimes(toStop.stop_id);
      allToStopTimes.push(...stopTimes);
    }

    if (allToStopTimes.length === 0) {
      return {
        routes: [],
        error: `No scheduled arrivals found for stop "${toName}"`,
      };
    }

    // 3. Find routes using the algorithm - without calendar filtering
    const results = findRouteAlgorithm({
      fromStops,
      toStops,
      fromStopTimes: allFromStopTimes,
      toStopTimes: allToStopTimes,
      trips,
      currentTime,
    });

    // 4. Save the route to user's history if results were found and user is logged in
    if (results.length > 0 && user) {
      await setUserRecentRoute(fromName, toName, user);
    }

    return {
      routes: results,
      error:
        results.length === 0
          ? 'No direct routes found between these stops in the next 24 hours'
          : null,
    };
  } catch (error) {
    console.error('Error in findRoutes server action:', error);
    return {
      routes: [],
      error: 'Failed to find routes. Please try again later.',
    };
  }
}

/**
 * The core route finding algorithm, extracted to its own function
 * Removed calendar filtering - uses all trips
 */
function findRouteAlgorithm({
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

  // Current time in minutes for time window calculation
  const currentMinutes = timeToMinutes(currentTime);
  const twentyFourHoursLater = currentMinutes + 24 * 60;

  // Create ID sets for efficient lookups
  const fromStopIds = new Set(fromStops.map((stop) => stop.stop_id));
  const toStopIds = new Set(toStops.map((stop) => stop.stop_id));

  // Index trip IDs to find common trips between stops
  const fromTripIds = new Set(fromStopTimes.map((st) => st.trip_id));
  const toTripIds = new Set(toStopTimes.map((st) => st.trip_id));

  // Find trips that connect both stops
  const commonTripIds = new Set(
    [...fromTripIds].filter((id) => toTripIds.has(id)),
  );

  // Create maps for lookups
  const tripsInfoMap = new Map<string, Trip>();
  const stopNamesMap = new Map<string, string>();

  // Build lookup maps for all trips - no filtering based on calendar
  trips.forEach((trip) => {
    tripsInfoMap.set(trip.trip_id, trip);
  });

  // Map stop IDs to names
  fromStops.forEach((stop) => {
    stopNamesMap.set(stop.stop_id, stop.name);
  });
  toStops.forEach((stop) => {
    stopNamesMap.set(stop.stop_id, stop.name);
  });

  // Group stop times by trip for efficient processing
  const fromStopTimesByTrip = new Map<string, StopTime[]>();
  const toStopTimesByTrip = new Map<string, StopTime[]>();

  // Process all common trips without filtering by service_id
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

    if (fromTimesForTrip.length === 0 || toTimesForTrip.length === 0) return;

    // Check all possible combinations
    for (const fromStopTime of fromTimesForTrip) {
      for (const toStopTime of toTimesForTrip) {
        // Ensure from stop comes before to stop in the sequence
        if (
          Number(fromStopTime.stop_sequence) >= Number(toStopTime.stop_sequence)
        ) {
          continue;
        }

        // Check time window
        const departureMinutes = normalizedTimeToMinutes(
          fromStopTime.departure_time,
        );

        // Handle times across midnight
        const isDepartureInWindow =
          (departureMinutes >= currentMinutes &&
            departureMinutes <= twentyFourHoursLater) ||
          (departureMinutes + 24 * 60 >= currentMinutes &&
            departureMinutes + 24 * 60 <= twentyFourHoursLater);

        if (isDepartureInWindow) {
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

  // Sort by departure time
  return results.sort((a, b) => {
    let aDepartureMinutes = normalizedTimeToMinutes(a.departureTime);
    let bDepartureMinutes = normalizedTimeToMinutes(b.departureTime);

    // Adjust for times past midnight
    if (aDepartureMinutes < currentMinutes) aDepartureMinutes += 24 * 60;
    if (bDepartureMinutes < currentMinutes) bDepartureMinutes += 24 * 60;

    return aDepartureMinutes - bDepartureMinutes;
  });
}
