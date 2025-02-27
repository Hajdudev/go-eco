import React from 'react';
import Header from './_components/Header';
import './globals.css';
import DynamicMap from './_components/DynamicMap';
import { Provider } from './context/Provider';
import SearchForm from './_components/SearchForm';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-mist overflow-x-hidden'>
        <Provider>
          <Header />
          <div className='flex h-full w-screen gap-26 p-8 md:py-20'>
            <main className='w-full lg:w-[40%]'>
              <SearchForm />
              {children}
            </main>
            <div className='hidden w-[60%] lg:block'>
              <DynamicMap />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
