import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/outline';

function Header() {
  return (
    <div className='align-center flex justify-between'>
      <div className='align-center flex items-center'>
        <span className='px-4 py-3 text-2xl font-bold'>GoEco 🌿</span>
        <div className='hidden gap-5 md:flex'>
          <span>About</span>
          <span>Contact</span>
          <span>Prices</span>
        </div>
      </div>
      <div className='flex items-center gap-5'>
        <span className='bg-primary rounded-full px-4 py-3'>
          <span className='text-xl font-bold'>Find Route</span>
          <MagnifyingGlassIcon className='ml-1 inline-block h-7 rotate-90' />
        </span>
        <span className='bg-secondary rounded-full px-4 py-4 text-xl font-bold text-white'>
          Signup
        </span>
        <Bars3Icon className='inline-block h-16' />
      </div>
    </div>
  );
}

export default Header;
