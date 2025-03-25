'use server';

import {
  getStopsByName,
  getStopTimes,
  getBatchTripDetails,
  setUserRecentRoute,
  getActiveServiceIds,
} from '@/services/apiGetData';
import * as cache from '@/lib/cache';

/**
 * Helper function to normalize GTFS time to standard 24-hour time
 * @param {string} gtfsTime - GTFS time string (may have hours > 24)
 * @returns {object} Object with normalized time and day offset
 */
function normalizeGtfsTime(gtfsTime) {
  const [hours, minutes, seconds] = gtfsTime.split(':').map(Number);
  const dayOffset = Math.floor(hours / 24);
  const normalizedHours = hours % 24;

  return {
    time: `${normalizedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds ? seconds.toString().padStart(2, '0') : '00'}`,
    dayOffset,
  };
}

export async function findRoutes(params) {
  try {
    const { fromId, toId, fromName, toName, currentTime, user, selectedDate } =
      params;

    // Use provided date or default to today
    const searchDate = selectedDate ? new Date(selectedDate) : new Date();

    // Format the date for display in logs and debugging
    const dateString = searchDate.toISOString().split('T')[0];
    console.log(`Finding routes for date: ${dateString}`);

    // Parse current time
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    // Format the date for caching - reuse the existing dateString variable

    // Cache key for the route search - including the date and time for accuracy
    const cacheKey = `route:${fromId || fromName}:${toId || toName}:${currentTime.split(':')[0]}:${dateString}`;

    const cachedRoutes = cache.get(cacheKey);

    // Return cached route results if available
    if (cachedRoutes) {
      // If we have the user, still save this as a recent route (doesn't affect results)
      if (user) {
        // Fire and forget - don't wait for this to complete
        setUserRecentRoute(fromName, toName, user).catch((err) =>
          console.error('Error saving recent route:', err),
        );
      }
      return cachedRoutes;
    }

    // If we have the user, save this as a recent route
    if (user) {
      await setUserRecentRoute(fromName, toName, user);
    }

    // Get active service IDs for the selected date
    const activeServiceIds = await getActiveServiceIds(searchDate);

    if (!activeServiceIds || activeServiceIds.length === 0) {
      return {
        routes: [],
        error: `No transit service available for ${dateString}.`,
      };
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
    const tripsToFetch = new Set();
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

          // Normalize GTFS times (which can have hours > 24)
          const departureInfo = normalizeGtfsTime(fromStop.departure_time);
          const arrivalInfo = normalizeGtfsTime(toStop.arrival_time);

          // Create a route result object with normalized time and day offset information
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
            departureDayOffset: departureInfo.dayOffset,
            arrivalDayOffset: arrivalInfo.dayOffset,
          });
        }
      }
    }

    if (possibleRoutes.length === 0) {
      return {
        routes: [],
        error: `No direct routes found from "${fromName}" to "${toName}".`,
      };
    }

    // Step 4: Get trip details including service_id to filter by active service
    const tripDetails = await getBatchTripDetails(Array.from(tripsToFetch));
    const tripDetailsMap = new Map();

    // Create a lookup map for quick access
    for (const trip of tripDetails) {
      if (trip && trip.trip_id) {
        tripDetailsMap.set(trip.trip_id, trip);
      }
    }

    // Add trip names to routes and filter by active service
    const routesWithNames = possibleRoutes
      .filter((route) => {
        const tripDetail = tripDetailsMap.get(route.tripId);
        // Only include trips that have active service today
        return tripDetail && activeServiceIds.includes(tripDetail.service_id);
      })
      .map((route) => {
        const tripDetail = tripDetailsMap.get(route.tripId);
        return {
          ...route,
          tripName:
            tripDetail?.trip_name ||
            tripDetail?.trip_headsign ||
            tripDetail?.route_id ||
            'Unknown Route',
          serviceId: tripDetail?.service_id,
          // Add date information for display context
          searchDate: dateString,
        };
      });

    // Sort by departure time, considering time wrapping at midnight and day offsets
    routesWithNames.sort((a, b) => {
      // Convert departure times to minutes for comparison
      const timeA =
        convertTimeToMinutes(a.departureTime) +
        (a.departureDayOffset || 0) * 24 * 60;
      const timeB =
        convertTimeToMinutes(b.departureTime) +
        (b.departureDayOffset || 0) * 24 * 60;

      // Calculate minutes from current time considering day boundaries
      const minutesFromNowA = timeA - currentTimeInMinutes;
      const minutesFromNowB = timeB - currentTimeInMinutes;

      // First show trips that depart soon (consider trips that depart within the next 24 hours first)
      if (minutesFromNowA >= 0 && minutesFromNowB >= 0) {
        return timeA - timeB;
      }
      // If one is upcoming and one is past, prioritize upcoming
      else if (minutesFromNowA >= 0 && minutesFromNowB < 0) {
        return -1;
      } else if (minutesFromNowA < 0 && minutesFromNowB >= 0) {
        return 1;
      }
      // Both are past, sort by closest to current time
      else {
        return timeB - timeA;
      }
    });

    const result = {
      routes: routesWithNames,
      error: null,
      date: dateString, // Include the date in the result for reference
    };

    // Cache the route results until end of day
    cache.set(cacheKey, result, 'calendarData');

    return result;
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
