'use client';

import { useEffect, useState } from 'react';
import { Loader2, BarChart2, Brain, FileCheck, CheckCircle2 } from 'lucide-react';

const PASOS = [
  { icon: Loader2,    label: 'Procesando la entrevista...',                    ms: 0 },
  { icon: BarChart2,  label: 'Evaluando las 6 dimensiones de gobernanza...',   ms: 3000 },
  { icon: Brain,      label: 'Generando el diagnóstico con IA...',             ms: 8000 },
  { icon: FileCheck,  label: 'Preparando tu resultado...',                     ms: 14000 },
] as const;

const TOTAL_MS = 25_000;

export default function DiagnosticoLoader() {
  const [pasoActual, setPasoActual] = useState(0);
  const [progreso, setProgreso] = useState(0);

  // Activar pasos en los tiempos definidos
  useEffect(() => {
    const timers = PASOS.slice(1).map(({ ms }, i) =>
      setTimeout(() => setPasoActual(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Barra de progreso animada (actualiza cada 200ms)
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgreso(Math.min((elapsed / TOTAL_MS) * 100, 98));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glassmorphism w-full max-w-md p-8 flex flex-col gap-6">
        {/* Pasos */}
        <div className="flex flex-col gap-4">
          {PASOS.map(({ icon: Icon, label }, i) => {
            const completado = i < pasoActual;
            const activo = i === pasoActual;
            if (i > pasoActual) return null;

            return (
              <div key={label} className="flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                  {completado ? (
                    <CheckCircle2 className="text-teal w-6 h-6" />
                  ) : activo ? (
                    <Icon
                      className={`w-6 h-6 text-teal ${Icon === Loader2 ? 'animate-spin' : ''}`}
                    />
                  ) : null}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    completado ? 'text-muted line-through' : activo ? 'text-foreground' : 'text-subtle'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Barra de progreso */}
        <div className="flex flex-col gap-2">
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: '#1E2A45' }}
          >
            <div
              className="h-full bg-teal rounded-full transition-all duration-200"
              style={{ width: `${progreso}%` }}
            />
          </div>
          <p className="text-xs text-subtle text-center">
            Esto puede tomar hasta 25 segundos
          </p>
        </div>
      </div>
    </div>
  );
}
