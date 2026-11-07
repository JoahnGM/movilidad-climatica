import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Heading, Text } from './Typography';

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: ReactNode;
  /** Ruta de migas. El último elemento es la página actual. */
  breadcrumb?: Crumb[];
  eyebrow?: string;
  description?: ReactNode;
  /** Elemento a la derecha del título (badge de nivel, acciones). */
  aside?: ReactNode;
  className?: string;
}

/** Encabezado de página interna (no home): migas + título h1 + descripción + elemento lateral. */
export function PageHeader({ title, breadcrumb, eyebrow, description, aside, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Ruta de navegación">
          <ol className="flex flex-wrap items-center gap-1 text-caption text-subtle">
            {breadcrumb.map((c, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <li key={c.label} className="flex items-center gap-1">
                  {c.href && !last ? (
                    <Link href={c.href} className="transition-colors hover:text-foreground">{c.label}</Link>
                  ) : (
                    <span aria-current={last ? 'page' : undefined}>{c.label}</span>
                  )}
                  {!last && <span aria-hidden="true" className="mx-1">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
          <Heading as="h1" size="h2">{title}</Heading>
          {description && <Text variant="small">{description}</Text>}
        </div>
        {aside}
      </div>
    </header>
  );
}
