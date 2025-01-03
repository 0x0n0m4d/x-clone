import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'X',
    template: '%s / X'
  },
  themeColor: 'black',
  openGraph: {
    title: {
      default: 'X',
      template: '%s / X'
    },
    siteName: 'X (formerly Twitter)'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-black-100 text-white font-lato">
          <Toaster position="bottom-center" />
          <main className="h-full">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
