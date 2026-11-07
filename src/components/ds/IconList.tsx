import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { toneText, type Tone } from './tones';

export interface IconListProps {
  items: ReactNode[];
  icon: LucideIcon;
  /** Tono del ícono (el texto queda en `text-muted`). */
  tone?: Tone;
  /** Separación entre ítems. */
  spacing?: 'tight' | 'normal';
  className?: string;
}

/** Lista con viñeta de ícono: fortalezas (teal + CheckCircle2), brechas (amber + AlertTriangle). */
export function IconList({ items, icon: Icon, tone = 'teal', spacing = 'normal', className }: IconListProps) {
  return (
    <ul className={cn('flex flex-col', spacing === 'tight' ? 'gap-2' : 'gap-4', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-small text-muted">
          <Icon aria-hidden="true" className={cn('mt-1 size-3.5 shrink-0', toneText[tone])} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
