'use server';

import { Trip, StopTime, Stop } from '@/types/gtfs';
import { getStopTimes, getTodayCalendar } from '@/services/apiGetData';
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

// Convert time string to minutes since midnight
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// This function handles GTFS times that can exceed 24 hours
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
 * This moves computation to the server for better performance
 */
export async function findRoutes({
  fromName,
  toName,
  currentTime,
  user,
  allStops,
  allTrips,
}: {
  fromName: string;
  toName: string;
  currentTime: string;
  user: User | null;
  allStops: Stop[];
  allTrips: Trip[];
}): Promise<{
  routes: RouteResult[];
  error: string | null;
  todayServiceIds: string[];
}> {
  try {
    // 1. Find the stops by name
    const fromStops = allStops.filter((stop) => stop.name === fromName);
    const toStops = allStops.filter((stop) => stop.name === toName);

    // Handle errors for missing stops
    if (fromStops.length === 0) {
      return {
        routes: [],
        error: `Could not locate departure stop "${fromName}"`,
        todayServiceIds: [],
      };
    }

    if (toStops.length === 0) {
      return {
        routes: [],
        error: `Could not locate arrival stop "${toName}"`,
        todayServiceIds: [],
      };
    }

    // 2. Get today's service calendar
    const calendarData = await getTodayCalendar();
    let validServiceIds: string[] = [];

    if (Array.isArray(calendarData)) {
      validServiceIds = calendarData
        .map((day) => day.service_id)
        .filter(Boolean) as string[];
    } else if (calendarData.service_id) {
      validServiceIds = [calendarData.service_id];
    }

    // 3. Fetch stop times for all possible from/to stops
    const allFromStopTimes: StopTime[] = [];
    for (const fromStop of fromStops) {
      const stopTimes = await getStopTimes(fromStop.stop_id);
      allFromStopTimes.push(...stopTimes);
    }

    if (allFromStopTimes.length === 0) {
      return {
        routes: [],
        error: `No scheduled departures found for stop "${fromName}"`,
        todayServiceIds: validServiceIds,
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
        todayServiceIds: validServiceIds,
      };
    }

    // 4. Find routes using the algorithm
    const results = findRouteAlgorithm({
      fromStops,
      toStops,
      fromStopTimes: allFromStopTimes,
      toStopTimes: allToStopTimes,
      trips: allTrips,
      currentTime,
      validServiceIds,
    });

    // 5. Save the route to user's history if results were found and user is logged in
    if (results.length > 0 && user) {
      await setUserRecentRoute(fromName, toName, user);
    }

    return {
      routes: results,
      error:
        results.length === 0
          ? 'No direct routes found between these stops in the next 24 hours'
          : null,
      todayServiceIds: validServiceIds,
    };
  } catch (error) {
    console.error('Error in findRoutes server action:', error);
    return {
      routes: [],
      error: 'Failed to find routes. Please try again later.',
      todayServiceIds: [],
    };
  }
}

/**
 * The core route finding algorithm, extracted to its own function
 */
function findRouteAlgorithm({
  fromStops,
  toStops,
  fromStopTimes,
  toStopTimes,
  trips,
  currentTime,
  validServiceIds,
}: {
  fromStops: Stop[];
  toStops: Stop[];
  fromStopTimes: StopTime[];
  toStopTimes: StopTime[];
  trips: Trip[];
  currentTime: string;
  validServiceIds: string[];
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

  // Filter trips to only those running today
  const validServiceIdSet = new Set(validServiceIds);
  const filteredTrips = trips.filter((trip) =>
    validServiceIdSet.has(trip.service_id),
  );
  const todayTripIds = new Set(filteredTrips.map((trip) => trip.trip_id));

  // Find the intersection of common trips and today's trips
  const validTripIds = new Set(
    [...commonTripIds].filter((id) => todayTripIds.has(id)),
  );

  // Create maps for lookups
  const tripsInfoMap = new Map<string, Trip>();
  const stopNamesMap = new Map<string, string>();

  // Build lookup maps
  filteredTrips.forEach((trip) => {
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

  // Only process stops from valid trips
  fromStopTimes.forEach((stopTime) => {
    if (
      validTripIds.has(stopTime.trip_id) &&
      fromStopIds.has(stopTime.stop_id)
    ) {
      if (!fromStopTimesByTrip.has(stopTime.trip_id)) {
        fromStopTimesByTrip.set(stopTime.trip_id, []);
      }
      fromStopTimesByTrip.get(stopTime.trip_id)?.push(stopTime);
    }
  });

  toStopTimes.forEach((stopTime) => {
    if (validTripIds.has(stopTime.trip_id) && toStopIds.has(stopTime.stop_id)) {
      if (!toStopTimesByTrip.has(stopTime.trip_id)) {
        toStopTimesByTrip.set(stopTime.trip_id, []);
      }
      toStopTimesByTrip.get(stopTime.trip_id)?.push(stopTime);
    }
  });

  // Process each valid trip
  validTripIds.forEach((tripId) => {
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
