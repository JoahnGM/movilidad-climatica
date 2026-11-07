'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI, type TextosUI } from '@/lib/i18n/ui';

const Contexto = createContext<Idioma>('es');

/** Idioma de la página para los componentes de cliente. Lo fija el layout raíz a partir de la cookie. */
export function IdiomaProvider({ idioma, children }: { idioma: Idioma; children: ReactNode }) {
  return <Contexto.Provider value={idioma}>{children}</Contexto.Provider>;
}

/** Idioma actual y textos de la interfaz. */
export function useIdioma(): { idioma: Idioma; t: TextosUI } {
  const idioma = useContext(Contexto);
  return { idioma, t: UI[idioma] };
}
