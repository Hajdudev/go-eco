'use server';

import {
  getStopsByName,
  getStopTimes,
  getBatchTripDetails,
  setUserRecentRoute,
} from '@/services/apiGetData';

export async function findRoutes(params) {
  try {
    const { fromId, toId, fromName, toName, currentTime, user } = params;

    // If we have the user, save this as a recent route
    if (user) {
      await setUserRecentRoute(fromName, toName, user);
    }

    // Step 1: Get stop IDs if not provided
    const fromStops = fromId
      ? [{ stop_id: fromId, name: fromName }]
      : await getStopsByName(fromName);
    const toStops = toId
      ? [{ stop_id: toId, name: toName }]
      : await getStopsByName(toName);

    if (fromStops.length === 0) {
      return { routes: [], error: `Origin stop "${fromName}" not found.` };
    }

    if (toStops.length === 0) {
      return { routes: [], error: `Destination stop "${toName}" not found.` };
    }

    // Step 2: Get stop times for each stop
    const fromStopPromises = fromStops.map((stop) =>
      getStopTimes(stop.stop_id),
    );
    const toStopPromises = toStops.map((stop) => getStopTimes(stop.stop_id));

    const fromStopTimes = (await Promise.all(fromStopPromises)).flat();
    const toStopTimes = (await Promise.all(toStopPromises)).flat();

    if (fromStopTimes.length === 0) {
      return { routes: [], error: `No departures found from "${fromName}".` };
    }

    if (toStopTimes.length === 0) {
      return { routes: [], error: `No arrivals found at "${toName}".` };
    }

    // Step 3: Find matching trips
    const possibleRoutes = [];
    const processedTrips = new Set();
    const tripsToFetch = new Set();

    // Convert current time to minutes for comparison
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find matching trips
    for (const fromStop of fromStopTimes) {
      for (const toStop of toStopTimes) {
        // Same trip, fromStop comes before toStop
        if (
          fromStop.trip_id === toStop.trip_id &&
          parseInt(fromStop.stop_sequence) < parseInt(toStop.stop_sequence)
        ) {
          // Add trip ID to the fetch list
          tripsToFetch.add(fromStop.trip_id);

          // Create a route result object
          possibleRoutes.push({
            tripId: fromStop.trip_id,
            tripName: 'Loading...', // Placeholder to be filled later
            fromStopId: fromStop.stop_id,
            fromStopName:
              fromStops.find((s) => s.stop_id === fromStop.stop_id)?.name ||
              'Unknown Stop',
            toStopId: toStop.stop_id,
            toStopName:
              toStops.find((s) => s.stop_id === toStop.stop_id)?.name ||
              'Unknown Stop',
            departureTime: fromStop.departure_time,
            arrivalTime: toStop.arrival_time,
          });

          // Mark this trip as processed
          processedTrips.add(fromStop.trip_id);
        }
      }
    }

    if (possibleRoutes.length === 0) {
      return {
        routes: [],
        error: `No direct routes found from "${fromName}" to "${toName}".`,
      };
    }

    // Step 4: Get trip details for all the trips we found
    const tripDetails = await getBatchTripDetails(Array.from(tripsToFetch));
    const tripDetailsMap = new Map();

    // Create a lookup map for quick access
    for (const trip of tripDetails) {
      if (trip && trip.trip_id) {
        tripDetailsMap.set(trip.trip_id, trip);
      }
    }

    // Add trip names to routes
    const routesWithNames = possibleRoutes.map((route) => {
      const tripDetail = tripDetailsMap.get(route.tripId);
      return {
        ...route,
        tripName:
          tripDetail?.trip_name ||
          tripDetail?.trip_headsign ||
          tripDetail?.route_id ||
          'Unknown Route',
      };
    });

    // Sort by departure time, considering time wrapping at midnight
    routesWithNames.sort((a, b) => {
      // Convert departure times to minutes for comparison
      let timeA = convertTimeToMinutes(a.departureTime);
      let timeB = convertTimeToMinutes(b.departureTime);

      // Adjust for times that are after the current time
      if (timeA < currentTimeInMinutes) timeA += 24 * 60;
      if (timeB < currentTimeInMinutes) timeB += 24 * 60;

      return timeA - timeB;
    });

    return {
      routes: routesWithNames,
      error: null,
    };
  } catch (error) {
    console.error('Error finding routes:', error);
    return {
      routes: [],
      error: 'An unexpected error occurred while searching for routes.',
    };
  }
}

// Helper function to convert time string to minutes
function convertTimeToMinutes(timeString) {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}
