'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GRUPOS } from './grupos';

const ITEMS = [{ slug: '', titulo: 'Inicio' }, ...GRUPOS];

export function CatalogoNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Catálogo del design system" className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 hidden text-caption font-semibold uppercase tracking-widest text-subtle lg:block">
        Design system
      </p>
      <ul className="-mx-gutter flex gap-1 overflow-x-auto px-gutter pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
        {ITEMS.map((g) => {
          const href = g.slug ? `/ds/${g.slug}` : '/ds';
          const activo = pathname === href;
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={activo ? 'page' : undefined}
                className={cn(
                  'block rounded-lg px-3 py-2 text-small transition-colors',
                  activo ? 'bg-teal/10 text-teal' : 'text-muted hover:bg-glass hover:text-foreground',
                )}
              >
                {g.titulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
