'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useAppContext } from '@/app/context/AppProvider';

export default function SignOut() {
  const [currentIsLoading, currentSetIsLoading] = useState(false);
  const { setIsLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  }, [setIsLoading]);

  const handleSignOut = async () => {
    try {
      currentSetIsLoading(true);
      // The callbackUrl parameter specifies where to redirect after signing out
      await signOut({ callbackUrl: '/find', redirect: true });

      // This line may not execute if redirect: true works as expected
      router.push('/find');
    } catch (error) {
      console.error('Error signing out:', error);
      currentSetIsLoading(false);
    }
  };

  return (
    <div className='bg-mist flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h1 className='text-center text-4xl font-bold tracking-tight text-gray-900'>
            GoEco 🌿
          </h1>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Sign out of your account
          </h2>
          <p className='mt-4 text-center text-gray-600'>
            Are you sure you want to sign out?
          </p>
        </div>

        <div className='mt-8 space-y-6'>
          <button
            onClick={handleSignOut}
            disabled={currentIsLoading}
            className='group relative flex w-full justify-center rounded-md bg-red-500 px-4 py-3 text-lg font-bold text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70'
          >
            {currentIsLoading ? 'Signing out...' : 'Sign out'}
          </button>

          <Link href='/find'>
            <button className='group relative flex w-full justify-center rounded-md bg-gray-200 px-4 py-3 text-lg font-bold text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none'>
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
