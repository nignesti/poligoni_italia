import type { Metadata, Viewport } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Poligoni Italia — Trova e prenota poligoni di tiro sportivo',
    template: '%s | Poligoni Italia',
  },
  description:
    'Trova poligoni di tiro in Italia, controlla orari, calibri e disponibilità. Prenota la tua linea online in pochi click.',
  keywords: [
    'poligono di tiro',
    'tiro sportivo',
    'prenotazione poligono',
    'TSN',
    'UITS',
    'tiro a segno',
    'tiro a volo',
    'poligoni Italia',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Poligoni Italia',
    title: 'Poligoni Italia — Trova e prenota poligoni di tiro sportivo',
    description:
      'Trova poligoni di tiro in Italia, controlla orari, calibri e disponibilità. Prenota la tua linea online.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poligoni Italia',
    description:
      'Trova e prenota poligoni di tiro sportivo in Italia.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b5e20',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
