import React, { Suspense } from 'react';

import DynamicMap from '../_components/DynamicMap';

import SearchForm from '../_components/SearchForm';
import { getShapes, getTrip, getUnfilteredStops } from '@/services/apiGetData';
import ContextInitializer from '../loadData';
import LoadingSpinner from '../loading';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <div className='flex h-full w-screen gap-26 p-8 md:py-10'>
      <main className='w-full lg:w-[40%]'>
        <SearchForm />
        {children}
      </main>
      <Suspense fallback={<LoadingSpinner />}>
        <div className='hidden w-[60%] lg:block'>
          <ContextInitializer
            initialStops={stops}
            initialShapes={typedShapes}
            initialTrips={trips}
          />
          <DynamicMap />
        </div>
      </Suspense>
    </div>
  );
}
