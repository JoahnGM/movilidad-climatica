'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MOTION } from '../motion';

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
  /** Elemento semántico (h1 por defecto: es el titular del hero). */
  as?: 'h1' | 'h2' | 'p';
  /**
   * `escribir`: teclea con sugerencia fantasma (efecto original).
   * `suave`: las palabras aparecen en cascada con fundido, leve subida y desenfoque que se
   * aclara (patrón de heroes tipo Linear/Vercel). Es el que usa el hero del home.
   */
  efecto?: 'escribir' | 'suave';
}

/** Entrada suave por palabras. El texto está completo desde el inicio (sin saltos de layout). */
function TituloSuave({ tramos, className, retraso, as: Comp }: Required<Pick<TituloIAProps, 'tramos' | 'retraso' | 'as'>> & { className?: string }) {
  const reducir = useReducedMotion();
  let indice = 0;
  return (
    <Comp className={className}>
      {tramos.map((t, i) => {
        const palabras = (t.escribe + t.fantasma).split(/(\s+)/);
        return (
          <span key={i} className={t.className}>
            {palabras.map((p, j) => {
              if (!p.trim()) return p;
              const n = indice++;
              return (
                <motion.span
                  key={j}
                  className="[display:inline-block] will-change-transform"
                  initial={reducir ? { opacity: 0 } : { opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
                  animate={reducir ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: reducir ? MOTION.base : 0.9, ease: MOTION.ease, delay: retraso / 1000 + n * MOTION.stagger }}
                >
                  {p}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </Comp>
  );
}

/** Posición de la animación: tramo actual, letras tecleadas y si la sugerencia está visible. */
type Estado = { tramo: number; letras: number; sugerencia: boolean; terminado: boolean };

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TituloIA(props: TituloIAProps) {
  if (props.efecto === 'suave') {
    return <TituloSuave tramos={props.tramos} className={props.className} retraso={props.retraso ?? 150} as={props.as ?? 'h1'} />;
  }
  return <TituloEscribe {...props} />;
}

function TituloEscribe({ tramos, className, claseFantasma = 'opacity-30', retraso = 500, as: Comp = 'h1' }: TituloIAProps) {
  const [estado, setE] = useState<Estado>({ tramo: 0, letras: 0, sugerencia: false, terminado: false });
  // Con movimiento reducido se muestra el texto completo desde el inicio
  const reducir = useReducedMotion();
  const e = reducir ? { ...estado, terminado: true } : estado;

  useEffect(() => {
    if (reducir) return;
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
  }, [tramos, retraso, reducir]);

  const completo = tramos.map((t, i) => (
    <span key={i} className={t.className}>{t.escribe + t.fantasma}</span>
  ));

  return (
    <Comp className={`grid ${className ?? ''}`}>
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
                  className="mx-[0.02em] [display:inline-block] animate-pulse bg-current align-baseline"
                  style={{ width: '0.05em', height: '0.78em', transform: 'translateY(0.1em)' }}
                />
                {e.sugerencia && <span className={claseFantasma}>{t.fantasma}</span>}
              </span>
            );
          })}
        </span>
      )}
    </Comp>
  );
}
