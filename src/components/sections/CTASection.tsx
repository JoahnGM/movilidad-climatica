import Link from 'next/link';
import { ArrowRight, BarChart2, Brain, MessageSquare } from 'lucide-react';
import { Acento, Button, Pasos, Reveal, Section, SectionHeader, Text, type Paso } from '@/components/ds';
import ChatVistaPrevia from '@/components/diagnostico/ChatVistaPrevia';
import TarjetaNivel from '@/components/resultado/TarjetaNivel';
import { EJEMPLO_DIAGNOSTICO } from '@/lib/contenido/ejemplo-resultado';
import AnalisisVistaPrevia from '@/components/diagnostico/AnalisisVistaPrevia';

const PASOS: Paso[] = [
  {
    icon: MessageSquare,
    titulo: 'Describes tu territorio',
    descripcion: 'Conversas con un agente de IA que te hace preguntas específicas sobre tu municipio, sin formularios ni escalas.',
    visual: <ChatVistaPrevia />,
  },
  {
    icon: Brain,
    titulo: 'El sistema analiza',
    descripcion: 'Dos agentes evalúan la entrevista y calculan tu nivel de preparación institucional en 6 dimensiones.',
    visual: <AnalisisVistaPrevia />,
  },
  {
    icon: BarChart2,
    titulo: 'Recibes tu diagnóstico',
    descripcion: 'Un resultado visual con tu nivel, fortalezas, brechas y recomendaciones adaptadas a tu municipio.',
    visual: <TarjetaNivel resultado={EJEMPLO_DIAGNOSTICO} ejemplo />,
  },
];

/** "Cómo funciona": tres pasos con la interfaz real como ilustración. */
export default function CTASection() {
  return (
    <Section id="como-funciona">
      <SectionHeader
        align="center"
        eyebrow="Cómo funciona"
        title={<>No un cuestionario. <Acento>Una conversación.</Acento></>}
        lead="El diagnóstico se construye a través del diálogo, no de casillas marcadas. Tu municipio merece una evaluación que entienda su contexto específico."
      />
      <Pasos pasos={PASOS} />
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <Button asChild size="lg">
          <Link href="#diagnostico">Comenzar Diagnóstico <ArrowRight aria-hidden="true" /></Link>
        </Button>
        <Text variant="small" tone="muted" className="font-mono">Gratuito · Sin registro · Resultados inmediatos</Text>
      </Reveal>
    </Section>
  );
}
