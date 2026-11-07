'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Pestañas accesibles (Radix Tabs): `role="tablist"/"tab"/"tabpanel"`, flechas ←/→,
 * Inicio/Fin, activación automática. Para fichas con campos paralelos, no para navegar.
 */
export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-6', className)} {...props} />;
}

/** Fila de pestañas. Se desplaza horizontalmente en móvil. Requiere `aria-label`. */
export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('flex w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1 [scrollbar-width:none] sm:w-fit', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'shrink-0 rounded-full px-4 py-2 text-small font-medium whitespace-nowrap text-muted transition-colors duration-150',
        'hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-surface-raised data-[state=active]:text-foreground data-[state=active]:shadow-card',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('flex flex-col gap-stack text-small text-muted', className)} {...props} />;
}
