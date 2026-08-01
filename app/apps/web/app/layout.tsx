import type { Metadata, Viewport } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './styles/globals.css';

// Self-hosted da Next in fase di build: nessuna richiesta bloccante a
// fonts.googleapis.com in produzione (stesso pattern del precedente Inter).
// Outfit: UI/titoli, pesi larghi per il trattamento maiuscolo aggressivo del
// redesign dark/rosso. Space Mono: badge, contatori, breadcrumb.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Poligoni Italia: trova e prenota poligoni di tiro sportivo',
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
    title: 'Poligoni Italia: trova e prenota poligoni di tiro sportivo',
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
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${outfit.variable} ${spaceMono.variable} dark`}>
      <body className="bg-surface text-ink font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
