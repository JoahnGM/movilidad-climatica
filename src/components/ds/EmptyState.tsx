import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import { Heading, Text } from './Typography';
import { toneText, type Tone } from './tones';

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
    <GlassCard padding="lg" className={cn('mx-auto w-full max-w-md items-center text-center', className)}>
      <Icon aria-hidden="true" className={cn('size-10', toneText[tone])} />
      <Heading as={headingLevel} size="h4" className="text-xl">{title}</Heading>
      {description && <Text variant="small">{description}</Text>}
      {actions && <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row [&>*]:flex-1">{actions}</div>}
    </GlassCard>
  );
}
