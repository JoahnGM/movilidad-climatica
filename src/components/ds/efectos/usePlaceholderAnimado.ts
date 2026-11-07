'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Placeholder que se escribe y se borra solo, frase por frase (invitación + ejemplos).
 * Se detiene mientras `activo` es false (campo enfocado o con texto) y con movimiento
 * reducido devuelve la primera frase fija. El placeholder no se anuncia a lectores de
 * pantalla: el campo conserva su etiqueta accesible.
 */
export function usePlaceholderAnimado(frases: string[], activo = true): string {
  const reducir = useReducedMotion();
  const [texto, setTexto] = useState(frases[0] ?? '');
  const clave = frases.join('|');

  useEffect(() => {
    if (reducir || !activo) return;
    let vivo = true;
    const lista = clave.split('|');
    (async () => {
      for (let i = 0; vivo; i = (i + 1) % lista.length) {
        const frase = lista[i];
        for (let n = 1; n <= frase.length && vivo; n++) {
          setTexto(frase.slice(0, n));
          await esperar(45 + Math.random() * 35);
        }
        await esperar(1800);
        for (let n = frase.length; n >= 0 && vivo; n--) {
          setTexto(frase.slice(0, n));
          await esperar(22);
        }
        await esperar(300);
      }
    })();
    return () => { vivo = false; };
  }, [clave, activo, reducir]);

  return reducir || !activo ? (frases[0] ?? '') : texto;
}
