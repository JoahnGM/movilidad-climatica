import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-4',
  {
    variants: {
      variant: {
        /** Acción principal: una por vista. Píldora en tinta verde bosque. */
        primary: 'bg-ink text-on-accent hover:bg-green',
        /** Acción secundaria con borde */
        secondary: 'border border-border bg-surface-raised text-foreground hover:border-border-strong/60 hover:bg-background',
        /** Acciones terciarias o íconos */
        ghost: 'text-muted hover:text-foreground hover:bg-surface hover:translate-y-0',
        /** Sobre fondo oscuro (CTA final) */
        inverse: 'bg-surface-raised text-foreground hover:bg-sage',
        /** Enlace de texto */
        link: 'text-green-ink underline-offset-4 hover:underline hover:translate-y-0',
      },
      size: {
        sm: 'h-9 px-4 text-small',
        md: 'h-11 px-5 text-small',
        lg: 'h-12 px-6 text-body',
        icon: 'size-10',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Renderiza el hijo (p. ej. `<Link>` o `<a>`) con los estilos del botón. */
    asChild?: boolean;
  };

/**
 * Botón del DS. Para navegar usa `asChild` con `<Link>`/`<a>`; para acciones, `<button>`.
 * No uses `src/components/ui/button` en páginas.
 */
export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  );
}
