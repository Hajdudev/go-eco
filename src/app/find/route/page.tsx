'use client';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context/AppProvider';
import { useState, JSX, useMemo } from 'react';
import InitialModal from '@/app/_components/InitialModal';
import DateSelector from '@/app/_components/DateSelector';
import { QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';

type RouteResult = {
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
  searchDate?: string;
};
const queryClient = useQueryClient();
export default function Paqe() {
  <QueryClientProvider client={queryClient}>
    <Route />
  </QueryClientProvider>;
}

function Route() {
  const { user, trips } = useAppContext();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const fromId = searchParams.get('fromId');
  const toId = searchParams.get('toId');
  const dateParam = searchParams.get('date');

  const { isPending, data } = useQuery({
    queryKey: ['routes'],
    queryFn: () =>
      fetch('http://localhost:3001/find/route?from=Hlavn%C3%A1%20stanica&to=Pod%20stanicou&date=2025-05-13').then((res) =>
        res.json(),
      ),
  })


  const [selectedDate] = useState<Date>(() => {
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date();
  });

  const [loading] = useState(true);
  const [routes] = useState<RouteResult[]>([]);
  const [error] = useState<string | null>(null);
  const [loadingStatus] = useState<string>('Initializing...');
  const [currentTime] = useState<string>('');

  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

  const isTomorrow = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return selectedDate.toDateString() === tomorrow.toDateString();
  }, [selectedDate]);

  const formattedDateStr = useMemo(() => {
    if (isToday) {
      return 'Today';
    } else if (isTomorrow) {
      return 'Tomorrow';
    } else {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  }, [selectedDate, isToday, isTomorrow]);

  function formatTimeDisplay(timeString: string): string {
    return timeString;
  }
  function getWaitTime(currentTime: string, departureTime: string): string {
    return '';
  }
  function calculateDuration(startTime: string, endTime: string): string {
    return '';
  }
  function determineArrivalDay(
    currentTime: string,
    departureTime: string,
    arrivalTime: string,
    departureDayOffset?: number,
    arrivalDayOffset?: number,
  ): JSX.Element | null {
    return null;
  }
  function isRouteToday(
    currentTime: string,
    departureTime: string,
    departureDayOffset?: number,
  ): boolean {
    return true;
  }
  function formatTime(timeString: string): string {
    return timeString;
  }
  const formattedCurrentTime = currentTime ? formatTime(currentTime) : '--:--';

  return (
    <>
      <InitialModal />
      <div className='bg-secondary mt-8 min-h-[550px] w-full rounded-4xl p-6'>
        <div className='mb-4 flex flex-col space-y-4'>
          <div className='col-span-full'>
            <div className='rounded-lg bg-white px-4 py-3 shadow'>
              <div className='mb-2 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-800'>
                  Route Details
                </h2>
                <DateSelector />
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='col-span-2 space-y-2'>
                  <div className='flex items-center'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-blue-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-xs text-gray-500'>From</p>
                      <p className='font-medium'>{from || 'Not selected'}</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-green-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-xs text-gray-500'>To</p>
                      <p className='font-medium'>{to || 'Not selected'}</p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col justify-center space-y-1 border-l pl-4'>
                  <div>
                    <p className='text-xs text-gray-500'>Date</p>
                    <p
                      className={`font-medium ${isToday ? 'text-green-600' : isTomorrow ? 'text-blue-600' : ''}`}
                    >
                      {formattedDateStr}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Current time</p>
                    <p className='font-medium text-blue-600'>
                      {formattedCurrentTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!loading && !error && routes.length > 0 && !isToday && (
          <div className='mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800'>
            <div className='flex'>
              <svg
                className='mr-2 h-5 w-5 flex-shrink-0'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <span>
                Showing {routes.length} routes for {formattedDateStr}. Times may
                be subject to change.
              </span>
            </div>
          </div>
        )}

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
            <div className='max-h-[350px] overflow-y-auto rounded-lg bg-white shadow-lg'>
              {routes.map((route, index) => (
                <div
                  key={index}
                  className='border-b border-gray-100 p-4 transition-colors hover:bg-blue-50'
                >
                  {/* Route UI with date context */}
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center'>
                      <span className='font-medium'>
                        {route.tripName && route.tripName !== 'Unknown Route'
                          ? route.tripName
                          : `Route to ${route.toStopName}`}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      {/* Day indicator based on date context */}
                      {isToday ? (
                        isRouteToday(
                          currentTime,
                          route.departureTime,
                          route.departureDayOffset,
                        ) ? (
                          <span className='mr-3 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800'>
                            Today
                          </span>
                        ) : (
                          <span className='mr-3 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800'>
                            Tomorrow
                          </span>
                        )
                      ) : isTomorrow ? (
                        route.departureDayOffset &&
                          route.departureDayOffset > 0 ? (
                          <span className='mr-3 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800'>
                            {`Next day`}
                          </span>
                        ) : (
                          <span className='mr-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
                            Tomorrow
                          </span>
                        )
                      ) : (
                        <span className='mr-3 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800'>
                          {route.departureDayOffset &&
                            route.departureDayOffset > 0
                            ? `+${route.departureDayOffset + 1} days`
                            : formattedDateStr.split(',')[0]}{' '}
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
