import type { Metadata } from 'next';
import { Container } from '@/components/ds';
import { CatalogoNav } from './_catalogo/CatalogoNav';

export const metadata: Metadata = {
  title: { default: 'Design system', template: '%s · Design system' },
  robots: { index: false, follow: false },
};

/** Catálogo vivo del design system "Cordillera". Ruta interna: no se indexa ni se enlaza desde el sitio. */
export default function DsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background pt-16">
      <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <CatalogoNav />
        <main id="contenido" className="flex min-w-0 flex-col gap-12">{children}</main>
      </Container>
    </div>
  );
}
