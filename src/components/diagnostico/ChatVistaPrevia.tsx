import { Sparkles } from 'lucide-react';
import { Chip } from '@/components/ds';

/** Fragmento ilustrativo de la conversación, con el mismo estilo que el chat real. */
export default function ChatVistaPrevia() {
  return (
    <div aria-hidden="true" className="flex w-full max-w-sm flex-col gap-3 rounded-card border border-border bg-surface-raised p-4 shadow-raised">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-sage text-green-ink"><Sparkles className="size-3.5" /></span>
        <span className="text-caption font-medium text-foreground">Asistente de diagnóstico</span>
        <Chip variant="experimental" size="sm" className="ml-auto">IA · piloto</Chip>
      </div>
      <p className="rounded-2xl rounded-tl-md bg-surface px-3 py-2 text-[13px] leading-snug text-foreground">
        ¿Qué instrumentos de planeación de tu municipio incorporan hoy el riesgo de inundación?
      </p>
      <p className="ml-8 rounded-2xl rounded-tr-md bg-ink px-3 py-2 text-[13px] leading-snug text-on-accent">
        El plan de gestión del riesgo identifica los barrios ribereños como zona de inundación…
      </p>
    </div>
  );
}
