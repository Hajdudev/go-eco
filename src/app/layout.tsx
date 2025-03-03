import React from 'react';
import Header from './_components/Header';
import './globals.css';
import { Provider } from './context/Provider';
import './globals.css';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-mist overflow-x-hidden'>
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
