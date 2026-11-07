/** Enlace "Saltar al contenido" visible solo con foco de teclado. Apunta a `#contenido`. */
export function SkipLink({ href = '#contenido', label = 'Saltar al contenido principal' }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-teal focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-on-accent"
    >
      {label}
    </a>
  );
}
