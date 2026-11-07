'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/ds';
import AccesoPiloto from '@/components/diagnostico/AccesoPiloto';

/** Entrada directa del piloto cerrado (el proxy redirige aquí). Tras validar, vuelve al diagnóstico en la landing. */
export default function AccesoPage() {
  const router = useRouter();
  return (
    <main id="contenido" className="flex min-h-svh items-center pt-16">
      <Container size="prose" className="py-section">
        <AccesoPiloto headingLevel="h1" onAcceso={() => router.replace('/#diagnostico')} />
      </Container>
    </main>
  );
}
