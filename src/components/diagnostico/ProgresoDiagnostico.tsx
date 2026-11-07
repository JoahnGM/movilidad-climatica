'use client';

import { BookOpen, Database, FileSearch, FileText, Network, Scale, ScanSearch, Shield, Sparkles } from 'lucide-react';
import { Etapas, Mono, ProgressBar, Text, type Etapa, type EstadoEtapa } from '@/components/ds';

export type FaseDiagnostico = 'acceso' | 'chat' | 'analizando' | 'resultado' | 'error';

/** Las 6 dimensiones como las ve la persona durante la entrevista, con lo que se explora en cada una. */
const DIMENSIONES = [
  { icon: FileSearch, label: 'Reconocimiento y enfoque',        detalle: 'Cómo se entiende la movilidad climática en el territorio' },
  { icon: BookOpen,   label: 'Instrumentos de planeación',      detalle: 'POT, plan de gestión del riesgo, decretos y políticas' },
  { icon: Network,    label: 'Capacidad institucional',         detalle: 'Quién hace qué y cómo se coordinan las secretarías' },
  { icon: Database,   label: 'Información y datos',             detalle: 'Datos de riesgo y población, y cómo se usan' },
  { icon: Shield,     label: 'Respuestas y rutas de actuación', detalle: 'Prevención, reubicación y vivienda digna' },
  { icon: Scale,      label: 'Equidad y justicia climática',    detalle: 'Grupos vulnerables, derechos y participación' },
];

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
    ...DIMENSIONES.map((d, i) => ({ id: `d${i + 1}`, titulo: d.label, detalle: d.detalle, icon: d.icon, estado: estadoDim(i) })),
    { id: 'analisis', titulo: 'Análisis de la evidencia', detalle: 'Se puntúan las 18 preguntas solo con lo que dijiste', icon: ScanSearch, estado: estadoAnalisis },
    { id: 'sintesis', titulo: 'Síntesis y recomendaciones', detalle: 'Nivel, brechas y una ruta de acción para tu municipio', icon: Sparkles, estado: estadoSintesis },
    { id: 'resultado', titulo: 'Tu resultado', icon: FileText, estado: fase === 'resultado' ? 'completa' : 'pendiente' },
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
          <Text variant="eyebrow">Progreso del diagnóstico</Text>
          <Mono size="small" tone="muted">{pct}%</Mono>
        </div>
        <ProgressBar value={pct} max={100} label="Progreso del diagnóstico" animate={false} />
        <Text variant="caption" tone="muted">
          {fase === 'resultado'
            ? 'Diagnóstico listo'
            : `${dimensionesCubiertas} de 6 dimensiones completadas${actual ? ` · ahora: ${actual.titulo.toLowerCase()}` : ''}`}
        </Text>
      </div>
      {/* Lista completa en escritorio; en móvil basta la barra y la etapa actual */}
      <Etapas etapas={etapas} label="Etapas del diagnóstico" className="hidden lg:flex" />
      <Text variant="caption" tone="muted" className="hidden lg:block">La conversación toma entre 10 y 15 minutos</Text>
    </div>
  );
}
