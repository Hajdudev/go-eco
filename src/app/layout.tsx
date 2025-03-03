import React from 'react';
import Header from './_components/Header';
import './globals.css';
import { Providers } from './providers';
import './globals.css';
import { Provider } from './context/Provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-mist overflow-x-hidden'>
        <Providers>
          <Provider>
            <Header />
            {children}
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
