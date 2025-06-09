import InitialModal from '@/app/_components/InitialModal';
import DateSelector from '@/app/_components/DateSelector';

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

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isTomorrow(date: Date): boolean {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

function formattedDateStr(date: Date) {
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }
}

export default async function RoutePage({
  params,
}: {
  params: { from: string; to: string; date: string };
}) {
  const { from, to, date } = params;

  let dateObj = new Date();
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      dateObj = parsedDate;
    }
  }

  let data: RouteResult[] = [];
  let errorMsg: string | null = null;

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/find/route?from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}&date=${formatDate(dateObj)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch routes');
    data = await res.json();
  } catch (e: any) {
    errorMsg = e.message;
  }

  return (
    <>
      <InitialModal />
      <div className="bg-secondary mt-8 min-h-[550px] w-full rounded-4xl p-6">
        <div className="mb-4 flex flex-col space-y-4">
          <div className="col-span-full">
            <div className="rounded-lg bg-white px-4 py-3 shadow">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Route Details</h2>
                <DateSelector />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      {/* SVG icon */}
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">From</p>
                      <p className="font-medium">{from || 'Not selected'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      {/* SVG icon */}
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">To</p>
                      <p className="font-medium">{to || 'Not selected'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 border-l pl-4">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className={`font-medium ${isToday(dateObj) ? 'text-green-600' : isTomorrow(dateObj) ? 'text-blue-600' : ''}`}>
                      {formattedDateStr(dateObj)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current time</p>
                    <p className="font-medium text-blue-600">
                      {'--:--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!errorMsg && (!data || data.length === 0) ? (
          <div className="rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700">
            <p>No routes found in the next 24 hours between these locations.</p>
          </div>
        ) : errorMsg ? (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <p>{errorMsg}</p>
          </div>
        ) : (
          <div>
            <div className="max-h-[350px] overflow-y-auto rounded-lg bg-white shadow-lg">
              {data.map((route, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 p-4 transition-colors hover:bg-blue-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {route.TripName && route.TripName !== 'Unknown Route'
                          ? route.TripName
                          : `Route to ${route.ToStopName}`}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-r border-gray-100 pr-4">
                      <p className="text-xs text-gray-500">Departure</p>
                      <div className="flex items-center">
                        <p className="font-bold text-blue-600">
                          {route.DepartureTime}
                        </p>
                      </div>
                      <p>{route.FromStopName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Arrival</p>
                      <div className="flex items-center">
                        <p className="font-bold text-green-600">
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
