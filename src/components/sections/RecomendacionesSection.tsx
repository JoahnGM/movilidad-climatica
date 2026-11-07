import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, Heading, IconTile, Mono, Reveal, Section, SectionHeader, Text } from '@/components/ds';
import {
  ClipboardList, Users, ShieldAlert, GitMerge,
  FileText, ArrowRightLeft, GraduationCap, Bell,
} from 'lucide-react';

interface Recomendacion {
  numero: number;
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

const recomendaciones: Recomendacion[] = [
  {
    numero: 1,
    icon: ClipboardList,
    titulo: 'Inventariar zonas de riesgo',
    descripcion:
      'Levanta o actualiza el mapa de amenazas climáticas del municipio e identifica dónde viven las familias en riesgo no mitigable.',
  },
  {
    numero: 2,
    icon: Users,
    titulo: 'Identificar comunidades vulnerables',
    descripcion:
      'Cruza datos de pobreza, género y etnicidad con la cartografía de riesgo para priorizar la atención.',
  },
  {
    numero: 3,
    icon: ShieldAlert,
    titulo: 'Crear protocolo de emergencia climática',
    descripcion:
      'Define roles, alertas tempranas y rutas de evacuación antes del evento, no durante.',
  },
  {
    numero: 4,
    icon: GitMerge,
    titulo: 'Articular con entidades departamentales',
    descripcion:
      'Vincula la gobernación, el IDEAM y la CAR local. La movilidad climática no tiene fronteras municipales.',
  },
  {
    numero: 5,
    icon: FileText,
    titulo: 'Incluir movilidad climática en el POT',
    descripcion:
      'Incorpora zonas de reubicación posibles, perímetros controlados y cinturones verdes de amortiguación.',
  },
  {
    numero: 6,
    icon: ArrowRightLeft,
    titulo: 'Establecer rutas de reubicación preventiva',
    descripcion:
      'Diseña la hoja de ruta: predios, subsidios, acompañamiento psicosocial y seguimiento post-traslado.',
  },
  {
    numero: 7,
    icon: GraduationCap,
    titulo: 'Capacitar funcionarios locales',
    descripcion:
      'El equipo técnico debe entender la diferencia entre gestión del riesgo clásica y movilidad climática estructural.',
  },
  {
    numero: 8,
    icon: Bell,
    titulo: 'Activar sistemas de alerta temprana',
    descripcion:
      'Conecta datos del IDEAM, sensores locales y redes comunitarias para dar tiempo de actuar.',
  },
];

export default function RecomendacionesSection() {
  return (
    <Section id="recomendaciones" background="alt" border>
      <SectionHeader
        eyebrow="Orientaciones"
        title="¿Por dónde empieza un municipio?"
        lead="Rutas sugeridas, no una lista de obligaciones. Cada municipio tiene capacidades distintas: elige por dónde empezar según tu riesgo principal y los recursos con que cuentas."
      />

      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recomendaciones.map((r, i) => {
          const Icon = r.icon;
          return (
            <Reveal as="li" key={r.numero} index={i}>
              <Card variant="raised" className="h-full">
                <div className="flex items-center justify-between">
                  <Mono size="lg" tone="muted">{String(r.numero).padStart(2, '0')}</Mono>
                  <IconTile icon={Icon} size="sm" />
                </div>
                <Heading as="h3" size="h4">{r.titulo}</Heading>
                <Text variant="small">{r.descripcion}</Text>
              </Card>
            </Reveal>
          );
        })}
      </ol>

      <Reveal>
        <Text variant="body">
          ¿Cuáles de estas acciones son más urgentes para tu territorio?{' '}
          <Link href="#diagnostico" className="font-medium text-green-ink underline-offset-4 hover:underline">
            Realiza el diagnóstico gratuito →
          </Link>
        </Text>
      </Reveal>
    </Section>
  );
}
