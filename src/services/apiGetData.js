'use server';
import supabase from './supabaseClient';

/**
 * Helper function to handle Supabase query errors with retries
 * @param {Function} queryFn - The query function to execute
 * @param {number} retries - Number of retries (default: 3)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 * @returns {Promise<{data: any, error: any}>} The query result
 */
async function executeSupabaseQuery(queryFn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await queryFn();
      return result;
    } catch (error) {
      console.error(`Query attempt ${attempt + 1} failed:`, error);
      lastError = error;

      // Wait before retrying
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Helper function to fetch paginated data to prevent large response sizes
 * @param {Function} queryBuilder - The Supabase query builder function
 * @param {number} pageSize - Number of records per page
 * @param {number} maxRecords - Maximum total records to fetch (optional)
 * @returns {Promise<Array>} Combined data from all pages
 */
async function fetchPaginatedData(
  queryBuilder,
  pageSize = 100,
  maxRecords = 1000,
) {
  let allData = [];
  let page = 0;
  let hasMore = true;
  let consecutiveEmptyResponses = 0;

  while (hasMore && (maxRecords ? allData.length < maxRecords : true)) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, error } = await executeSupabaseQuery(() =>
        queryBuilder.range(from, to),
      );

      if (error) {
        console.error('Pagination query error:', error);
        break;
      }

      if (!data || data.length === 0) {
        consecutiveEmptyResponses++;
        if (consecutiveEmptyResponses >= 2) {
          // If we get two empty responses in a row, assume we're done
          hasMore = false;
        } else {
          // Try one more page in case there's a gap in the data
          page++;
          continue;
        }
      } else {
        consecutiveEmptyResponses = 0;
        allData = [...allData, ...data];
        page++;

        // Safety check to prevent infinite loops
        if (data.length < pageSize) {
          hasMore = false;
        }

        // If we've reached maximum records, truncate and stop
        if (maxRecords && allData.length >= maxRecords) {
          allData = allData.slice(0, maxRecords);
          hasMore = false;
        }
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }

  return allData;
}

export async function getTodayCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('calendar_dates')
        .select('service_id, date')
        .eq('date', formattedDate),
    );

    if (error) {
      console.error('Error fetching today calendar:', error);
      return { service_id: '', date: '' };
    }

    return data.length > 0
      ? data.map((data) => data)
      : { service_id: '', date: '' };
  } catch (error) {
    console.error('Unexpected error in getTodayCalendar:', error);
    return { service_id: '', date: '' };
  }
}

/**
 * Function to save a user's recent route
 * @param {string} from - Origin location name
 * @param {string} to - Destination location name
 * @param {User|null} user - The user object
 */
export async function setUserRecentRoute(from, to, user) {
  // Check if user exists - don't proceed if no user
  if (!user || !user.email) {
    console.error(
      'Cannot save route: No user is logged in or email is missing',
    );
    return;
  }

  try {
    // First, check if user exists in the database
    const { data: existingUser, error: fetchError } =
      await executeSupabaseQuery(() =>
        supabase.from('users').select('*').eq('email', user.email).single(),
      );

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if user exists:', fetchError);
      return;
    }

    // Format the route for storage
    const routeString = `${from} → ${to}`;

    // Create/update user with route
    if (!existingUser) {
      // User doesn't exist, create a new record
      const { error: insertError } = await executeSupabaseQuery(() =>
        supabase.from('users').insert([
          {
            email: user.email,
            name: user.name,
            image: user.image,
            recent_rides: [routeString],
          },
        ]),
      );

      if (insertError) {
        console.error('Error creating user record:', insertError);
      }
    } else {
      // User exists, update their recent routes
      let updatedRoutes = existingUser.recent_rides || [];

      // Add new route to beginning, limit to 5 most recent routes
      if (Array.isArray(updatedRoutes)) {
        // Remove the route if it already exists to avoid duplicates
        updatedRoutes = updatedRoutes.filter((route) => route !== routeString);
        // Add the new route to the beginning
        updatedRoutes.unshift(routeString);
        // Limit to max 7 routes
        updatedRoutes = updatedRoutes.slice(0, 7);
      } else {
        // Handle case where recent_rides is not an array
        updatedRoutes = [routeString];
      }

      const { error: updateError } = await executeSupabaseQuery(() =>
        supabase
          .from('users')
          .update({ recent_rides: updatedRoutes })
          .eq('email', user.email),
      );

      if (updateError) {
        console.error('Error updating user routes:', updateError);
      }
    }
  } catch (error) {
    console.error('Unexpected error in setUserRecentRoute:', error);
  }
}

/**
 * Function to get user data by email
 * @param {string} email - User's email
 * @returns {Promise<User|null>} User data or null
 */
