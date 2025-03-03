import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Settings() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='bg-mist min-h-[calc(100vh-100px)] py-10'>
      <div className='mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md'>
        <h1 className='mb-6 text-3xl font-bold'>Settings</h1>

        <div className='space-y-6'>
          <div className='space-y-3'>
            <h2 className='text-xl font-semibold'>Account Preferences</h2>
            <div className='rounded-lg border border-gray-200 p-4'>
              <p className='text-gray-700'>
                You re signed in as <strong>{session.user?.email}</strong>
              </p>
              <p className='mt-2 text-sm text-gray-500'>
                Connected with Google Account
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <h2 className='text-xl font-semibold'>Application Settings</h2>
            <div className='rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <span>Dark Mode</span>
                <span className='text-sm text-gray-500'>Coming soon</span>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <span>Language</span>
                <span className='text-sm text-gray-500'>English</span>
              </div>
            </div>
          </div>

          <div className='pt-4'>
            <Link href='/profile'>
              <button className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
                Back to Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
