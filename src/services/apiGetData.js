'use server';
import supabase from './supabaseClient';

async function executeSupabaseQuery(queryFn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await queryFn();
      return result;
    } catch (error) {
      console.error(`Query attempt ${attempt + 1} failed:`, error);
      lastError = error;

      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

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
          hasMore = false;
        } else {
          page++;
          continue;
        }
      } else {
        consecutiveEmptyResponses = 0;
        allData = [...allData, ...data];
        page++;

        if (data.length < pageSize) {
          hasMore = false;
        }

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

export async function getActiveServiceIds(selectedDate) {
  const today = selectedDate || new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  const dayOfWeek = today.getDay();
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const dayColumn = dayNames[dayOfWeek];

  try {
    const { data: exceptionData, error: exceptionError } =
      await executeSupabaseQuery(() =>
        supabase
          .from('calendar_dates')
          .select('service_id, exception_type')
          .eq('date', formattedDate),
      );

    if (exceptionError) {
      console.error('Error fetching calendar date exceptions:', exceptionError);
    }

    const { data: calendarData, error: calendarError } =
      await executeSupabaseQuery(() =>
        supabase
          .from('calendar')
          .select('service_id')
          .eq(dayColumn, 1)
          .lte('start_date', formattedDate)
          .gte('end_date', formattedDate),
      );

    if (calendarError) {
      console.error('Error fetching calendar data:', calendarError);
    }

    const addedServices = exceptionData
      ? exceptionData
          .filter((item) => item.exception_type === 1)
          .map((item) => item.service_id)
      : [];

    const removedServices = exceptionData
      ? exceptionData
          .filter((item) => item.exception_type === 2)
          .map((item) => item.service_id)
      : [];

    const regularServices = calendarData
      ? calendarData.map((item) => item.service_id)
      : [];

    const activeServiceIds = [
      ...regularServices.filter((id) => !removedServices.includes(id)),
      ...addedServices,
    ];

    const uniqueServiceIds = [...new Set(activeServiceIds)];

    return uniqueServiceIds;
  } catch (error) {
    console.error('Unexpected error in getActiveServiceIds:', error);
    return [];
  }
}
export async function getTodayCalendar(selectedDate) {
  const serviceIds = await getActiveServiceIds(selectedDate);

  if (serviceIds.length === 0) {
    return { service_id: '', date: '' };
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return serviceIds.map((service_id) => ({
    service_id,
    date: formattedDate,
  }));
}

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

export async function getUnfilteredStops() {
  try {
    const data = await fetchPaginatedData(
      supabase.from('stops').select('stop_id, stop_name, stop_lat, stop_lon'),
      300,
      3000,
    );

    const stops = data.map((stop) => ({
      stop_id: stop.stop_id,
      name: stop.stop_name,
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    }));

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

export async function getTrip() {
  try {
    const data = await fetchPaginatedData(
      supabase.from('trips').select('*'),
      200,
      1000,
    );

    return data;
  } catch (error) {
    console.error('Failed to get trips after retries:', error);
    return [];
  }
}

export async function getShapes() {
  try {
    const { data: shapeIds, error: shapeIdsError } = await executeSupabaseQuery(
      () =>
        supabase
          .from('shapes')
          .select('shape_id')
          .order('shape_id', { ascending: true })
          .limit(50),
    );

    if (shapeIdsError) {
      console.error('Error fetching shape IDs:', shapeIdsError);
      return [];
    }

    const uniqueShapeIds = [...new Set(shapeIds.map((item) => item.shape_id))];

    const groupedShapes = {};

    for (const shapeId of uniqueShapeIds) {
      const { data: shapePoints, error: shapePointsError } =
        await executeSupabaseQuery(() =>
          supabase
            .from('shapes')
            .select('shape_pt_lat, shape_pt_lon')
            .eq('shape_id', shapeId)
            .order('shape_pt_sequence', { ascending: true })
            .limit(500),
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

    const shapePaths = Object.values(groupedShapes);

    return shapePaths;
  } catch (error) {
    console.error('Failed to get shapes after retries:', error);
    return [];
  }
}
