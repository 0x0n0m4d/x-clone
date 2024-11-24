import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'X Twitter',
  description: 'Create your own thread'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn('bg-black-100 text-white', inter.className)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
