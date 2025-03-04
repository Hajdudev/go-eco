'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppProvider';

export default function SignIn() {
  const { setIsLoading } = useAppContext();
  const [currentIsLoading, setCurrentIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  }, [setIsLoading]);

  const handleGoogleSignIn = async () => {
    try {
      setCurrentIsLoading(true);
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setCurrentIsLoading(false);
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
            Sign in to your account
          </h2>
          {error && (
            <div className='mt-2 rounded-md bg-red-100 p-2 text-center text-red-600'>
              {error === 'OAuthSignin' ? 'Error signing in with Google' : error}
            </div>
          )}
        </div>

        <div className='mt-8 space-y-6'>
          <button
            onClick={handleGoogleSignIn}
            disabled={currentIsLoading}
            className='bg-primary group hover:bg-opacity-90 relative flex w-full justify-center rounded-md px-4 py-3 text-lg font-bold text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70'
          >
            {currentIsLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        <div className='mt-6 text-center'>
          <Link
            href='/find'
            className='text-background-text text-lg hover:underline'
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
