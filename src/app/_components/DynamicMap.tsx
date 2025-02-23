'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
});

function DynamicMap() {
  return <Map />;
}

export default DynamicMap;
