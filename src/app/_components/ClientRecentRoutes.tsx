'use client';

import { Suspense } from 'react';
import LoadingSpinner from '../loading';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled is allowed in client components
const DynamicRecentRoutes = dynamic(() => import('./RecentRoutes'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function ClientRecentRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DynamicRecentRoutes />
    </Suspense>
  );
}
