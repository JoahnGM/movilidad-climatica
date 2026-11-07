'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { ArrowUp, CheckCircle2, Sparkles } from 'lucide-react';
import { Button, Chip, IconList, Text } from '@/components/ds';
import { cn } from '@/lib/utils';
import { CLAVE_MUNICIPIO_INICIAL } from '@/components/diagnostico/eventos';
import { useIdioma } from '@/components/i18n/IdiomaProvider';

type Estado = 'activo' | 'completado';

function textoDe(m: UIMessage): string {
  return m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('');
}

interface Props {
  onUserMessageCount?: (count: number) => void;
  /** Se llama una vez cuando el entrevistador cierra la entrevista (ya guardada en localStorage). */
  onCompletado?: () => void;
  /** El servidor pidió código de acceso (piloto cerrado). */
  onRequiereAcceso?: () => void;
  className?: string;
}

export default function ChatInterface({ onUserMessageCount, onCompletado, onRequiereAcceso, className }: Props) {
  const { t: textos } = useIdioma();
  const t = textos.chat;
  const scrollRef = useRef<HTMLDivElement>(null);
  const completadoRef = useRef(false);

  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    // Si el servidor rechaza el turno (4xx), se quita del historial y vuelve al input
    // para que el siguiente envío no repita el mismo mensaje rechazado.
    onError: (e) => {
      if (/código de acceso/i.test(e.message)) onRequiereAcceso?.();
      setMessages((prev) => {
        const ultimo = prev[prev.length - 1];
        if (ultimo?.role !== 'user') return prev;
        setInput(textoDe(ultimo));
        return prev.slice(0, -1);
      });
    },
  });
  const isLoading = status === 'submitted' || status === 'streaming';

  // La entrevista termina cuando el último mensaje del entrevistador trae el tag de cierre
  // (solo el servidor lo emite; si llega en un turno del usuario, la API lo rechaza).
  const ultimo = messages[messages.length - 1];
  const estado: Estado =
    status !== 'streaming' && ultimo?.role === 'assistant' && textoDe(ultimo).includes('[ENTREVISTA_COMPLETA]')
      ? 'completado'
      : 'activo';

  // Reportar conteo de mensajes del usuario al padre
  useEffect(() => {
    const count = messages.filter((m) => m.role === 'user').length;
    onUserMessageCount?.(count);
  }, [messages, onUserMessageCount]);

  // Al montar: enviar municipio-inicial si existe. El timeout cancelable evita el envío
  // doble (o perdido) cuando React monta, desmonta y vuelve a montar en modo estricto.
  useEffect(() => {
    const municipioInicial = localStorage.getItem(CLAVE_MUNICIPIO_INICIAL);
    if (!municipioInicial) return;
    const t = setTimeout(() => {
      localStorage.removeItem(CLAVE_MUNICIPIO_INICIAL);
      sendMessage({ text: municipioInicial });
    }, 0);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll automático al último mensaje, solo dentro del panel (no mueve la página)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // Al terminar la entrevista: guardar transcripción y avisar al padre
  useEffect(() => {
    if (estado !== 'completado' || completadoRef.current) return;
    completadoRef.current = true;

    const transcript = messages
      .map((m) => {
        const label = m.role === 'user' ? 'FUNCIONARIO' : 'ENTREVISTADOR';
        return label + ':\n' + textoDe(m).replace('[ENTREVISTA_COMPLETA]', '').trim();
      })
      .join('\n\n---\n\n');

    const primerMensaje = textoDe(messages.find((m) => m.role === 'user') ?? messages[0]);

    localStorage.setItem('diagnostico-transcript', transcript);
    localStorage.setItem('diagnostico-municipio', primerMensaje);
    onCompletado?.();
  }, [messages, estado, onCompletado]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isLoading || estado === 'completado') return;
    sendMessage({ text });
    setInput('');
  }

  return (
    <div className={cn('flex h-[min(680px,calc(100svh-9rem))] min-h-[480px] flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-raised', className)}>
      {/* Encabezado: aviso de IA + competencia + límite, siempre juntos */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage text-green-ink">
          <Sparkles className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-small font-medium text-foreground">{t.asistente}</span>
          <span className="text-caption text-subtle">{t.aviso}</span>
        </div>
        <Chip variant="experimental" size="sm" className="ml-auto hidden sm:inline-flex">{t.chip}</Chip>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} role="log" aria-live="polite" aria-label={t.logAria} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-6">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col gap-4 rounded-xl bg-surface p-5">
            <p className="font-heading text-h4 font-semibold tracking-tight text-foreground">{t.bienvenidaTitulo}</p>
            <Text variant="small">{t.bienvenidaTexto}</Text>
            <IconList
              spacing="tight"
              icon={CheckCircle2}
              items={t.bienvenidaItems}
            />
            <Text variant="caption" tone="muted">{t.bienvenidaPie}</Text>
          </div>
        )}

        {messages.map((msg) => {
          const text = textoDe(msg).replace('[ENTREVISTA_COMPLETA]', '').trim();
          if (!text) return null;
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] whitespace-pre-wrap px-4 py-3 text-small leading-relaxed',
                  isUser ? 'rounded-2xl rounded-tr-md bg-ink text-on-accent' : 'rounded-2xl rounded-tl-md bg-surface text-foreground',
                )}
              >
                <span className="sr-only">{isUser ? t.tu : t.asistenteSr}</span>
                {text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start" aria-label={t.escribiendo}>
            <div className="rounded-2xl rounded-tl-md bg-surface px-4 py-3.5">
              <div className="flex h-3 items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 animate-bounce rounded-full bg-subtle" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entrada */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-border-strong/50 bg-background p-1.5 transition-colors focus-within:border-green">
          <label htmlFor="chat-respuesta" className="sr-only">{t.campo}</label>
          <textarea
            id="chat-respuesta"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || estado === 'completado'}
            placeholder={estado === 'completado' ? t.finalizada : t.placeholder}
            rows={1}
            className="max-h-[96px] min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-small leading-normal text-foreground outline-none placeholder:text-subtle disabled:opacity-50"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 96) + 'px';
            }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim() || estado === 'completado'}
            aria-label={t.enviar}
            className="size-10 hover:translate-y-0"
          >
            <ArrowUp aria-hidden="true" />
          </Button>
        </div>
        {error && (
          <p className="mt-2 px-1 text-caption text-amber-ink" role="alert">{t.error}</p>
        )}
        <p className="mt-2 px-1 text-caption text-subtle">{t.ayuda}</p>
      </div>
    </div>
  );
}
