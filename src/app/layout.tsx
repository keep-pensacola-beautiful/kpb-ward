'use client'

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header, Footer } from './components';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SiteAlert } from './components';
import { isDatabaseOperational } from './actions';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isDatabaseOn, setIsDatabaseOn] = useState<boolean>(true);
  const pathname: string = usePathname();

  useEffect(() => {
    if (!isInitialLoad) {
      document.getElementById('main-content-header')?.focus();
    } else {
      setIsInitialLoad(false);
    }
    isDatabaseOperational().then((isOperational: boolean) => setIsDatabaseOn(isOperational));
  }, [pathname]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col gap-8 justify-between h-full">
        <div>
          { !isDatabaseOn &&
            <SiteAlert
              header="The Database is Off"
              body="You cannot save or search Events, or get metrics until it is on. Please reach out to the CEO to learn the database's hours of operation."
              compact={true}
              design="danger">
            </SiteAlert>
          }
          <Link
            href="#main-content-header"
            className="absolute top-[-3em] bg-white focus:top-[0px] p-1 rounded-xs">
            Skip to main content
          </Link>
          <div className="flex flex-col gap-2">
            <Header />
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
