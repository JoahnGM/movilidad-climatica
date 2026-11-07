import { cva, type VariantProps } from 'class-variance-authority';
import { FlaskConical, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const bannerVariants = cva(
  'w-full border-y text-small',
  {
    variants: {
      variant: {
        /** Datos ficticios o ilustrativos */
        ejemplo: 'border-amber/40 bg-amber/10 text-amber',
        /** Funcionalidad experimental o piloto */
        experimental: 'border-violet/50 bg-violet/10 text-violet-light',
        /** Aviso general */
        info: 'border-blue/40 bg-blue/10 text-blue',
      },
      sticky: {
        /** Fijo bajo la navbar (h-16) */
        true: 'sticky top-16 z-40 backdrop-blur-md',
        false: '',
      },
    },
    defaultVariants: { variant: 'info', sticky: false },
  },
);

const ICONS: Record<NonNullable<VariantProps<typeof bannerVariants>['variant']>, LucideIcon> = {
  ejemplo: TriangleAlert,
  experimental: FlaskConical,
  info: Info,
};

export interface BannerProps extends VariantProps<typeof bannerVariants> {
  children: ReactNode;
  /** Enlace o botón opcional a la derecha. */
  action?: ReactNode;
  className?: string;
}

/** Franja de aviso persistente a todo el ancho (p. ej. "Ejemplo con datos ficticios"). */
export function Banner({ variant = 'info', sticky, children, action, className }: BannerProps) {
  const Icon = ICONS[variant ?? 'info'];
  return (
    <div role="note" className={cn(bannerVariants({ variant, sticky }), className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-gutter py-3">
        <p className="flex items-start gap-2 font-medium">
          <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{children}</span>
        </p>
        {action}
      </div>
    </div>
  );
}
