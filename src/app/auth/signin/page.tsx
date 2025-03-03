'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl });
    setIsLoading(false);
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
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
          <div className='space-y-4'>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50'
            >
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                {/* Google logo or icon can go here */}
              </span>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <Link href='/' className='text-blue-600 hover:text-blue-800'>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
