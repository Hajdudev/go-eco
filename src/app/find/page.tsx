import { MapPinIcon } from '@heroicons/react/24/solid';
import RecentRoutes from '../_components/RecentRoutes';
import { Suspense } from 'react';
import LoadingSpinner from '../loading';

export default async function Page() {
  return (
    <div className='bg-secondary mt-8 max-h-[650px] w-full rounded-4xl p-6 text-center'>
      <div className='bg-primary rounded-t-2xl px-6 py-2 text-xl font-bold'>
        <span>Recent Routes</span>
        <MapPinIcon className='inline-block h-6 w-6' />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <RecentRoutes />
      </Suspense>
    </div>
  );
}
