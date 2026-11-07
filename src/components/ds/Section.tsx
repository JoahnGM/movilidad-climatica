import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Container, type ContainerProps } from './Container';
import { Reveal } from './Reveal';

export const sectionVariants = cva('relative w-full', {
  variants: {
    /** Fondo de la sección. Alterna `base` y `alt` para dar ritmo al home. */
    background: {
      base: 'bg-background',
      alt: 'bg-background-alt',
      /** alt + halo teal superior */
      glow: 'bg-background-alt bg-glow-teal',
      /** alt + lavado diagonal teal→blue */
      wash: 'bg-background-alt bg-wash',
      /** degradado de base a alt (cierre de página) */
      fade: 'bg-gradient-to-b from-background to-background-alt',
    },
    spacing: {
      default: 'py-section',
      compact: 'py-block',
      none: '',
    },
  },
  defaultVariants: { background: 'base', spacing: 'default' },
});

export type SectionProps = Omit<ComponentProps<'section'>, 'children'> &
  VariantProps<typeof sectionVariants> & {
    children: React.ReactNode;
    /** Ancho del contenedor interno. */
    size?: ContainerProps['size'];
    /** Fade-in al entrar en pantalla (por defecto sí). */
    reveal?: boolean;
  };

/**
 * Bloque vertical de página: fondo + padding vertical (`py-section`) + Container
 * + separación entre bloques (`gap-block`) + fade-in integrado.
 */
export function Section({
  className,
  background,
  spacing,
  size,
  reveal = true,
  children,
  ...props
}: SectionProps) {
  const inner = <Container size={size} className="flex flex-col gap-block">{children}</Container>;
  return (
    <section className={cn(sectionVariants({ background, spacing }), className)} {...props}>
      {reveal ? <Reveal>{inner}</Reveal> : inner}
    </section>
  );
}
