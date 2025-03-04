'use client';

import { useRouter } from 'next/navigation';

import { useAppContext } from '../context/AppProvider';

function LogOutButton() {
  const router = useRouter();
  const { isLoading } = useAppContext();

  const handleSignOut = () => {
    router.push('/auth/signout');
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className='ml-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-70'
    >
      {isLoading ? 'Loading...' : 'Sign out'}
    </button>
  );
}

export default LogOutButton;
