'use client';
import { useRouter } from 'next/navigation';

import { useAppContext } from '../context/AppProvider';

function SignInButton() {
  const router = useRouter();
  const { isLoading } = useAppContext();

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className='bg-secondary rounded-full px-2 py-2 text-center text-xl font-bold text-white disabled:opacity-70 md:inline-block'
    >
      {isLoading ? 'Loading...' : 'Sign up/Register'}
    </button>
  );
}

export default SignInButton;
