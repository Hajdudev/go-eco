import React, { Suspense } from 'react';
import Header from './_components/Header';
import './globals.css';
import DynamicMap from './_components/DynamicMap';
import LoadingSpinner from './loading';
import { Input } from './_components/Input';
import { Button } from './_components/Button';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-mist overflow-x-hidden'>
        <Header />
        <div className='flex h-full w-screen gap-26 p-8 md:py-20'>
          <main className='w-full lg:w-[40%]'>
            <form>
              <div className='flex flex-col items-center justify-center gap-8'>
                <Input name='from' placeholder='From where?' />
                <Input name='to' placeholder='To where?' />
                <Button text='Search a route' color='primary' value='search' />
              </div>
            </form>
            {children}
          </main>
          <div className='hidden w-[60%] lg:block'>
            <Suspense fallback={<LoadingSpinner />}>
              <DynamicMap />
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  );
}
