import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, Info, Lightbulb, OctagonAlert, Sparkles, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { toneAccent, toneSoftBg, toneText, type Tone } from './tones';

export const calloutVariants = cva('flex gap-4 rounded-xl border-l-[3px] p-5 md:p-6', {
  variants: {
    variant: {
      /** Definición o idea clave */
      nota: '',
      /** Contexto adicional */
      info: '',
      /** Aviso de IA: qué hace, qué no hace y cómo se evalúa */
      ia: '',
      /** Advertencia o límite de uso */
      advertencia: '',
      /** Riesgo o error que bloquea */
      critico: '',
    },
  },
  defaultVariants: { variant: 'nota' },
});

type CalloutVariant = NonNullable<VariantProps<typeof calloutVariants>['variant']>;

const DEFAULTS: Record<CalloutVariant, { tone: Tone; icon: LucideIcon }> = {
  nota: { tone: 'green', icon: Lightbulb },
  info: { tone: 'blue', icon: Info },
  ia: { tone: 'violet', icon: Sparkles },
  advertencia: { tone: 'amber', icon: AlertTriangle },
  critico: { tone: 'red', icon: OctagonAlert },
};

export interface CalloutProps extends VariantProps<typeof calloutVariants> {
  /** Rótulo monoespaciado sobre el contenido. */
  title?: string;
  children: ReactNode;
  /** Sobrescribe el tono de la variante (p. ej. color del nivel). */
  tone?: Tone;
  /** `false` oculta el ícono; o pasa otro ícono de lucide. */
  icon?: LucideIcon | false;
  className?: string;
}

/** Bloque destacado con borde izquierdo de acento. Para avisos de IA usa `variant="ia"`. */
export function Callout({ variant = 'nota', tone, title, icon, children, className }: CalloutProps) {
  const v = variant ?? 'nota';
  const t = tone ?? DEFAULTS[v].tone;
  const Icon = icon === false ? null : (icon ?? DEFAULTS[v].icon);
  return (
    <div role="note" className={cn(calloutVariants({ variant }), toneAccent[t], toneSoftBg[t], className)}>
      {Icon && <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', toneText[t])} />}
      <div className="flex min-w-0 flex-col gap-2">
        {title && <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">{title}</p>}
        <div className="text-body text-foreground">{children}</div>
      </div>
    </div>
  );
}
