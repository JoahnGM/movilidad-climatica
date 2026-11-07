'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Pestañas accesibles (Radix Tabs): `role="tablist"/"tab"/"tabpanel"`, flechas ←/→
 * para moverse, Inicio/Fin, activación automática. Úsalas para fichas con campos
 * paralelos (p. ej. las 6 secciones de una ciudad), no para navegación entre páginas.
 */
export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-6', className)} {...props} />;
}

/** Fila de pestañas. Se desplaza horizontalmente en móvil. Requiere `aria-label`. */
export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex w-full gap-1 overflow-x-auto rounded-xl border border-border-glass bg-glass p-1 [scrollbar-width:none]',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'shrink-0 rounded-lg px-4 py-2 text-small font-medium whitespace-nowrap text-muted transition-colors duration-150',
        'hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-[inset_0_0_0_1px_var(--color-teal)]',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('flex flex-col gap-stack text-small text-muted', className)}
      {...props}
    />
  );
}
