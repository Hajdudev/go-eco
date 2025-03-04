import React, { Suspense } from 'react';

import MapWithData from '../_components/MapWithData';

import SearchForm from '../_components/SearchForm';

import LoadingSpinner from '../loading';
import SessionSync from '../SessionSync';


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='md:py-1f0 flex h-full w-screen gap-26 p-8'>
      <main className='w-full lg:w-[40%]'>
        <SearchForm />
        {children}
        <SessionSync />
      </main>
      <div className='hidden w-[60%] lg:block'>
        <Suspense fallback={<LoadingSpinner />}>
          <MapWithData />
        </Suspense>
      </div>
    </div>
  );
}
