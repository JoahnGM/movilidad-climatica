import type { Metadata } from 'next';
import { Geist, Geist_Mono, IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Sans, Instrument_Serif } from 'next/font/google';

/* Exploración de direcciones visuales para el nuevo DS. Ruta interna, no se indexa. */

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument-serif' });
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });

export const metadata: Metadata = {
  title: 'Exploración de direcciones visuales',
  robots: { index: false, follow: false },
};

export default function ExplorarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${geist.variable} ${geistMono.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${plexSans.variable} ${plexMono.variable} relative z-[60]`}
    >
      {children}
    </div>
  );
}
