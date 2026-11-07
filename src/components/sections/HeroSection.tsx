'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Container, FondoMontanas, Reveal, Text, TituloIA, type TramoTitulo } from '@/components/ds';
import ChatVistaPrevia from '@/components/diagnostico/ChatVistaPrevia';
import TarjetaNivel from '@/components/resultado/TarjetaNivel';
import { EJEMPLO_DIAGNOSTICO } from '@/lib/contenido/ejemplo-resultado';

const TRAMOS: TramoTitulo[] = [
  { escribe: 'Diag', fantasma: 'nostica tu territorio. ' },
  { escribe: 'Act', fantasma: 'úa con datos.', className: 'font-accent text-green' },
];

const CIUDADES = ['Bogotá', 'Medellín', 'Barranquilla'];

export default function HeroSection() {
  return (
    <>
      <section className="relative flex min-h-svh flex-col overflow-hidden pt-16">
        <FondoMontanas
          intensidad={0.7}
          desfase={23}
          className="absolute inset-x-0 top-16 h-[70%] w-full [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_62%,transparent_96%)] md:h-[74%]"
        />
        <Container className="relative mt-auto flex flex-col items-start gap-6 pt-[42svh] pb-14 md:pb-16">
          <Text variant="eyebrow">Plataforma de diagnóstico territorial</Text>
          <TituloIA tramos={TRAMOS} className="max-w-3xl font-heading text-display font-semibold tracking-display text-foreground" />
          <Reveal delay={0.1}>
            <Text variant="lead" className="max-w-xl">
              Una conversación guiada por IA construye una línea base de la preparación institucional de tu municipio frente a la movilidad climática.
            </Text>
          </Reveal>
          <Reveal delay={0.2} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href="#diagnostico">Iniciar Diagnóstico <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#ejemplo">Ver ejemplo de resultado</Link>
            </Button>
          </Reveal>
          <Text variant="small" tone="muted">
            O explora los casos de{' '}
            {CIUDADES.map((c, i) => (
              <span key={c}>
                {i > 0 && ' · '}
                <Link href="#ciudades" className="text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline">{c}</Link>
              </span>
            ))}
          </Text>
        </Container>
      </section>

      <section aria-label="Vista previa del resultado" className="pb-8">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <Reveal className="flex flex-col gap-4">
            <Text variant="eyebrow">Basado en investigación sobre gobernanza local y movilidad climática en Colombia</Text>
            <p className="font-heading text-h2 font-semibold tracking-heading text-foreground text-balance">
              Tu nivel, tus brechas y por dónde empezar.
            </p>
            <Text variant="small" tone="muted" className="font-mono">Gratuito · Sin registro · Resultados inmediatos</Text>
            <div className="mt-4 hidden md:block">
              <ChatVistaPrevia />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <TarjetaNivel resultado={EJEMPLO_DIAGNOSTICO} ejemplo />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
