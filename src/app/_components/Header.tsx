'use client';

import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div>
      <div className='align-center mx-2 mt-2 flex justify-between'>
        <div className='align-center flex grow-1 items-center'>
          <span className='px-4 text-lg font-bold md:text-2xl lg:mr-2 lg:text-4xl'>
            GoEco 🌿
          </span>
          <div className='lg:24 hidden font-bold md:mr-18 md:flex md:max-w-64 md:grow-1 md:justify-between lg:text-2xl'>
            <span className='group relative'>
              Prices
              <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
            </span>
            <span className='group relative'>
              About
              <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
            </span>
            <span className='group relative'>
              Contact
              <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
            </span>
          </div>
        </div>
        <div className='flex items-center gap-5'>
          <span className='bg-primary rounded-full px-4 py-3'>
            <span className='text-xl font-bold'>Find Route</span>
            <MagnifyingGlassIcon className='ml-1 inline-block h-7 rotate-90' />
          </span>
          <span className='bg-secondary hidden rounded-full px-4 py-3.5 text-xl font-bold text-white md:inline-block'>
            Signup/Register
          </span>
          <Bars3Icon
            onClick={toggleMenu}
            className='inline-block h-16 cursor-pointer md:hidden'
          />
        </div>
      </div>

      <div
        className={`bg-slateblack fixed top-0 right-0 h-screen w-[80%] transform rounded-l-3xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='relative flex h-full flex-col items-center space-y-4'>
          <div className='font-white mt-4 mb-6 text-4xl font-bold text-white'>
            <span>GoEco 🌿</span>
            <XMarkIcon
              onClick={toggleMenu}
              className='ml-20 inline-block h-16 cursor-pointer'
            />
          </div>
          <span className='bg-primary my-12 inline-block rounded-full px-8 py-3'>
            <span className='text-xl font-bold'>Find Route</span>
            <MagnifyingGlassIcon className='ml-1 inline-block h-7 rotate-90' />
          </span>
          <span className='bg-secondary inline-block rounded-full px-8 py-4 text-xl font-bold text-white'>
            Signup/Register
          </span>
          <div className='mt-24 flex flex-col items-center justify-between gap-6 text-3xl font-bold text-white'>
            <div>
              <span>About</span>
              <ArrowRightIcon className='ml-3 inline h-6 w-6' />
            </div>
            <div>
              <span>Contact</span>
              <ArrowRightIcon className='ml-3 inline h-6 w-6' />
            </div>
            <div>
              <span>Price</span>
              <ArrowRightIcon className='ml-3 inline h-6 w-6' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
