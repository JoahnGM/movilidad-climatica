import { cva, type VariantProps } from 'class-variance-authority';
import { FlaskConical } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { toneBorder, toneSoftBg, toneText, type Tone } from './tones';

/* ── Badge: estado o categoría corta, no interactivo ─────────────────── */

export const badgeVariants = cva(
  'inline-flex w-fit items-center gap-1.5 rounded-full border font-medium whitespace-nowrap [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-caption',
        md: 'px-3 py-1 text-caption font-semibold',
      },
      variant: {
        soft: '',
        outline: 'bg-transparent',
        solid: 'border-transparent text-on-accent',
      },
    },
    defaultVariants: { size: 'md', variant: 'soft' },
  },
);

const SOLID: Record<Tone, string> = {
  teal: 'bg-teal', blue: 'bg-blue', amber: 'bg-amber',
  red: 'bg-red', violet: 'bg-violet', neutral: 'bg-muted',
};

export type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    tone?: Tone;
  };

/** Etiqueta de estado (nivel, urgencia, estado de dimensión, "EJEMPLO"). */
export function Badge({ tone = 'neutral', size, variant = 'soft', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ size, variant }),
        variant === 'solid' ? SOLID[tone] : [toneText[tone], toneBorder[tone]],
        variant === 'soft' && toneSoftBg[tone],
        className,
      )}
      {...props}
    />
  );
}

/* ── Chip: etiqueta temática (áreas, zonas) y chip "Piloto experimental" ─ */

export const chipVariants = cva(
  'inline-flex w-fit items-center gap-1.5 rounded-full border whitespace-nowrap [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /** Tema o etiqueta descriptiva */
        default: 'border-border-glass text-muted',
        /** Funcionalidad en piloto o experimental (IA) */
        experimental: 'border-violet/50 bg-violet/10 text-violet-light font-semibold',
      },
      size: {
        sm: 'px-3 py-1 text-caption [&_svg]:size-3',
        md: 'px-4 py-1.5 text-small [&_svg]:size-3.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export type ChipProps = ComponentProps<'span'> & VariantProps<typeof chipVariants>;

/** Etiqueta en píldora. `variant="experimental"` incluye el ícono de matraz. */
export function Chip({ variant, size, className, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant, size }), className)} {...props}>
      {variant === 'experimental' && <FlaskConical aria-hidden="true" />}
      {children}
    </span>
  );
}
