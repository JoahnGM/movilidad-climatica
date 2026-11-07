import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { toneAccent, toneBorder, type Tone } from './tones';

export const cardVariants = cva('flex flex-col rounded-card border', {
  variants: {
    variant: {
      /** Superficie plana sobre el fondo (bento, features) */
      flat: 'bg-surface border-border shadow-card',
      /** Tarjeta elevada en blanco (producto, resultado, chat) */
      raised: 'bg-surface-raised border-border shadow-raised',
      /** Solo borde, fondo transparente */
      outline: 'bg-transparent border-border',
      /** Superficie de acento suave (salvia) */
      sage: 'bg-sage border-transparent',
    },
    padding: {
      none: '',
      sm: 'p-5 gap-3',
      md: 'p-card gap-stack',
      lg: 'p-8 md:p-10 gap-stack',
    },
    interactive: {
      true: 'transition-colors duration-150 hover:border-border-strong/60',
      false: '',
    },
  },
  defaultVariants: { variant: 'flat', padding: 'md', interactive: false },
});

export type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    as?: 'div' | 'article' | 'li' | 'section' | 'aside' | 'figure';
    /** Borde izquierdo de 3px en el tono indicado (prioridad, urgencia). */
    accent?: Tone;
    /** Tiñe el borde con el tono (estado abierto/seleccionado). */
    outline?: Tone;
  };

/** Tarjeta del DS. `flat` para contenido, `raised` para producto (resultado, chat). */
export function Card({ as = 'div', variant, padding, interactive, accent, outline, className, ...props }: CardProps) {
  const Comp: ElementType = as;
  return (
    <Comp
      className={cn(
        cardVariants({ variant, padding, interactive }),
        outline && toneBorder[outline],
        accent && ['border-l-[3px]', toneAccent[accent]],
        className,
      )}
      {...props}
    />
  );
}
