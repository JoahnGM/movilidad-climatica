import type { ReactNode } from 'react';
import { Heading, Text } from '@/components/ds';
import { cn } from '@/lib/utils';

export interface SpecimenProps {
  /** Nombre exacto del componente exportado (sirve de ancla). */
  nombre: string;
  descripcion: ReactNode;
  /** Código de ejemplo listo para copiar. */
  codigo: string;
  usar: string[];
  noUsar: string[];
  /** Notas de accesibilidad y estados. */
  a11y?: string;
  /** Vista previa en vivo. */
  children: ReactNode;
  /** Fondo de la vista previa. */
  fondo?: 'base' | 'alt';
  /** Ruta del archivo fuente. */
  archivo: string;
}

/** Ficha de una primitiva: demo en vivo + código + cuándo usarla. */
export function Specimen({ nombre, descripcion, codigo, usar, noUsar, a11y, children, fondo = 'base', archivo }: SpecimenProps) {
  return (
    <section id={nombre} aria-labelledby={`${nombre}-titulo`} className="flex scroll-mt-24 flex-col gap-5 border-t border-border pt-12">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Heading as="h2" size="h3" id={`${nombre}-titulo`}>
            {`<${nombre}>`}
          </Heading>
          <code className="font-mono text-caption text-subtle">{archivo}</code>
        </div>
        <Text variant="body">{descripcion}</Text>
      </div>

      <div
        className={cn(
          'flex flex-col gap-6 rounded-card border border-dashed border-border-strong/50 p-6 md:p-8',
          fondo === 'alt' ? 'bg-background-alt' : 'bg-background',
        )}
      >
        {children}
      </div>

      <details className="group rounded-xl border border-border bg-surface-raised">
        <summary className="cursor-pointer list-none px-5 py-3 text-small font-medium text-muted transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span className="inline-block transition-transform group-open:rotate-90" aria-hidden="true">▸</span> Código
        </summary>
        <pre className="overflow-x-auto border-t border-border px-5 py-4 font-mono text-caption leading-relaxed text-muted">
          <code>{codigo.trim()}</code>
        </pre>
      </details>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Text variant="eyebrow" tone="green">Úsala para</Text>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-small text-muted marker:text-green">
            {usar.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <Text variant="eyebrow" tone="amber">No la uses para</Text>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-small text-muted marker:text-amber">
            {noUsar.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </div>
      </div>
      {a11y && (
        <Text variant="small" tone="muted">
          <span className="font-medium text-muted">Accesibilidad y estados: </span>
          {a11y}
        </Text>
      )}
    </section>
  );
}

/** Fila etiquetada dentro de una vista previa (variantes, estados). */
export function Muestra({ etiqueta, children, className }: { etiqueta: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-caption text-subtle">{etiqueta}</span>
      <div className={cn('flex flex-wrap items-center gap-4', className)}>{children}</div>
    </div>
  );
}

/** Encabezado de página del catálogo. */
export function CabeceraCatalogo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 pb-4">
      <Text variant="eyebrow">Design system</Text>
      <Heading as="h1" size="h1">{titulo}</Heading>
      <Text variant="lead" className="max-w-3xl">{children}</Text>
    </header>
  );
}
