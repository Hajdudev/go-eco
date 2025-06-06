'use client';

import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppProvider';
import Link from 'next/link';
import SignInButton from './SignInButton';
import { Session } from 'next-auth';
import Image from 'next/image';
import LogOutButton from './LogOutButton';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  session: Session | null;
}

function Header({ session }: HeaderProps) {
  const { isMenuOpen, setIsMenuOpen } = useAppContext();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className='align-center mx-4 mt-2 flex justify-between md:mx-8'>
        <div className='align-center flex grow-1 items-center'>
          <Link href='/'>
            <span className='text-background-text text-lg font-bold md:text-2xl lg:mr-2 lg:text-4xl'>
              GoEco 🌿
            </span>
          </Link>
          <div className='lg:24 hidden font-bold md:mr-10 md:flex md:max-w-64 md:grow-1 md:justify-between lg:max-w-80 lg:text-2xl'>
            <Link href='/prices'>
              <span className='text-background-text group relative'>
                Prices
                <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
              </span>
            </Link>
            <Link href='/about'>
              <span className='text-background-text group relative'>
                About
                <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
              </span>
            </Link>
            <Link href='/contact'>
              <span className='text-background-text group relative'>
                Contact
                <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
              </span>
            </Link>
          </div>
        </div>
        <div className='flex items-center gap-5'>
          <Link href='/find'>
            <span className='bg-primary rounded-full px-4 py-3'>
              <span className='text-xl font-bold'>Find Route</span>
              <MagnifyingGlassIcon className='ml-1 inline-block h-7 rotate-90' />
            </span>
          </Link>

          {session ? (
            <div className='relative hidden items-center gap-2 md:flex'>
              <div
                className='relative flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-90'
                onClick={() => setShowProfilePopup(!showProfilePopup)}
              >
                <span className='text-sm font-medium'>
                  Hi, {session.user?.name}
                </span>
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                )}
                {/* Dropdown indicator */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className={`transition-transform duration-300 ${showProfilePopup ? 'rotate-180' : ''}`}
                >
                  <path d='M6 9l6 6 6-6' />
                </svg>
              </div>

              {/* Profile popup */}
              {showProfilePopup && (
                <div
                  ref={popupRef}
                  className='ring-opacity-5 absolute top-full right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black focus:outline-none'
                >
                  <div className='py-1'>
                    <div className='block border-b border-gray-100 px-4 py-2 text-sm text-gray-700'>
                      <p className='font-medium text-gray-900'>
                        {session.user?.name}
                      </p>
                      <p className='truncate text-xs text-gray-500'>
                        {session.user?.email}
                      </p>
                    </div>
                    <Link href='/profile'>
                      <span className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                        Your Profile
                      </span>
                    </Link>
                    <Link href='/settings'>
                      <span className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                        Settings
                      </span>
                    </Link>
                    <div className='border-t border-gray-100 pt-1'>
                      <Link href='/auth/signout'>
                        <span className='block px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
                          Sign out
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='hidden md:flex'>
              <SignInButton />
            </div>
          )}

          <Bars3Icon
            onClick={toggleMenu}
            className='inline-block h-16 cursor-pointer md:hidden'
          />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`bg-slateblack fixed top-0 right-0 z-50 h-screen w-[80%] transform rounded-l-3xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='relative flex h-full flex-col items-center space-y-4'>
          <div className='font-white mt-4 mb-6 text-4xl font-bold text-white'>
            <span>GoEco 🌿</span>
            <XMarkIcon
              onClick={toggleMenu}
              className='ml-10 inline-block h-16 cursor-pointer'
            />
          </div>
          <Link onClick={(prev) => setIsMenuOpen(!prev)} href='/find'>
            <span className='bg-primary my-12 inline-block rounded-2xl px-8 py-3'>
              <span className='text-xl font-bold'>Find Route</span>
              <MagnifyingGlassIcon className='ml-1 inline-block h-7 rotate-90' />
            </span>
          </Link>

          {session ? (
            <div className='flex flex-col items-center gap-2'>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={64}
                  height={64}
                  className='rounded-full'
                />
              )}
              <span className='text-lg font-bold text-white'>
                {session.user?.name}
              </span>
              <div onClick={(prev) => setIsMenuOpen(!prev)}>
                <LogOutButton />
              </div>
            </div>
          ) : (
            <div onClick={(prev) => setIsMenuOpen(!prev)}>
              <SignInButton />
            </div>
          )}

          <div className='mt-24 flex flex-col items-center justify-between gap-6 text-3xl font-bold text-white'>
            <Link onClick={(prev) => setIsMenuOpen(!prev)} href='/about'>
              <div>
                <span>About</span>
                <ArrowRightIcon className='ml-3 inline h-6 w-6' />
              </div>
            </Link>
            <Link onClick={(prev) => setIsMenuOpen(!prev)} href='/contact'>
              <div>
                <span>Contact</span>
                <ArrowRightIcon className='ml-3 inline h-6 w-6' />
              </div>
            </Link>
            <Link onClick={(prev) => setIsMenuOpen(!prev)} href='/prices'>
              <div>
                <span>Price</span>
                <ArrowRightIcon className='ml-3 inline h-6 w-6' />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
