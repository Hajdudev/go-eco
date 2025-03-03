import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='bg-mist min-h-[calc(100vh-100px)] py-10'>
      <div className='mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md'>
        <h1 className='mb-6 text-3xl font-bold'>Your Profile</h1>

        <div className='flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6'>
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Profile picture'}
              width={120}
              height={120}
              className='rounded-full'
            />
          ) : (
            <div className='flex h-32 w-32 items-center justify-center rounded-full bg-gray-200'>
              <span className='text-4xl font-bold text-gray-400'>
                {session.user?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}

          <div className='flex-1'>
            <h2 className='text-2xl font-bold'>{session.user?.name}</h2>
            <p className='text-gray-600'>{session.user?.email}</p>

            <div className='mt-6 space-y-4'>
              <div className='rounded-lg bg-gray-50 p-4'>
                <h3 className='font-medium'>Account Information</h3>
                <p className='text-sm text-gray-600'>
                  You are signed in using Google authentication.
                </p>
              </div>

              <Link href='/auth/signout'>
                <button className='rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600'>
                  Sign Out
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
