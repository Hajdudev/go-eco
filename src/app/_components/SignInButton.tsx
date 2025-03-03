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
      className='bg-secondary rounded-full px-2 py-2 text-xl font-bold text-white disabled:opacity-70 md:inline-block'
    >
      {isLoading ? 'Loading...' : 'Signup/Register'}
    </button>
  );
}

export default SignInButton;
