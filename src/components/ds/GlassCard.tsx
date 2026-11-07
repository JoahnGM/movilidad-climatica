import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { toneAccent, toneBorder, type Tone } from './tones';

export const glassCardVariants = cva('glass rounded-xl shadow-glass flex flex-col', {
  variants: {
    padding: {
      none: '',
      sm: 'p-5 gap-3',
      md: 'p-card gap-stack',
      lg: 'p-8 md:p-10 gap-stack',
    },
    interactive: {
      true: 'transition-colors duration-150 hover:bg-glass-hover hover:border-border-strong/40',
      false: '',
    },
  },
  defaultVariants: { padding: 'md', interactive: false },
});

export type GlassCardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof glassCardVariants> & {
    as?: 'div' | 'article' | 'li' | 'section' | 'aside';
    /** Borde izquierdo de 4px en el tono indicado (prioridad, urgencia). */
    accent?: Tone;
    /** Tiñe el borde completo con el tono (estado seleccionado/abierto). */
    outline?: Tone;
  };

/** Tarjeta glassmorphism oficial: `bg-white/5 backdrop-blur border-white/10 rounded-xl`. */
export function GlassCard({
  as = 'div',
  padding,
  interactive,
  accent,
  outline,
  className,
  ...props
}: GlassCardProps) {
  const Comp: ElementType = as;
  return (
    <Comp
      className={cn(
        glassCardVariants({ padding, interactive }),
        outline && toneBorder[outline],
        accent && ['border-l-4', toneAccent[accent]],
        className,
      )}
      {...props}
    />
  );
}
