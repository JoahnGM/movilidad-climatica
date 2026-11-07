import { cva, type VariantProps } from 'class-variance-authority';
import { FlaskConical, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const bannerVariants = cva('w-full rounded-xl text-small', {
  variants: {
    variant: {
      /** Datos ficticios o ilustrativos */
      ejemplo: 'bg-amber/15 text-amber-ink',
      /** Funcionalidad experimental o piloto */
      experimental: 'bg-violet/10 text-violet-ink',
      /** Aviso general */
      info: 'bg-blue/10 text-blue-ink',
    },
  },
  defaultVariants: { variant: 'info' },
});

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

/** Franja de aviso persistente (p. ej. "Ejemplo ilustrativo con datos ficticios"). */
export function Banner({ variant = 'info', children, action, className }: BannerProps) {
  const Icon = ICONS[variant ?? 'info'];
  return (
    <div role="note" className={cn(bannerVariants({ variant }), 'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3', className)}>
      <p className="flex items-start gap-2 font-medium">
        <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>{children}</span>
      </p>
      {action}
    </div>
  );
}
