'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '../loading'; // Import the loading spinner

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <LoadingSpinner />, // Use the loading spinner
});

function DynamicMap() {
  return <Map />;
}

export default DynamicMap;
