'use client';

import { useState } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
];

export function Map() {
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMarkers((current) => [
        ...current,
        { lat: event.latLng!.lat(), lng: event.latLng!.lng() },
      ]);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={{ lat: -34.397, lng: 150.644 }}
      zoom={8}
      onClick={handleMapClick}
    >
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} />
      ))}
    </GoogleMap>
  );
}

export default Map;
