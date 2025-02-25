'use client';

import { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { getStops } from '@/services/apiStops';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
];

export function Map() {
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });

  useEffect(() => {
    async function fetchStops() {
      try {
        const stops = await getStops();
        setMarkers(stops); // stops are already in the correct format {lat, lng}
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    }
    fetchStops();
  }, []); // Remove markers dependency to prevent infinite loop

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
      center={{ lat: 51.5074, lng: -0.1278 }} // Update to your desired center
      zoom={10}
      onClick={handleMapClick}
    >
      {markers.map((marker, index) => (
        <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
      ))}
    </GoogleMap>
  );
}

export default Map;
