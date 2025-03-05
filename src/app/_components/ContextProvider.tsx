import {
  getShapes,
  getTodayCalendar,
  getTrip,
  getUnfilteredStops,
} from '@/services/apiGetData';
import ContextInitializer from '../loadData';

async function ContextProvider() {
  const stops = await getUnfilteredStops();
  const shapesData = await getShapes();
  const trips = await getTrip();
  const todayDayCalendar = await getTodayCalendar();

  const typedShapes = shapesData.map((shape) =>
    shape.map((point) => ({
      lat: point.lat,
      lng: point.lng,
    })),
  );
  return (
    <ContextInitializer
      todayDay={todayDayCalendar}
      initialStops={stops}
      initialShapes={typedShapes}
      initialTrips={trips}
    />
  );
}

export default ContextProvider;
