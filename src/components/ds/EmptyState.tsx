import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { Heading, Text } from './Typography';
import { toneSoftBg, toneText, type Tone } from './tones';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Botones (normalmente uno primario y uno secundario). */
  actions?: ReactNode;
  tone?: Tone;
  /** Nivel semántico del título. */
  headingLevel?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/** Estado vacío o de error: ícono + título + explicación + acciones. */
export function EmptyState({ icon: Icon, title, description, actions, tone = 'amber', headingLevel = 'h2', className }: EmptyStateProps) {
  return (
    <Card variant="raised" padding="lg" className={cn('mx-auto w-full max-w-md items-center text-center', className)}>
      <span aria-hidden="true" className={cn('flex size-12 items-center justify-center rounded-full', toneSoftBg[tone], toneText[tone])}>
        <Icon className="size-6" />
      </span>
      <Heading as={headingLevel} size="h4">{title}</Heading>
      {description && <Text variant="small">{description}</Text>}
      {actions && <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div>}
    </Card>
  );
}
