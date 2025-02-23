import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='border-primary h-16 w-16 animate-spin rounded-full border-4 border-dashed'></div>
    </div>
  );
};

export default LoadingSpinner;
