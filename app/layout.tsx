import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Providers from '@/components/Providers';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RentalCar — Find your perfect rental car',
  description: 'Reliable and budget-friendly rentals for any journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}