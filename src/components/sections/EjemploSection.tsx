import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Section, SectionHeader } from '@/components/ds';
import ResultadoDiagnostico from '@/components/resultado/ResultadoDiagnostico';
import { EJEMPLO_DIAGNOSTICO, EJEMPLO_SCORES } from '@/lib/contenido/ejemplo-resultado';

/**
 * Ejemplo de resultado con datos ficticios. Usa EXACTAMENTE el mismo componente que el
 * resultado real del agente (`ResultadoDiagnostico`), con banner y badge EJEMPLO.
 */
export default function EjemploSection() {
  return (
    <Section id="ejemplo" border>
      <SectionHeader
        eyebrow="Ejemplo de resultado"
        title="Así se ve un diagnóstico"
        lead="Este es el mismo resultado que recibirás al terminar la conversación, aquí con un municipio ficticio."
      />
      <ResultadoDiagnostico
        resultado={EJEMPLO_DIAGNOSTICO}
        scores={EJEMPLO_SCORES}
        ejemplo
        idBase="ejemplo"
        acciones={
          <Button asChild>
            <Link href="#diagnostico">Hacer el diagnóstico de mi municipio <ArrowRight aria-hidden="true" /></Link>
          </Button>
        }
      />
    </Section>
  );
}
