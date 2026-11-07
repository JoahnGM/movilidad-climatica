'use client';

import { useEffect, useState } from 'react';

/**
 * Titular que "se escribe solo" con sugerencias fantasma estilo autocompletado de IA
 * (implementación propia). Cada tramo teclea unas letras, la IA sugiere el resto en tenue
 * y se acepta.
 *
 * Cada tramo se pinta SIEMPRE con su estilo final (fuente, color), así que no hay cambio
 * visual al terminar. Accesibilidad: una copia invisible del texto completo reserva el
 * espacio (sin saltos de layout) y es la que leen lectores de pantalla y buscadores; la
 * animación es una capa `aria-hidden`. Con movimiento reducido se muestra el texto completo.
 */

export interface TramoTitulo {
  /** Letras que se teclean a mano. */
  escribe: string;
  /** Sugerencia que la IA completa y se acepta. */
  fantasma: string;
  /** Estilo final del tramo (p. ej. serif itálica en color de acento). */
  className?: string;
}

export interface TituloIAProps {
  tramos: TramoTitulo[];
  className?: string;
  /** Clase que atenúa el texto sugerido. */
  claseFantasma?: string;
  /** Retraso inicial en ms. */
  retraso?: number;
}

/** Posición de la animación: tramo actual, letras tecleadas y si la sugerencia está visible. */
type Estado = { tramo: number; letras: number; sugerencia: boolean; terminado: boolean };

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TituloIA({ tramos, className, claseFantasma = 'opacity-30', retraso = 500 }: TituloIAProps) {
  const [e, setE] = useState<Estado>({ tramo: 0, letras: 0, sugerencia: false, terminado: false });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setE({ tramo: tramos.length, letras: 0, sugerencia: false, terminado: true });
      return;
    }
    let vivo = true;
    (async () => {
      await esperar(retraso);
      for (let i = 0; i < tramos.length; i++) {
        for (let n = 1; n <= tramos[i].escribe.length; n++) {
          if (!vivo) return;
          setE({ tramo: i, letras: n, sugerencia: false, terminado: false });
          await esperar(70 + Math.random() * 40);
        }
        await esperar(160);
        if (!vivo) return;
        setE((s) => ({ ...s, sugerencia: true }));   // la IA sugiere el resto
        await esperar(700);
        if (!vivo) return;
        setE({ tramo: i + 1, letras: 0, sugerencia: false, terminado: false }); // se acepta
        await esperar(260);
      }
      if (vivo) setE((s) => ({ ...s, terminado: true }));
    })();
    return () => { vivo = false; };
  }, [tramos, retraso]);

  const completo = tramos.map((t, i) => (
    <span key={i} className={t.className}>{t.escribe + t.fantasma}</span>
  ));

  return (
    <h1 className={`grid ${className ?? ''}`}>
      {/* Texto real: reserva el espacio, lo leen lectores de pantalla y buscadores */}
      <span className={`col-start-1 row-start-1 ${e.terminado ? '' : 'invisible'}`}>{completo}</span>
      {!e.terminado && (
        <span aria-hidden="true" className="col-start-1 row-start-1">
          {tramos.map((t, i) => {
            if (i < e.tramo) return <span key={i} className={t.className}>{t.escribe + t.fantasma}</span>;
            if (i > e.tramo) return null;
            return (
              <span key={i} className={t.className}>
                {t.escribe.slice(0, e.letras)}
                <span
                  aria-hidden="true"
                  className="mx-[0.02em] inline-block animate-pulse bg-current align-baseline"
                  style={{ width: '0.05em', height: '0.78em', transform: 'translateY(0.1em)' }}
                />
                {e.sugerencia && <span className={claseFantasma}>{t.fantasma}</span>}
              </span>
            );
          })}
        </span>
      )}
    </h1>
  );
}
