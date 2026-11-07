'use client';

import { ChevronDown } from 'lucide-react';
import { Accordion } from 'radix-ui';
import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DisclosureVariant = 'card' | 'list';
const VariantContext = createContext<DisclosureVariant>('list');

type RootProps = {
  children: ReactNode;
  /**
   * `list`: ítems separados por líneas (preguntas frecuentes, evidencia por pregunta).
   * `card`: cada ítem es una tarjeta (fichas que se despliegan).
   */
  variant?: DisclosureVariant;
  /** Permite abrir varios a la vez (por defecto sí). */
  multiple?: boolean;
  /** Valores abiertos al cargar. */
  defaultValue?: string[];
  className?: string;
};

/**
 * Acordeón accesible (Radix Accordion): botón con `aria-expanded`/`aria-controls`,
 * región asociada, Enter/Espacio para abrir y flechas ↑/↓, Inicio/Fin entre encabezados.
 */
export function Disclosure({ children, variant = 'list', multiple = true, defaultValue, className }: RootProps) {
  const rootClass = cn(variant === 'list' ? 'flex flex-col divide-y divide-border border-y border-border' : 'contents', className);
  return (
    <VariantContext.Provider value={variant}>
      {multiple ? (
        <Accordion.Root type="multiple" defaultValue={defaultValue} className={rootClass}>{children}</Accordion.Root>
      ) : (
        <Accordion.Root type="single" collapsible defaultValue={defaultValue?.[0]} className={rootClass}>{children}</Accordion.Root>
      )}
    </VariantContext.Provider>
  );
}

export interface DisclosureItemProps {
  /** Identificador único dentro del Disclosure. */
  value: string;
  /** Contenido del encabezado (botón). Puede incluir títulos y badges. */
  title: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function DisclosureItem({ value, title, children, disabled, className }: DisclosureItemProps) {
  const variant = useContext(VariantContext);
  const isCard = variant === 'card';
  return (
    <Accordion.Item
      value={value}
      disabled={disabled}
      className={cn(
        'group/disclosure',
        isCard && 'flex flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-card transition-colors data-[state=open]:border-border-strong/50',
        className,
      )}
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger
          className={cn(
            'flex w-full items-start justify-between gap-3 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
            isCard ? 'p-card hover:bg-background' : 'py-4 text-body font-medium text-foreground hover:text-green-ink',
          )}
        >
          <span className="min-w-0 flex-1">{title}</span>
          <ChevronDown aria-hidden="true" className="mt-1 size-4 shrink-0 text-subtle transition-transform duration-300 group-data-[state=open]/disclosure:rotate-180" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className={cn(isCard ? 'border-t border-border px-card pt-6 pb-card' : 'pb-5 text-small text-muted')}>{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
