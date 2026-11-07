import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Section, SectionHeader } from '@/components/ds';
import ResultadoDiagnostico from '@/components/resultado/ResultadoDiagnostico';
import { EJEMPLO_DIAGNOSTICO, EJEMPLO_SCORES } from '@/lib/contenido/ejemplo-resultado';
import { EJEMPLO_DIAGNOSTICO_EN, EJEMPLO_SCORES_EN } from '@/lib/contenido/traducciones/en';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';

/**
 * Ejemplo de resultado con datos ficticios. Usa EXACTAMENTE el mismo componente que el
 * resultado real del agente (`ResultadoDiagnostico`), con banner y badge EJEMPLO.
 */
export default function EjemploSection({ idioma = 'es' }: { idioma?: Idioma }) {
  const t = UI[idioma].ejemplo;
  const en = idioma === 'en';
  return (
    <Section id="ejemplo" border>
      <SectionHeader eyebrow={t.eyebrow} title={t.titulo} lead={t.lead} />
      <ResultadoDiagnostico
        resultado={en ? EJEMPLO_DIAGNOSTICO_EN : EJEMPLO_DIAGNOSTICO}
        scores={en ? EJEMPLO_SCORES_EN : EJEMPLO_SCORES}
        ejemplo
        idBase="ejemplo"
        idioma={idioma}
        acciones={
          <Button asChild>
            <Link href="#diagnostico">{t.cta} <ArrowRight aria-hidden="true" /></Link>
          </Button>
        }
      />
    </Section>
  );
}
