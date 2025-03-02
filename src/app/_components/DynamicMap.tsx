'use client';

import { Suspense } from 'react';
import { useLoadScript, GoogleMap, InfoWindow } from '@react-google-maps/api';

import LoadingSpinner from '../loading';
import { useAppContext } from '../context/AppProvider';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
];

export function Map() {
  const { selectedPlace } = useAppContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: 48.148598, lng: 17.107748 }} // Update to your desired center
        zoom={16}
      >
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
