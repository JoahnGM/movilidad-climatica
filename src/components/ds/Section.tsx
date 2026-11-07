import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Container, type ContainerProps } from './Container';

export const sectionVariants = cva('relative w-full', {
  variants: {
    /** Fondo de la sección. Alterna `base` y `alt` para dar ritmo. */
    background: {
      base: 'bg-background',
      alt: 'bg-background-alt',
      /** halo verde suave en la parte superior */
      halo: 'bg-background bg-halo',
      /** tinta verde bosque (CTA final): usa texto claro */
      ink: 'bg-ink text-on-accent',
    },
    spacing: {
      default: 'py-section',
      compact: 'py-block',
      none: '',
    },
    border: {
      true: 'border-t border-border',
      false: '',
    },
  },
  defaultVariants: { background: 'base', spacing: 'default', border: false },
});

export type SectionProps = Omit<ComponentProps<'section'>, 'children'> &
  VariantProps<typeof sectionVariants> & {
    children: React.ReactNode;
    /** Ancho del contenedor interno. */
    size?: ContainerProps['size'];
  };

/**
 * Bloque vertical de página: fondo + padding vertical (`py-section`) + Container
 * + separación entre bloques (`gap-block`). Anima sus hijos con `<Reveal>`, no la sección entera.
 */
export function Section({ className, background, spacing, border, size, children, ...props }: SectionProps) {
  return (
    <section className={cn(sectionVariants({ background, spacing, border }), className)} {...props}>
      <Container size={size} className="flex flex-col gap-block">{children}</Container>
    </section>
  );
}