export async function getUserData(email) {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('users').select('*').eq('email', email).single(),
    );

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user data after retries:', error);
    return null;
  }
}

/**
 * Get all stops without filtering
 * @returns {Promise<Stop[]>} Array of stops
 */
export async function getUnfilteredStops() {
  try {
    // Use pagination to prevent large response size, but ensure we get the complete stop data
    const data = await fetchPaginatedData(
      supabase.from('stops').select('stop_id, stop_name, stop_lat, stop_lon'),
      300, // Increased page size for better coverage
      3000, // Increased maximum stops to ensure we get all important ones
    );

    // Map all stops without filtering duplicates
    const stops = data.map((stop) => ({
      stop_id: stop.stop_id,
      name: stop.stop_name,
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    }));

    // If we're filtering too much, let's ensure at least the main stops are included
    if (stops.length < 100) {
      console.warn(
        'Unusually small number of stops retrieved, consider adjusting limits',
      );
    }

    return stops;
  } catch (error) {
    console.error('Failed to get stops after retries:', error);
    return [];
  }
}

/**
 * Get stop times for a specific stop
 * @param {string} stop_id - The stop ID
 * @returns {Promise<StopTime[]>} Array of stop times
 */
export async function getStopTimes(stop_id) {
  try {
    // Limit the number of stop times returned
    const { data, error } = await executeSupabaseQuery(
      () =>
        supabase
          .from('stop_times')
          .select(
            'trip_id, stop_id, arrival_time, departure_time, stop_sequence',
          )
          .eq('stop_id', stop_id)
          .limit(500), // Limit to 500 results
    );

    if (error) {
      console.error('Error fetching stop times:', error);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Failed to get stop times after retries:', error);
    return [];
  }
}

/**
 * Get all trips
 * @returns {Promise<Trip[]>} Array of trips
 */
export async function getTrip() {
  try {
    // Use pagination to avoid large response payload
    const data = await fetchPaginatedData(
      supabase.from('trips').select('*'),
      200, // 200 per page
      1000, // Max 1000 trips
    );

    return data;
  } catch (error) {
    console.error('Failed to get trips after retries:', error);
    return [];
  }
}

/**
 * Get all shape points grouped by shape_id
 * @returns {Promise<ShapePoint[][]>} Array of shape point arrays
 */
export async function getShapes() {
  try {
    // Get only specific shape IDs instead of all shapes
    // This significantly reduces the response size
    const { data: shapeIds, error: shapeIdsError } = await executeSupabaseQuery(
      () =>
        supabase
          .from('shapes')
          .select('shape_id')
          .order('shape_id', { ascending: true })
          .limit(50), // Limit to 50 unique shape IDs
    );

    if (shapeIdsError) {
      console.error('Error fetching shape IDs:', shapeIdsError);
      return [];
    }

    // Get unique shape IDs
    const uniqueShapeIds = [...new Set(shapeIds.map((item) => item.shape_id))];

    // Create an empty result object
    const groupedShapes = {};

    // Fetch shapes for each shape ID separately
    for (const shapeId of uniqueShapeIds) {
      const { data: shapePoints, error: shapePointsError } =
        await executeSupabaseQuery(
          () =>
            supabase
              .from('shapes')
              .select('shape_pt_lat, shape_pt_lon')
              .eq('shape_id', shapeId)
              .order('shape_pt_sequence', { ascending: true })
              .limit(500), // Limit points per shape
        );

      if (shapePointsError) {
        console.error(
          `Error fetching points for shape ${shapeId}:`,
          shapePointsError,
        );
        continue;
      }

      groupedShapes[shapeId] = shapePoints.map((shape) => ({
        lat: parseFloat(shape.shape_pt_lat),
        lng: parseFloat(shape.shape_pt_lon),
      }));
    }

    // Convert to array of shape paths
    const shapePaths = Object.values(groupedShapes);
    return shapePaths;
  } catch (error) {
    console.error('Failed to get shapes after retries:', error);
    return [];
  }
}

/**
 * Get stops by name, with improved error handling and fallback search
 * @param {string} name - The stop name to search for
 * @returns {Promise<Stop[]>} Array of matching stops
 */
export async function getStopsByName(name) {
  try {
    // First try exact match
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('stops')
        .select('stop_id, stop_name, stop_lat, stop_lon')
        .eq('stop_name', name),
    );

    if (error) {
      console.error('Error fetching stops by name:', error);
      return [];
    }

    // If no results with exact match, try a more flexible search
    if (data.length === 0) {
      const { data: fuzzyData, error: fuzzyError } = await executeSupabaseQuery(
        () =>
          supabase
            .from('stops')
            .select('stop_id, stop_name, stop_lat, stop_lon')
            .ilike('stop_name', `%${name}%`)
            .limit(5),
      );

      if (fuzzyError) {
        console.error('Error in fuzzy stop search:', fuzzyError);
        return [];
      }

      if (fuzzyData.length > 0) {
        console.log(`No exact match for "${name}", using fuzzy match instead`);
        return fuzzyData.map((stop) => ({
          stop_id: stop.stop_id,
          name: stop.stop_name,
          lat: parseFloat(stop.stop_lat),
          lng: parseFloat(stop.stop_lon),
        }));
      }
    }

    return data.map((stop) => ({
      stop_id: stop.stop_id,
      name: stop.stop_name,
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    }));
  } catch (error) {
    console.error('Failed to get stops by name after retries:', error);
    return [];
  }
}

