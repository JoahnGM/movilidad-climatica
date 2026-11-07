import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Bloque de carga. Dale tamaño con clases (`h-4 w-3/4`). Respeta movimiento reducido. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-lg bg-surface', className)} {...props} />;
}
