'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useIdioma } from '@/components/i18n/IdiomaProvider';
import { guardarIdioma } from '@/lib/i18n/cliente';
import { IDIOMAS, type Idioma } from '@/lib/i18n/idioma';
import { cn } from '@/lib/utils';

/** Toggle ES/EN (en móvil, un solo botón): guarda la cookie de idioma y vuelve a pintar la página en el servidor sin perder el estado del chat. */
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

  const otro = IDIOMAS.find((i) => i !== idioma) ?? idioma;

  return (
    <>
      {/* Móvil: un solo botón con el idioma al que se cambia. Libera espacio en la barra para
          compartir; el idioma se elige una vez, no necesita mostrar las dos opciones. */}
      <button
        type="button"
        onClick={() => cambiar(otro)}
        lang={otro}
        aria-label={NOMBRES[otro]}
        className={cn('group flex size-10 items-center justify-center md:hidden', pendiente && 'opacity-70', className)}
      >
        <span className="rounded-full border border-border bg-surface-raised px-2 py-0.5 font-mono text-caption uppercase text-muted transition-colors duration-150 group-hover:text-foreground">
          {otro}
        </span>
      </button>

      <div role="group" aria-label={t.nav.idioma} className={cn('hidden rounded-full border border-border bg-surface-raised p-0.5 md:inline-flex', pendiente && 'opacity-70', className)}>
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
    </>
  );
}
