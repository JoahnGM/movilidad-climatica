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

export const ETIQUETA_ESTADO: Record<EstadoDimension, string> = {
  fortaleza: 'Fortaleza',
  en_desarrollo: 'En desarrollo',
  brecha_critica: 'Brecha crítica',
};

export const TONO_URGENCIA: Record<UrgenciaType, Tone> = {
  inmediata: 'red',
  corto_plazo: 'amber',
  mediano_plazo: 'blue',
};

export const ETIQUETA_URGENCIA: Record<UrgenciaType, string> = {
  inmediata: 'Inmediata',
  corto_plazo: 'Corto plazo',
  mediano_plazo: 'Mediano plazo',
};

/** Número del nivel ("nivel_2" → 2). */
export const numeroNivel = (id: NivelId) => Number(id.slice(-1));
