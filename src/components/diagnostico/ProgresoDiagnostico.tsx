'use client';

import { BookOpen, Database, FileSearch, FileText, Network, Scale, ScanSearch, Shield, Sparkles } from 'lucide-react';
import { Etapas, Mono, ProgressBar, Text, type Etapa, type EstadoEtapa } from '@/components/ds';
import { useIdioma } from '@/components/i18n/IdiomaProvider';

export type FaseDiagnostico = 'acceso' | 'chat' | 'analizando' | 'resultado' | 'error';

/** Íconos de las 6 dimensiones (los textos vienen del diccionario: progreso.dimensiones). */
const ICONOS = [FileSearch, BookOpen, Network, Database, Shield, Scale];

/** Dimensión que se está explorando según los mensajes enviados (≈3 intercambios por dimensión). */
export function dimensionActiva(mensajes: number): number {
  if (mensajes >= 15) return 5;
  if (mensajes >= 12) return 4;
  if (mensajes >= 9) return 3;
  if (mensajes >= 6) return 2;
  if (mensajes >= 3) return 1;
  return 0;
}

interface Props {
  fase: FaseDiagnostico;
  /** Mensajes enviados por la persona. */
  mensajes: number;
  /** Paso del análisis (0–3) mientras `fase === 'analizando'`. */
  pasoAnalisis: number;
}

/**
 * Avance de punta a punta: las 6 dimensiones de la entrevista, el análisis de evidencia (Agente 2),
 * la síntesis (Agente 3) y el resultado. El avance de la entrevista es estimado: la IA decide el ritmo.
 */
export default function ProgresoDiagnostico({ fase, mensajes, pasoAnalisis }: Props) {
  const { t } = useIdioma();
  const tp = t.progreso;
  const entrevistaTerminada = fase === 'analizando' || fase === 'resultado';
  const activa = dimensionActiva(mensajes);

  const estadoDim = (i: number): EstadoEtapa => {
    if (entrevistaTerminada) return 'completa';
    if (fase !== 'chat' || mensajes === 0) return i === 0 && fase === 'chat' ? 'actual' : 'pendiente';
    return i < activa ? 'completa' : i === activa ? 'actual' : 'pendiente';
  };

  const estadoAnalisis: EstadoEtapa = fase === 'resultado' ? 'completa' : fase === 'analizando' ? (pasoAnalisis < 2 ? 'actual' : 'completa') : 'pendiente';
  const estadoSintesis: EstadoEtapa = fase === 'resultado' ? 'completa' : fase === 'analizando' && pasoAnalisis >= 2 ? 'actual' : 'pendiente';

  const etapas: Etapa[] = [
    ...tp.dimensiones.map(([titulo, detalle], i) => ({ id: `d${i + 1}`, titulo, detalle, icon: ICONOS[i], estado: estadoDim(i) })),
    { id: 'analisis', titulo: tp.analisis[0], detalle: tp.analisis[1], icon: ScanSearch, estado: estadoAnalisis },
    { id: 'sintesis', titulo: tp.sintesis[0], detalle: tp.sintesis[1], icon: Sparkles, estado: estadoSintesis },
    { id: 'resultado', titulo: tp.resultado, icon: FileText, estado: fase === 'resultado' ? 'completa' : 'pendiente' },
  ];

  // Peso: entrevista 75 %, análisis 20 %, resultado 5 %
  const pct =
    fase === 'resultado' ? 100
    : fase === 'analizando' ? 75 + Math.min(pasoAnalisis + 1, 4) * 5
    : fase === 'chat' ? Math.min(Math.round((mensajes / 18) * 75), 72)
    : 0;

  const dimensionesCubiertas = entrevistaTerminada ? 6 : fase === 'chat' && mensajes > 0 ? activa : 0;
  const actual = etapas.find((e) => e.estado === 'actual');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <Text variant="eyebrow">{tp.titulo}</Text>
          <Mono size="small" tone="muted">{pct}%</Mono>
        </div>
        <ProgressBar value={pct} max={100} label={tp.titulo} animate={false} />
        <Text variant="caption" tone="muted">
          {fase === 'resultado'
            ? tp.listo
            : `${tp.completadas(dimensionesCubiertas)}${actual ? ` · ${tp.ahora}: ${actual.titulo.toLowerCase()}` : ''}`}
        </Text>
      </div>
      {/* Lista completa en escritorio; en móvil basta la barra y la etapa actual */}
      <Etapas etapas={etapas} label={tp.etapasAria} estados={tp.estadoEtapa} className="hidden lg:flex" />
      <Text variant="caption" tone="muted" className="hidden lg:block">{tp.duracion}</Text>
    </div>
  );
}
