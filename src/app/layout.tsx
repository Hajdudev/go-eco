import React from 'react';
import Header from './_components/Header';
import './globals.css';
import { Providers } from './providers';
import './globals.css';
import { Provider } from './context/Provider';
import { auth } from '@/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang='en'>
      <body className='bg-mist overflow-x-hidden'>
        <Providers>
          <Provider>
            <Header session={session} />
            {children}
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
