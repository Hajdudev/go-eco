'use client';

import { useEffect, Suspense } from 'react';
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
} from '@react-google-maps/api';
import { getShapes, getStops } from '@/services/apiStops';
import LoadingSpinner from '../loading';
import { useAppContext } from '../context/AppProvider';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
];

export function Map() {
  const {
    shapes,
    setShapes,
    markers,
    setMarkers,
    selectedPlace,
    setSelectedPlace,
  } = useAppContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });
  useEffect(() => {
    async function fetchStops() {
      try {
        const stops = await getStops();
        setMarkers(stops);
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    }
    async function fetchShapes() {
      try {
        const shapesData = await getShapes();
        // Ensure the shapes data matches the expected type
        const typedShapes: google.maps.LatLngLiteral[][] = shapesData.map(
          (shape) =>
            shape.map((point) => ({
              lat: point.lat,
              lng: point.lng,
            })),
        );
        setShapes(typedShapes);
      } catch (error) {
        console.error('Error fetching shapes:', error);
      }
    }
    fetchStops();
    fetchShapes();
  }, [setMarkers, setShapes]);
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: 48.148598, lng: 17.107748 }} // Update to your desired center
        zoom={16}
      >
        <>
          {shapes.map((shape, index) => (
            <Polyline
              key={index}
              path={shape}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          ))}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              onClick={() => {
                if (marker === selectedPlace) {
                  setSelectedPlace(null);
                } else {
                  setSelectedPlace(marker);
                }
              }}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </>

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          >
            <div>
              <h2>{selectedPlace.name}</h2>
              <p>Lat: {selectedPlace.lat}</p>
              <p>Lng: {selectedPlace.lng}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Suspense>
  );
}

export default Map;
