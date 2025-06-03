'use client';
import { useSearchParams } from 'next/navigation';
// import { useAppContext } from '../../context/AppProvider';
import { useState, useMemo } from 'react';
import InitialModal from '@/app/_components/InitialModal';
import DateSelector from '@/app/_components/DateSelector';
import { useQuery } from '@tanstack/react-query';
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
type RouteResult = {
  TripId: string;
  TripName: string;
  FromStopId: string;
  FromStopName: string;
  ToStopId: string;
  ToStopName: string;
  DepartureTime: string;
  ArrivalTime: string;
  ServiceId?: string;
  DepartureDayOffset?: number;
  ArrivalDayOffset?: number;
  SearchDate?: string;
};

export default function Route() {
  // const { user, trips } = useAppContext();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  // const fromId = searchParams.get('fromId');
  // const toId = searchParams.get('toId');
  const dateParam = searchParams.get('date');

  const [selectedDate] = useState<Date>(() => {
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date();
  });

  const { isPending, data, error } = useQuery<RouteResult[]>({
    queryKey: ['routes'],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API}/find/route?from=${encodeURIComponent(from ?? '')}&to=${encodeURIComponent(to ?? '')}&date=${formatDate(selectedDate)}`;
      return fetch(url).then((res) => res.json());
    },
    enabled: !!from && !!to && !!selectedDate,
  });
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
                      {/* current time logic can be added here if needed */}
                      {'--:--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPending ? (
          <div className='flex h-64 flex-col items-center justify-center'>
            <div className='border-primary mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2'></div>
            <p className='text-gray-600'>Loading...</p>
            <p className='mt-2 text-sm text-gray-500'>
              This might take a moment...
            </p>
          </div>
        ) : error ? (
          <div className='rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
            <p>{(error as Error).message || 'Error loading routes'}</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className='rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700'>
            <p>No routes found in the next 24 hours between these locations.</p>
          </div>
        ) : (
          <div>
            <div className='max-h-[350px] overflow-y-auto rounded-lg bg-white shadow-lg'>
              {data.map((route, index) => (
                <div
                  key={index}
                  className='border-b border-gray-100 p-4 transition-colors hover:bg-blue-50'
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center'>
                      <span className='font-medium'>
                        {route.TripName && route.TripName !== 'Unknown Route'
                          ? route.TripName
                          : `Route to ${route.ToStopName}`}
                      </span>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='border-r border-gray-100 pr-4'>
                      <p className='text-xs text-gray-500'>Departure</p>
                      <div className='flex items-center'>
                        <p className='font-bold text-blue-600'>
                          {route.DepartureTime}
                        </p>
                      </div>
                      <p>{route.FromStopName}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Arrival</p>
                      <div className='flex items-center'>
                        <p className='font-bold text-green-600'>
                          {route.ArrivalTime}
                        </p>
                      </div>
                      <p>{route.ToStopName}</p>
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
