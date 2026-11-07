import Link from 'next/link';
import { Card, Heading, IconTile, Mono, Reveal, Section, SectionHeader, Text } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';
import {
  ClipboardList, Users, ShieldAlert, GitMerge,
  FileText, ArrowRightLeft, GraduationCap, Bell,
} from 'lucide-react';

const ICONOS = [ClipboardList, Users, ShieldAlert, GitMerge, FileText, ArrowRightLeft, GraduationCap, Bell];

export default function RecomendacionesSection({ idioma = 'es' }: { idioma?: Idioma }) {
  const t = UI[idioma].recomendaciones;
  return (
    <Section id="recomendaciones" background="alt" border>
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.titulo}
        lead={t.lead}
      />

      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((r, i) => {
          const Icon = ICONOS[i];
          return (
            <Reveal as="li" key={r.titulo} index={i}>
              <Card variant="raised" className="h-full">
                <div className="flex items-center justify-between">
                  <Mono size="lg" tone="muted">{String(i + 1).padStart(2, '0')}</Mono>
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
          {t.pregunta}{' '}
          <Link href="#diagnostico" className="font-medium text-green-ink underline-offset-4 hover:underline">
            {t.cta}
          </Link>
        </Text>
      </Reveal>
    </Section>
  );
}
