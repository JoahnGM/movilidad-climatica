import { cn } from '@/lib/utils';

/**
 * Marca provisional: cordillera en círculo + "Movilidad Climática CO". El nombre definitivo está pendiente.
 * `compactoEnMovil` (solo la navbar): el nombre baja a 15 px por debajo de 400 px y por debajo de 360 px
 * queda solo el símbolo, para que quepan compartir, idioma y menú. El enlace que lo envuelve lleva su aria-label.
 */
export default function Logo({ className, compactoEnMovil = false }: { className?: string; compactoEnMovil?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <svg aria-hidden="true" viewBox="0 0 28 28" className="size-7 shrink-0">
        <circle cx="14" cy="14" r="13" className="fill-ink" />
        <path d="M5 19l5.5-7 3 3.5L18 9l5 10z" className="fill-background" />
        <circle cx="20" cy="7.5" r="1.6" className="fill-amber" />
      </svg>
      <span
        className={cn(
          'whitespace-nowrap font-heading text-[17px] font-semibold tracking-tight text-foreground',
          compactoEnMovil && 'max-[359px]:sr-only max-[399px]:text-[15px]',
        )}
      >
        Movilidad Climática <span className="text-subtle">CO</span>
      </span>
    </span>
  );
}
