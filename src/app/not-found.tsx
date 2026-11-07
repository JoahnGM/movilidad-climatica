import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button, Container, EmptyState } from '@/components/ds';
import { obtenerIdioma } from '@/lib/i18n/servidor';
import { UI } from '@/lib/i18n/ui';

export default async function NotFound() {
  const t = UI[await obtenerIdioma()].noEncontrada;
  return (
    <main id="contenido" className="flex min-h-svh items-center pt-16">
      <Container size="prose" className="py-section">
        <EmptyState
          icon={Compass}
          tone="green"
          headingLevel="h1"
          title={t.titulo}
          description={t.texto}
          actions={<Button asChild><Link href="/">{t.volver}</Link></Button>}
        />
      </Container>
    </main>
  );
}
