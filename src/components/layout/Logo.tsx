/** Marca provisional: cordillera en círculo + "Movilidad Climática CO". El nombre definitivo está pendiente. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ''}`}>
      <svg aria-hidden="true" viewBox="0 0 28 28" className="size-7 shrink-0">
        <circle cx="14" cy="14" r="13" className="fill-ink" />
        <path d="M5 19l5.5-7 3 3.5L18 9l5 10z" className="fill-background" />
        <circle cx="20" cy="7.5" r="1.6" className="fill-amber" />
      </svg>
      <span className="whitespace-nowrap font-heading text-[17px] font-semibold tracking-tight text-foreground">
        Movilidad Climática <span className="text-subtle">CO</span>
      </span>
    </span>
  );
}
