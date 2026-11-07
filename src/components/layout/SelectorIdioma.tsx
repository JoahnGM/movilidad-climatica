'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useIdioma } from '@/components/i18n/IdiomaProvider';
import { guardarIdioma } from '@/lib/i18n/cliente';
import { IDIOMAS, type Idioma } from '@/lib/i18n/idioma';
import { cn } from '@/lib/utils';

/** Toggle ES/EN: guarda la cookie de idioma y vuelve a pintar la página en el servidor sin perder el estado del chat. */
/** Nombre de cada idioma en su propia lengua (así lo encuentra quien no entiende el idioma actual). */
const NOMBRES: Record<Idioma, string> = { es: 'Español', en: 'English' };

export default function SelectorIdioma({ className }: { className?: string }) {
  const { idioma, t } = useIdioma();
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();

  function cambiar(nuevo: Idioma) {
    if (nuevo === idioma) return;
    guardarIdioma(nuevo);
    iniciar(() => router.refresh());
  }

  return (
    <div role="group" aria-label={t.nav.idioma} className={cn('inline-flex rounded-full border border-border bg-surface-raised p-0.5', pendiente && 'opacity-70', className)}>
      {IDIOMAS.map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => cambiar(i)}
          aria-pressed={i === idioma}
          lang={i}
          aria-label={NOMBRES[i]}
          className={cn(
            'rounded-full px-2.5 py-1 font-mono text-caption uppercase transition-colors duration-150',
            i === idioma ? 'bg-ink text-on-accent' : 'text-muted hover:text-foreground',
          )}
        >
          {i}
        </button>
      ))}
    </div>
  );
}
