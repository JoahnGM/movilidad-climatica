'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Container, FondoMontanas, Reveal, Text, TituloIA, type TramoTitulo } from '@/components/ds';
import { iniciarDiagnostico } from '@/components/diagnostico/eventos';
import { useIdioma } from '@/components/i18n/IdiomaProvider';

/**
 * Hero de tres elementos (plan-feedback §10.1): la cordillera, el titular con su bajada
 * y una sola acción, centrados en la pantalla encima de la cordillera. El municipio lo pregunta el chat; la
 * vista previa del producto vive en "Cómo funciona" y en el ejemplo.
 */
export default function HeroSection() {
  const { idioma, t } = useIdioma();

  const tramos = useMemo<TramoTitulo[]>(
    () => t.hero.tramos.map((tr, i) => (i === 1 ? { ...tr, className: 'font-accent text-green' } : tr)),
    [t],
  );

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden pt-16">
      <FondoMontanas
        intensidad={0.8}
        desfase={23}
        className="absolute inset-x-0 top-16 bottom-0 h-auto w-full [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent)]"
      />
      {/* Halo de papel detrás del texto: el titular queda encima de las montañas y se lee sin ruido. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_38%_32%_at_50%_52%,var(--color-background)_35%,transparent_100%)]"
      />

      <Container className="relative flex flex-col items-center gap-6 py-16 text-center">
        <TituloIA
          key={idioma}
          efecto="suave"
          tramos={tramos}
          className="mx-auto max-w-4xl font-heading text-display font-semibold tracking-display text-balance text-foreground"
        />

        {/* Entran al montar, después del titular (no esperan a "entrar en vista"). */}
        <Reveal alMontar delay={0.7}>
          <Text variant="lead" className="mx-auto max-w-2xl text-balance">
            {t.hero.lead}
          </Text>
        </Reveal>

        {/* Dos acciones, sin letra chica (patrón Linear / Vercel / Stripe). El tiempo y la
            gratuidad se dicen donde se necesitan: en la bienvenida del chat. */}
        <Reveal alMontar delay={0.85} className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => iniciarDiagnostico('')}>
            {t.hero.iniciar} <ArrowRight aria-hidden="true" />
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#ejemplo">{t.hero.verEjemplo}</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
