'use client';

import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Título visible y nombre accesible del diálogo. */
  title: string;
  /** Descripción accesible (si no hay, se usa el título). */
  description?: string;
  children: ReactNode;
  /** Nombre accesible del botón de cerrar (por defecto en español). */
  textoCerrar?: string;
  className?: string;
}

/**
 * Diálogo modal accesible (Radix Dialog): `role="dialog"`, `aria-modal`, foco atrapado,
 * Esc y clic afuera cierran, el foco vuelve al disparador. Para textos largos (políticas).
 */
export function Dialog({ open, onOpenChange, title, description, children, textoCerrar = 'Cerrar', className }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-card border border-border bg-surface-raised p-8 shadow-raised',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <DialogPrimitive.Title className="font-heading text-h4 font-semibold tracking-tight text-foreground">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close aria-label={textoCerrar} className="rounded-full p-1.5 text-subtle transition-colors hover:bg-surface hover:text-foreground">
              <X aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">{description ?? title}</DialogPrimitive.Description>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
