import React from 'react';
import Header from './_components/Header';
import './globals.css';
import DynamicMap from './_components/DynamicMap';
import { Provider } from './context/Provider';
import SearchForm from './_components/SearchForm';
import { getShapes, getTrip, getUnfilteredStops } from '@/services/apiGetData';
import ContextInitializer from './loadData';

export default async function RootLayout({
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
    <html lang='en'>
      <body className='bg-mist overflow-x-hidden'>
        <Provider>
          <Header />
          <div className='flex h-full w-screen gap-26 p-8 md:py-10'>
            <main className='w-full lg:w-[40%]'>
              <SearchForm />
              {children}
            </main>
            <div className='hidden w-[60%] lg:block'>
              <ContextInitializer
                initialStops={stops}
                initialShapes={typedShapes}
                initialTrips={trips}
              />
              <DynamicMap />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
