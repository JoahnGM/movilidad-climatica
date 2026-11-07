import { Sparkles } from 'lucide-react';
import { Chip } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';

/** Fragmento ilustrativo de la conversación, con el mismo estilo que el chat real. */
export default function ChatVistaPrevia({ idioma = 'es' }: { idioma?: Idioma }) {
  const t = UI[idioma].vistaPrevia;
  return (
    <div aria-hidden="true" className="flex w-full max-w-sm flex-col gap-3 rounded-card border border-border bg-surface-raised p-4 shadow-raised">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-sage text-green-ink"><Sparkles className="size-3.5" /></span>
        <span className="text-caption font-medium text-foreground">{t.asistente}</span>
        <Chip variant="experimental" size="sm" className="ml-auto">{t.chip}</Chip>
      </div>
      <p className="rounded-2xl rounded-tl-md bg-surface px-3 py-2 text-[13px] leading-snug text-foreground">{t.pregunta}</p>
      <p className="ml-8 rounded-2xl rounded-tr-md bg-ink px-3 py-2 text-[13px] leading-snug text-on-accent">{t.respuesta}</p>
    </div>
  );
}
