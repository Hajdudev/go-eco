'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SignInButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    router.push('/auth/signin');
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className='bg-secondary inline-block rounded-2xl px-8 py-4 text-xl font-bold text-white disabled:opacity-70'
    >
      {isLoading ? 'Loading...' : 'Signup/Register'}
    </button>
  );
}

export default SignInButton;
