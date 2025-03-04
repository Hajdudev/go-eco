import { getShapes, getTrip, getUnfilteredStops } from '@/services/apiGetData';
import ContextInitializer from '../loadData';
import DynamicMap from '../_components/DynamicMap';


async function MapWithData() {
  const stops = await getUnfilteredStops();
  const shapesData = await getShapes();
  const trips = await getTrip();

  const typedShapes = shapesData.map((shape) =>
    shape.map((point) => ({
      lat: point.lat,
      lng: point.lng,
    })),
  );

  return (
    <>
      <ContextInitializer
        initialStops={stops}
        initialShapes={typedShapes}
        initialTrips={trips}
      />
      <DynamicMap />
    </>
  );
  
}

export default MapWithData;