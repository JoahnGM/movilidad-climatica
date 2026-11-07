'use client';

import { ChevronDown } from 'lucide-react';
import { Accordion } from 'radix-ui';
import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Tone } from './tones';

/** Borde al abrir (clases literales para que Tailwind las detecte). */
const OPEN_BORDER: Record<Tone, string> = {
  teal: 'data-[state=open]:border-teal/40',
  blue: 'data-[state=open]:border-blue/40',
  amber: 'data-[state=open]:border-amber/40',
  red: 'data-[state=open]:border-red/40',
  violet: 'data-[state=open]:border-violet/50',
  neutral: 'data-[state=open]:border-border-strong/50',
};

type DisclosureVariant = 'card' | 'list';
const VariantContext = createContext<DisclosureVariant>('list');

type RootProps = {
  children: ReactNode;
  /**
   * `list`: ítems separados por líneas (preguntas frecuentes, evidencia por pregunta).
   * `card`: cada ítem es una GlassCard (fichas que se despliegan).
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
  const rootClass = cn(variant === 'list' ? 'flex flex-col divide-y divide-border' : 'contents', className);
  return (
    <VariantContext.Provider value={variant}>
      {multiple ? (
        <Accordion.Root type="multiple" defaultValue={defaultValue} className={rootClass}>
          {children}
        </Accordion.Root>
      ) : (
        <Accordion.Root type="single" collapsible defaultValue={defaultValue?.[0]} className={rootClass}>
          {children}
        </Accordion.Root>
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
  /** Solo en variante `card`: tono del borde cuando está abierto. */
  tone?: Tone;
  disabled?: boolean;
  className?: string;
}

export function DisclosureItem({ value, title, children, tone = 'neutral', disabled, className }: DisclosureItemProps) {
  const variant = useContext(VariantContext);
  const isCard = variant === 'card';
  return (
    <Accordion.Item
      value={value}
      disabled={disabled}
      className={cn(
        'group/disclosure',
        isCard && ['glass flex flex-col overflow-hidden rounded-xl shadow-glass transition-colors duration-150', OPEN_BORDER[tone]],
        className,
      )}
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger
          className={cn(
            'flex w-full items-start justify-between gap-3 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
            isCard ? 'p-card hover:bg-glass-hover' : 'py-4 text-body font-medium text-foreground hover:text-teal',
          )}
        >
          <span className="min-w-0 flex-1">{title}</span>
          <ChevronDown
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-subtle transition-transform duration-300 group-data-[state=open]/disclosure:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className={cn(isCard ? 'border-t border-border-glass px-card pt-6 pb-card' : 'pb-5 text-small text-muted')}>
          {children}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
