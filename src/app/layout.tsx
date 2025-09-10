import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNARCH Causality Engine',
  description: 'An interactive 3D experience visualizing computational causality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}