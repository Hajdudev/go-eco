'use client';

import Link from 'next/link';
import { useAppContext } from '../context/AppProvider';
import { useSession } from 'next-auth/react';

function RecentRoutes() {
  const { user } = useAppContext();
  const { status } = useSession();
  const recentRoutes = user?.recent_rides || [];
  const isLoading = status === 'loading';

  // Calculate placeholder items needed to reach 7 total items
  const placeholderCount = Math.max(0, 7 - recentRoutes.length);

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
      {user !== null ? (
        recentRoutes.length === 0 ? (
          // Case when user is logged in but has no recent routes
          <div>
            <div className='bg-slateblack h-1 w-full'></div>
            <div className='bg-mist flex min-h-[200px] flex-col rounded-b-2xl p-4 text-center font-bold md:min-h-[300px]'>
              <span>You don t have any recent routes.</span>
              <Link href='/'>
                <button className='bg-primary hover:bg-opacity-90 mt-4 rounded-md px-4 py-2 text-black'>
                  Find a route
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // Case when user has recent routes
          <div>
            {/* Render actual routes */}
            {recentRoutes.map((route, index) => {
              const parts = route.split(' → ');
              const from = parts[0];
              const to = parts[1];
              const isLastItem =
                index === recentRoutes.length - 1 && placeholderCount === 0;

              return (
                <div key={`route-${index}`}>
                  <div className='bg-slateblack h-1 w-full'></div>
                  <Link
                    href={`/find/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
                  >
                    <div
                      className={`bg-mist cursor-pointer p-4 font-bold hover:bg-gray-200 ${isLastItem ? 'rounded-b-2xl' : ''}`}
                    >
                      {route}
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* Render placeholder items to fill space */}
            {Array(placeholderCount)
              .fill(0)
              .map((_, index) => {
                const isLastPlaceholder = index === placeholderCount - 1;

                return (
                  <div key={`placeholder-${index}`}>
                    <div className='bg-slateblack h-1 w-full'></div>
                    <div
                      className={`bg-mist p-4 opacity-50 ${isLastPlaceholder ? 'rounded-b-2xl' : ''}`}
                    >
                      <div className='h-6'></div>{' '}
                      {/* Empty space with same height as route text */}
                    </div>
                  </div>
                );
              })}
          </div>
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
