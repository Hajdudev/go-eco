import React from 'react';
import Header from './_components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-mist'>
        <Header />
        {children}
      </body>
    </html>
  );
}
