'use client';

import { useEffect, useRef, useState } from 'react';
import { Popover } from 'radix-ui';
import { Check, Link2, Mail, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ds';
import { useIdioma } from '@/components/i18n/IdiomaProvider';

/**
 * Compartir la plataforma (plan-feedback §10.2). Solo comparte el ENLACE de la plataforma:
 * nunca el resultado ni la transcripción (viven en localStorage) ni datos del usuario en la URL.
 *
 * - Pantallas táctiles con Web Share API → hoja nativa del sistema (WhatsApp, correo, etc.).
 * - Escritorio o sin Web Share → menú con "Copiar enlace", WhatsApp (wa.me) y correo.
 */
export interface BotonCompartirProps {
  /** `icono`: botón cuadrado para la navbar; `boton`: con texto. */
  forma?: 'icono' | 'boton';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Marca de origen sin datos personales (Plausible y otras herramientas la leen como fuente). */
const REF = 'compartir';

function enlacePlataforma(): string {
  const url = new URL('/', window.location.origin);
  url.searchParams.set('ref', REF);
  return url.toString();
}

/** Respaldo cuando el navegador bloquea navigator.clipboard (permisos, iframes). */
function copiarClasico(texto: string, contenedor: HTMLElement): boolean {
  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  // Dentro del menú: si el foco sale del Popover, Radix lo cerraría.
  contenedor.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

function usaHojaNativa(): boolean {
  return typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;
}

export default function BotonCompartir({ forma = 'boton', variant = 'secondary', size = 'md', className }: BotonCompartirProps) {
  const { t: textos } = useIdioma();
  const t = textos.compartir;
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  // El enlace depende de window: se calcula en el cliente al montar (en el servidor queda vacío).
  const [enlace, setEnlace] = useState('');
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    setEnlace(enlacePlataforma()); // eslint-disable-line react-hooks/set-state-in-effect -- window solo existe en el cliente
    return () => clearTimeout(temporizador.current);
  }, []);

  async function alPulsar(e: React.MouseEvent) {
    if (!usaHojaNativa()) return; // el Popover se abre solo
    e.preventDefault();
    try {
      await navigator.share({ title: t.titulo, text: t.mensaje, url: enlace || enlacePlataforma() });
    } catch (err) {
      // Cancelar no es un error. Si la hoja nativa falla por otra razón, se ofrece el menú.
      if (!(err instanceof DOMException && err.name === 'AbortError')) setAbierto(true);
    }
  }

  const [manual, setManual] = useState(false);

  /** Portapapeles moderno → método clásico → enlace visible y seleccionado para copiar a mano. */
  async function copiar(e: React.MouseEvent<HTMLButtonElement>) {
    const contenedor = e.currentTarget.parentElement ?? document.body;
    const texto = enlace || enlacePlataforma();
    let ok = false;
    try {
      await navigator.clipboard.writeText(texto);
      ok = true;
    } catch {
      ok = copiarClasico(texto, contenedor);
    }
    if (!ok) {
      setManual(true);
      return;
    }
    setCopiado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setCopiado(false), 4000);
  }

  const textoConEnlace = `${t.mensaje} ${enlace}`;
  const opcion =
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-small text-foreground transition-colors hover:bg-surface focus-visible:bg-surface';

  return (
    <Popover.Root open={abierto} onOpenChange={(v) => { setAbierto(v); if (!v) setManual(false); }}>
      <Popover.Trigger asChild>
        <Button
          variant={variant}
          size={forma === 'icono' ? 'icon' : size}
          className={className}
          onClick={alPulsar}
          aria-label={forma === 'icono' ? t.boton : undefined}
        >
          <Share2 aria-hidden="true" />
          {forma === 'boton' && t.boton}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-72 rounded-card border border-border bg-surface-raised p-2 shadow-raised"
        >
          <p className="px-3 pt-2 pb-1 text-caption text-subtle">{t.ayuda}</p>
          <ul className="flex flex-col">
            <li>
              <button type="button" className={opcion} onClick={copiar}>
                {copiado ? <Check aria-hidden="true" className="size-4 text-green-ink" /> : <Link2 aria-hidden="true" className="size-4 text-muted" />}
                {copiado ? t.copiado : t.copiar}
              </button>
            </li>
            <li>
              <a
                className={opcion}
                href={`https://wa.me/?text=${encodeURIComponent(textoConEnlace)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAbierto(false)}
              >
                <MessageCircle aria-hidden="true" className="size-4 text-muted" />
                {t.whatsapp}
              </a>
            </li>
            <li>
              <a
                className={opcion}
                href={`mailto:?subject=${encodeURIComponent(t.titulo)}&body=${encodeURIComponent(textoConEnlace)}`}
                onClick={() => setAbierto(false)}
              >
                <Mail aria-hidden="true" className="size-4 text-muted" />
                {t.correo}
              </a>
            </li>
          </ul>
          {manual && (
            <label className="flex flex-col gap-1 px-3 pt-1 pb-2 text-caption text-subtle">
              {t.copiaManual}
              <input
                readOnly
                value={enlace}
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
                className="rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-caption text-foreground"
              />
            </label>
          )}
          {/* Anuncio para lectores de pantalla (patrón GOV.UK / MoJ "Copy button"). */}
          <p aria-live="polite" className="sr-only">{copiado ? t.copiado : ''}</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
