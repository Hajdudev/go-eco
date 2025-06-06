'use client';

import Link from 'next/link';
import { useAppContext } from '../context/AppProvider';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

function RecentRoutes() {
  const { user } = useAppContext();
  const { status } = useSession();
  const isLoading = status === 'loading';
  const recentRoutes = user?.recent_rides || [];
  const router = useRouter();

  // Use callback to handle route click to force navigation even for same route
  const handleRouteClick = useCallback(
    (from: string, to: string, e: React.MouseEvent) => {
      e.preventDefault();
      // Add a timestamp parameter to force a new navigation even if the route is the same
      const timestamp = Date.now();
      router.push(
        `/find/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&_=${timestamp}`,
      );
    },
    [router],
  );

  if (isLoading) {
    return (
      <div>
        <div className='bg-slateblack h-1 w-full'></div>
        <div className='bg-mist flex min-h-[200px] flex-col items-center justify-center rounded-b-2xl p-4 text-center font-bold md:min-h-[300px]'>
          <div className='border-primary mb-4 h-8 w-8 animate-spin rounded-full border-t-2 border-b-2'></div>
          <p>Loading your routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {status === 'authenticated' && user ? (
        recentRoutes.length === 0 ? (
          // Case when user is logged in but has no recent routes
          <div>
            <div className='bg-slateblack h-1 w-full'></div>
            <div className='bg-mist flex min-h-[200px] flex-col rounded-b-2xl p-4 text-center font-bold md:min-h-[300px]'>
              <span>You don&apos;t have any recent routes.</span>
              <Link href='/'>
                <button className='bg-primary hover:bg-opacity-90 mt-4 rounded-md px-4 py-2 text-black'>
                  Find a route
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // Case when user has recent routes
          recentRoutes.map((route, index) => {
            const isLastItem = index === recentRoutes.length - 1;
            // Parse the route string to get from/to values
            const parts = route.split(' → ');
            const from = parts[0];
            const to = parts[1];

            return (
              <div key={`route-${index}`}>
                <div className='bg-slateblack h-1 w-full'></div>
                <div
                  className={`bg-mist cursor-pointer p-4 font-bold hover:bg-gray-200 ${isLastItem ? 'rounded-b-2xl' : ''}`}
                  onClick={(e) => handleRouteClick(from, to, e)}
                >
                  {route}
                </div>
              </div>
            );
          })
        )
      ) : (
        // Case when user is not logged in
        <div>
          <div className='bg-slateblack h-1 w-full'></div>
          <div className='bg-mist flex min-h-[200px] flex-col rounded-b-2xl p-4 text-center font-bold md:min-h-[300px] lg:min-h-[400px] xl:min-h-[500px]'>
            <span>You are not logged in</span>
            <Link href='/auth/signin'>
              <button className='bg-primary hover:bg-opacity-90 mt-4 rounded-md px-4 py-2 text-black'>
                Sign in
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentRoutes;
