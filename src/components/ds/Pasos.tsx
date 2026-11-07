import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { Mono, Heading, Text } from './Typography';

export interface Paso {
  icon: LucideIcon;
  titulo: string;
  descripcion: ReactNode;
  /** Ilustración del paso (normalmente una pieza de la interfaz real). */
  visual?: ReactNode;
}

export interface PasosProps {
  pasos: Paso[];
  className?: string;
}

/**
 * "Cómo funciona": línea vertical con nodos que pulsan y una tarjeta por paso.
 * Centrada en escritorio, alineada a la izquierda en móvil. El pulso respeta movimiento reducido.
 */
export function Pasos({ pasos, className }: PasosProps) {
  return (
    <ol className={cn('relative mx-auto flex w-full max-w-3xl flex-col gap-14', className)}>
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-5 w-px bg-border md:left-1/2" />
      {pasos.map((p, i) => {
        const Icon = p.icon;
        return (
          <Reveal as="li" key={p.titulo} className="relative flex flex-col pl-16 md:pl-0">
            <span aria-hidden="true" className="absolute top-0 left-0 z-[1] flex size-10 items-center justify-center rounded-full bg-green text-on-accent md:left-1/2 md:-translate-x-1/2">
              <span className="absolute inset-0 rounded-full bg-green motion-safe:animate-[pulso-nodo_2s_ease-out_infinite]" />
              <Icon className="relative size-[18px]" />
            </span>
            <div className="flex flex-col gap-5 rounded-card border border-border bg-surface-raised p-6 shadow-raised md:mt-16 md:p-8">
              <div className="flex flex-col gap-2">
                <Mono size="caption" tone="muted">Paso {String(i + 1).padStart(2, '0')}</Mono>
                <Heading as="h3" size="h3">{p.titulo}</Heading>
                <Text variant="body">{p.descripcion}</Text>
              </div>
              {p.visual && <div className="flex justify-center rounded-[calc(var(--radius-card)-0.5rem)] bg-surface p-4 sm:p-6 [&>*]:w-full [&>*]:max-w-md">{p.visual}</div>}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
