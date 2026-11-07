import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toneBorder, toneSoftBg, toneText, type Tone } from './tones';

export interface IconTileProps {
  icon: LucideIcon;
  tone?: Tone;
  size?: 'sm' | 'md';
  className?: string;
}

/** Ícono decorativo dentro de un cuadro tenue (pasos, categorías). */
export function IconTile({ icon: Icon, tone = 'teal', size = 'md', className }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg border',
        size === 'md' ? 'size-11 [&_svg]:size-5' : 'size-8 [&_svg]:size-4',
        toneSoftBg[tone],
        toneBorder[tone],
        toneText[tone],
        className,
      )}
    >
      <Icon />
    </span>
  );
}
