import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button, Container, EmptyState } from '@/components/ds';

export default function NotFound() {
  return (
    <main id="contenido" className="flex min-h-svh items-center pt-16">
      <Container size="prose" className="py-section">
        <EmptyState
          icon={Compass}
          tone="green"
          headingLevel="h1"
          title="No encontramos esta página"
          description="Puede que el enlace haya cambiado. Vuelve al inicio para seguir explorando o iniciar tu diagnóstico."
          actions={<Button asChild><Link href="/">Volver al inicio</Link></Button>}
        />
      </Container>
    </main>
  );
}
