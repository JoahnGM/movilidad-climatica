import { CheckCircle2, Loader2 } from 'lucide-react';

const DIMENSIONES = ['Reconocimiento y enfoque', 'Instrumentos de planeación', 'Capacidad institucional', 'Información y datos', 'Respuestas y rutas de actuación', 'Equidad y justicia climática'];

/** Ilustración del análisis por dimensiones (mismo lenguaje visual que el progreso real). */
export default function AnalisisVistaPrevia() {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-2 rounded-card border border-border bg-surface-raised p-4 shadow-raised">
      {DIMENSIONES.map((d, i) => (
        <li key={d} className="flex items-center gap-3 text-[13px]">
          {i < 4 ? <CheckCircle2 className="size-4 shrink-0 text-green-ink" /> : i === 4 ? <Loader2 className="size-4 shrink-0 animate-spin text-green-ink" /> : <span className="size-4 shrink-0 rounded-full border border-border" />}
          <span className={i < 5 ? 'text-muted' : 'text-subtle'}>{d}</span>
          <span className="ml-auto font-mono text-caption text-subtle">{i < 4 ? 'evaluada' : i === 4 ? 'evaluando…' : 'en cola'}</span>
        </li>
      ))}
    </ul>
  );
}
