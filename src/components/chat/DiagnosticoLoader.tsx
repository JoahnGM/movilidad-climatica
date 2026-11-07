'use client';

import { useEffect, useState } from 'react';
import { Loader2, BarChart2, Brain, FileCheck, CheckCircle2 } from 'lucide-react';
import { Card, ProgressBar, Text } from '@/components/ds';
import { cn } from '@/lib/utils';

export const PASOS_ANALISIS = [
  { icon: Loader2,    label: 'Procesando la entrevista...',                    ms: 0 },
  { icon: BarChart2,  label: 'Evaluando las 6 dimensiones de gobernanza...',   ms: 3000 },
  { icon: Brain,      label: 'Generando el diagnóstico con IA...',             ms: 8000 },
  { icon: FileCheck,  label: 'Preparando tu resultado...',                     ms: 14000 },
] as const;

const TOTAL_MS = 25_000;

interface Props {
  /** Avisa al padre qué paso está activo (para el tracker de progreso). */
  onPaso?: (paso: number) => void;
}

/** Análisis en curso (Agentes 2 y 3), dentro de la misma sección del diagnóstico. */
export default function DiagnosticoLoader({ onPaso }: Props) {
  const [pasoActual, setPasoActual] = useState(0);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const timers = PASOS_ANALISIS.slice(1).map(({ ms }, i) => setTimeout(() => setPasoActual(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => { onPaso?.(pasoActual); }, [pasoActual, onPaso]);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setProgreso(Math.min(((Date.now() - start) / TOTAL_MS) * 100, 98));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card variant="raised" padding="lg" className="min-h-[480px] justify-center" aria-live="polite">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-4">
          {PASOS_ANALISIS.map(({ icon: Icon, label }, i) => {
            if (i > pasoActual) return null;
            const completado = i < pasoActual;
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center">
                  {completado ? (
                    <CheckCircle2 aria-hidden="true" className="size-5 text-green-ink" />
                  ) : (
                    <Icon aria-hidden="true" className={cn('size-5 text-green-ink', Icon === Loader2 && 'animate-spin')} />
                  )}
                </span>
                <span className={cn('text-small', completado ? 'text-subtle line-through' : 'text-foreground')}>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <ProgressBar value={Math.round(progreso)} max={100} label="Avance del análisis" animate={false} size="sm" />
          <Text variant="caption" tone="muted" className="text-center">Esto puede tomar hasta 25 segundos</Text>
        </div>
      </div>
    </Card>
  );
}
