import type { Tone } from '@/components/ds';
import type { EstadoDimension, NivelId, UrgenciaType } from '@/lib/types';

/** Tono del DS para cada nivel (reemplaza el color hex de NIVELES en matriz.ts). */
export const TONO_NIVEL: Record<NivelId, Tone> = {
  nivel_1: 'red',
  nivel_2: 'amber',
  nivel_3: 'blue',
  nivel_4: 'green',
};

export const TONO_ESTADO: Record<EstadoDimension, Tone> = {
  fortaleza: 'green',
  en_desarrollo: 'blue',
  brecha_critica: 'red',
};


export const TONO_URGENCIA: Record<UrgenciaType, Tone> = {
  inmediata: 'red',
  corto_plazo: 'amber',
  mediano_plazo: 'blue',
};


/** Número del nivel ("nivel_2" → 2). */
export const numeroNivel = (id: NivelId) => Number(id.slice(-1));
