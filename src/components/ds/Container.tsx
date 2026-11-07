import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const containerVariants = cva('mx-auto w-full px-gutter', {
  variants: {
    size: {
      /** 768px — textos largos, formularios */
      prose: 'max-w-3xl',
      /** 1024px — contenido centrado */
      content: 'max-w-5xl',
      /** 1152px — navbar, footer, secciones del home (por defecto) */
      wide: 'max-w-6xl',
    },
  },
  defaultVariants: { size: 'wide' },
});

export type ContainerProps = ComponentProps<'div'> & VariantProps<typeof containerVariants>;

/** Ancho máximo + padding lateral fluido (`--space-gutter`). */
export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
