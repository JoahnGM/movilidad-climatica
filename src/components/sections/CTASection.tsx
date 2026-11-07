import Link from 'next/link';
import { ArrowRight, BarChart2, Brain, MessageSquare } from 'lucide-react';
import { Acento, Button, Pasos, Reveal, Section, SectionHeader, Text, type Paso } from '@/components/ds';
import AnalisisVistaPrevia from '@/components/diagnostico/AnalisisVistaPrevia';
import ChatVistaPrevia from '@/components/diagnostico/ChatVistaPrevia';
import TarjetaNivel from '@/components/resultado/TarjetaNivel';
import { EJEMPLO_DIAGNOSTICO } from '@/lib/contenido/ejemplo-resultado';
import { EJEMPLO_DIAGNOSTICO_EN } from '@/lib/contenido/traducciones/en';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';

const ICONOS = [MessageSquare, Brain, BarChart2];

/** "Cómo funciona": tres pasos con la interfaz real como ilustración. */
export default function CTASection({ idioma = 'es' }: { idioma?: Idioma }) {
  const t = UI[idioma].comoFunciona;
  const visuales = [
    <ChatVistaPrevia key="chat" idioma={idioma} />,
    <AnalisisVistaPrevia key="analisis" idioma={idioma} />,
    <TarjetaNivel key="resultado" resultado={idioma === 'en' ? EJEMPLO_DIAGNOSTICO_EN : EJEMPLO_DIAGNOSTICO} ejemplo idioma={idioma} />,
  ];
  const pasos: Paso[] = t.pasos.map((p, i) => ({ icon: ICONOS[i], titulo: p.titulo, descripcion: p.descripcion, visual: visuales[i] }));
  return (
    <Section id="como-funciona">
      <SectionHeader
        align="center"
        eyebrow={t.eyebrow}
        title={<>{t.titulo} <Acento>{t.acento}</Acento></>}
        lead={t.lead}
      />
      <Pasos pasos={pasos} etiquetaPaso={t.paso} />
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <Button asChild size="lg">
          <Link href="#diagnostico">{t.comenzar} <ArrowRight aria-hidden="true" /></Link>
        </Button>
        <Text variant="small" tone="muted" className="font-mono">{UI[idioma].comun.gratuito}</Text>
      </Reveal>
    </Section>
  );
}
