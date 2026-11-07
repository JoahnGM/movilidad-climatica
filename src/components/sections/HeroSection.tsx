'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Container, FondoMontanas, Reveal, Text, TextInput, TituloIA, usePlaceholderAnimado, type TramoTitulo } from '@/components/ds';
import { iniciarDiagnostico } from '@/components/diagnostico/eventos';
import { useIdioma } from '@/components/i18n/IdiomaProvider';
import { EJEMPLO_DIAGNOSTICO_EN } from '@/lib/contenido/traducciones/en';
import ChatVistaPrevia from '@/components/diagnostico/ChatVistaPrevia';
import TarjetaNivel from '@/components/resultado/TarjetaNivel';
import { EJEMPLO_DIAGNOSTICO } from '@/lib/contenido/ejemplo-resultado';

const CIUDADES = ['Bogotá', 'Medellín', 'Barranquilla'];

export default function HeroSection() {
  const { idioma, t } = useIdioma();
  const [municipio, setMunicipio] = useState('');
  const [enfocado, setEnfocado] = useState(false);
  // Invitación + municipios reales de ejemplo (casos citados en src/lib/contenido)
  const placeholder = usePlaceholderAnimado(t.hero.frasesCampo, !enfocado && municipio === '');
  const tramos = useMemo<TramoTitulo[]>(
    () => t.hero.tramos.map((tr, i) => (i === 1 ? { ...tr, className: 'font-accent text-green' } : tr)),
    [t],
  );

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    iniciarDiagnostico(municipio);
  }

  return (
    <>
      <section className="relative flex min-h-svh flex-col overflow-hidden pt-16">
        <FondoMontanas
          intensidad={0.7}
          desfase={23}
          className="absolute inset-x-0 top-16 h-[70%] w-full [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_62%,transparent_96%)] md:h-[74%]"
        />
        <Container className="relative mt-auto flex flex-col items-start gap-6 pt-[42svh] pb-14 md:pb-16">
          <Text variant="eyebrow">{t.hero.eyebrow}</Text>
          <TituloIA key={idioma} tramos={tramos} className="max-w-3xl font-heading text-display font-semibold tracking-display text-foreground" />
          <Reveal delay={0.1}>
            <Text variant="lead" className="max-w-xl">
              {t.hero.lead}
            </Text>
          </Reveal>
          <Reveal delay={0.2} className="w-full max-w-xl">
            <form onSubmit={handleStart} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <TextInput
                label={t.hero.campo}
                hideLabel
                size="lg"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setEnfocado(true)}
                onBlur={() => setEnfocado(false)}
                autoComplete="address-level2"
                maxLength={120}
              />
              <Button type="submit" size="lg" className="h-13 shrink-0">
                {t.hero.iniciar} <ArrowRight aria-hidden="true" />
              </Button>
            </form>
          </Reveal>
          <Text variant="small" tone="muted">
            <Link href="#ejemplo" className="font-medium text-green-ink underline-offset-2 hover:underline">{t.hero.verEjemplo}</Link>
            {' · '}{t.hero.explora}{' '}
            {CIUDADES.map((c, i) => (
              <span key={c}>
                {i > 0 && ' · '}
                <Link href="#ciudades" className="text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline">{c}</Link>
              </span>
            ))}
          </Text>
        </Container>
      </section>

      <section aria-label={t.hero.vistaPreviaAria} className="pb-8">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <Reveal className="flex flex-col gap-4">
            <Text variant="eyebrow">{t.hero.basado}</Text>
            <p className="font-heading text-h2 font-semibold tracking-heading text-foreground text-balance">
              {t.hero.tuNivel}
            </p>
            <Text variant="small" tone="muted" className="font-mono">{t.comun.gratuito}</Text>
            <div className="mt-4 hidden md:block">
              <ChatVistaPrevia idioma={idioma} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <TarjetaNivel resultado={idioma === 'en' ? EJEMPLO_DIAGNOSTICO_EN : EJEMPLO_DIAGNOSTICO} ejemplo idioma={idioma} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