/**
 * Get trips by service IDs
 * @param {string[]} serviceIds - Array of service IDs
 * @returns {Promise<Trip[]>} Array of matching trips
 */
export async function getTripsForServiceIds(serviceIds) {
  if (serviceIds.length === 0) return [];

  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase.from('trips').select('*').in('service_id', serviceIds),
    );

    if (error) {
      console.error('Error fetching trips by service IDs:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to get trips for service IDs after retries:', error);
    return [];
  }
}

/**
 * Get trip details with route information
 * @param {string} tripId - The trip ID
 * @returns {Promise<object|null>} Trip details or null if not found
 */
export async function getTripDetails(tripId) {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('trips')
        .select('*, routes(route_id, route_short_name, route_long_name)')
        .eq('trip_id', tripId)
        .single(),
    );

    if (error) {
      console.error('Error fetching trip details:', error);
      return null;
    }

    // Format the trip name using route information if available
    if (data) {
      // Add a formatted trip_name property if it doesn't exist
      if (!data.trip_name && data.routes) {
        const routeInfo = data.routes;
        data.trip_name = routeInfo.route_short_name
          ? `${routeInfo.route_short_name} ${routeInfo.route_long_name || ''}`.trim()
          : data.trip_headsign || 'Unknown Route';
      } else if (!data.trip_name) {
        data.trip_name = data.trip_headsign || 'Unknown Route';
      }
    }

    return data;
  } catch (error) {
    console.error('Failed to get trip details after retries:', error);
    return null;
  }
}

/**
 * Get multiple trip details in a batch to reduce API calls
 * @param {string[]} tripIds - Array of trip IDs
 * @returns {Promise<object[]>} Array of trip details
 */
export async function getBatchTripDetails(tripIds) {
  if (!tripIds || tripIds.length === 0) return [];

  try {
    // Fetch trips in batches of 50 to avoid large queries
    const batchSize = 50;
    let allTripDetails = [];

    for (let i = 0; i < tripIds.length; i += batchSize) {
      const batchIds = tripIds.slice(i, i + batchSize);

      const { data, error } = await executeSupabaseQuery(() =>
        supabase
          .from('trips')
          .select('*, routes(route_id, route_short_name, route_long_name)')
          .in('trip_id', batchIds),
      );

      if (error) {
        console.error(`Error fetching batch trip details (batch ${i}):`, error);
        continue;
      }

      // Process each trip to add formatted names
      const processedData = data.map((trip) => {
        if (!trip.trip_name && trip.routes) {
          const routeInfo = trip.routes;
          trip.trip_name = routeInfo.route_short_name
            ? `${routeInfo.route_short_name} ${routeInfo.route_long_name || ''}`.trim()
            : trip.trip_headsign || 'Unknown Route';
        } else if (!trip.trip_name) {
          trip.trip_name = trip.trip_headsign || 'Unknown Route';
        }
        return trip;
      });

      allTripDetails = [...allTripDetails, ...processedData];
    }

    return allTripDetails;
  } catch (error) {
    console.error('Failed to get batch trip details after retries:', error);
    return [];
  }
}

/**
 * Get stop details with name fallback
 * @param {string} stopId - The stop ID
 * @returns {Promise<object|null>} Stop details or null if not found
 */
export async function getStopDetails(stopId) {
  try {
    const { data, error } = await executeSupabaseQuery(() =>
      supabase
        .from('stops')
        .select('stop_id, stop_name, stop_lat, stop_lon')
        .eq('stop_id', stopId)
        .single(),
    );

    if (error) {
      console.error('Error fetching stop details:', error);
      return {
        stop_id: stopId,
        stop_name: 'Unknown Stop',
        stop_lat: 0,
        stop_lon: 0,
      };
    }

    return data;
  } catch (error) {
    console.error('Failed to get stop details after retries:', error);
    return {
      stop_id: stopId,
      stop_name: 'Unknown Stop',
      stop_lat: 0,
      stop_lon: 0,
    };
  }
}
