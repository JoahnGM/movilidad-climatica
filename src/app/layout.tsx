import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { MotionProvider, SkipLink } from '@/components/ds';
import { IdiomaProvider } from '@/components/i18n/IdiomaProvider';
import { obtenerIdioma } from '@/lib/i18n/servidor';
import { UI } from '@/lib/i18n/ui';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument-sans',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  const idioma = await obtenerIdioma();
  const { meta } = UI[idioma];
  return {
    title: meta.titulo,
    description: meta.descripcion,
    // Vista previa al compartir el enlace (WhatsApp, correo, redes). La imagen la genera
    // src/app/opengraph-image.tsx; en Vercel, Next usa la URL del despliegue como base.
    openGraph: { title: meta.titulo, description: meta.descripcion, type: 'website', locale: idioma === 'en' ? 'en_US' : 'es_CO', siteName: meta.titulo },
    twitter: { card: 'summary_large_image', title: meta.titulo, description: meta.descripcion },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const idioma = await obtenerIdioma();
  return (
    <html
      lang={idioma}
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <IdiomaProvider idioma={idioma}>
          <MotionProvider>
            <SkipLink label={UI[idioma].comun.saltar} />
            <Navbar />
            {children}
          </MotionProvider>
        </IdiomaProvider>
      </body>
    </html>
  );
}
