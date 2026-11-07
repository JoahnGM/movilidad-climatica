'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type Voto = 'up' | 'down';

export interface FeedbackThumbsProps {
  /** Pregunta visible ("¿Este resultado te fue útil?"). */
  pregunta: string;
  /** Valor controlado. Si se omite, el componente guarda el voto en estado local. */
  value?: Voto | null;
  /** Se llama con el voto. El DS no persiste ni envía nada. */
  onChange?: (voto: Voto) => void;
  /** Nombres accesibles de los botones. */
  labelUp?: string;
  labelDown?: string;
  disabled?: boolean;
  className?: string;
}

/** 👍/👎 visual con callbacks. Sin persistencia ni analítica (eso vive fuera de ds/). */
export function FeedbackThumbs({ pregunta, value, onChange, labelUp = 'Sí', labelDown = 'No', disabled, className }: FeedbackThumbsProps) {
  const [local, setLocal] = useState<Voto | null>(null);
  const actual = value === undefined ? local : value;

  function votar(v: Voto) {
    if (value === undefined) setLocal(v);
    onChange?.(v);
  }

  const base = 'inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4';
  return (
    <div role="group" aria-label={pregunta} className={cn('flex flex-wrap items-center gap-4', className)}>
      <p className="text-small text-muted">{pregunta}</p>
      <div className="flex gap-2">
        <button type="button" aria-pressed={actual === 'up'} aria-label={labelUp} disabled={disabled} onClick={() => votar('up')}
          className={cn(base, actual === 'up' ? 'border-green bg-green text-on-accent' : 'border-border bg-surface-raised text-muted hover:border-green hover:text-green-ink')}>
          <ThumbsUp aria-hidden="true" />
        </button>
        <button type="button" aria-pressed={actual === 'down'} aria-label={labelDown} disabled={disabled} onClick={() => votar('down')}
          className={cn(base, actual === 'down' ? 'border-amber bg-amber text-foreground' : 'border-border bg-surface-raised text-muted hover:border-amber hover:text-amber-ink')}>
          <ThumbsDown aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
