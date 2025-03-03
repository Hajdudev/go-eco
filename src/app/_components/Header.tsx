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

interface HeaderProps {
  session: Session | null;
}

function Header({ session }: HeaderProps) {
  const { isMenuOpen, setIsMenuOpen } = useAppContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <div className='hidden items-center gap-2 md:flex'>
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
              <LogOutButton />
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
          <span className='bg-primary my-12 inline-block rounded-2xl px-8 py-3'>
            <span className='text-xl font-bold'>Find Route</span>
            <MagnifyingGlassIcon className='ml-1 inline-block h-7 rotate-90' />
          </span>

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
