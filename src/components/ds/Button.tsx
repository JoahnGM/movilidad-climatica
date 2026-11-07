import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-4',
  {
    variants: {
      variant: {
        /** Acción principal: una por vista */
        primary: 'bg-teal text-on-accent hover:bg-teal/90',
        /** Acción principal en navegación (borde teal) */
        accent: 'border border-teal text-teal font-medium hover:bg-teal/10',
        /** Acciones secundarias */
        secondary: 'border border-border-strong/60 text-muted font-medium hover:text-foreground hover:border-muted',
        /** Acciones terciarias o íconos */
        ghost: 'text-muted font-medium hover:text-foreground hover:bg-glass',
        /** Enlace de texto con flecha */
        link: 'text-teal font-medium hover:text-teal/80 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-small',
        md: 'h-11 px-5 text-small',
        lg: 'h-13 px-10 text-body',
        icon: 'size-10',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Renderiza el hijo (p. ej. `<Link>`) con los estilos del botón. */
    asChild?: boolean;
  };

/**
 * Botón del DS. Para navegar usa `asChild` con `<Link>`; para acciones, `<button>`.
 * No uses `src/components/ui/button` en páginas: su variante ghost asume otro `muted`.
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
