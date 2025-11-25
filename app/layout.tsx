import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FarmaFácil - Tu farmacia digital',
  description: 'Gestiona tus pedidos, cupones y consultas de farmacia de forma fácil y rápida',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
