'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

type Estado = 'activo' | 'completado';

interface Props {
  onUserMessageCount?: (count: number) => void;
}

export default function ChatInterface({ onUserMessageCount }: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const [estado, setEstado] = useState<Estado>('activo');

  const { messages, input, setInput, handleInputChange, append, isLoading } =
    useChat({ api: '/api/chat' });

  // Reportar conteo de mensajes del usuario al padre
  useEffect(() => {
    const count = messages.filter((m) => m.role === 'user').length;
    onUserMessageCount?.(count);
  }, [messages, onUserMessageCount]);

  // Al montar: enviar municipio-inicial si existe
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const municipioInicial = localStorage.getItem('municipio-inicial');
    if (municipioInicial && messages.length === 0) {
      localStorage.removeItem('municipio-inicial');
      append({ role: 'user', content: municipioInicial });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll automático al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Detectar fin de entrevista
  useEffect(() => {
    if (estado === 'completado' || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant') return;
    if (!lastMsg.content.includes('[ENTREVISTA_COMPLETA]')) return;

    const transcript = messages
      .map((m) => {
        const label = m.role === 'user' ? 'FUNCIONARIO' : 'ENTREVISTADOR';
        return label + ':\n' + m.content.replace('[ENTREVISTA_COMPLETA]', '').trim();
      })
      .join('\n\n---\n\n');

    const primerMensaje = messages[0].content;

    localStorage.setItem('diagnostico-transcript', transcript);
    localStorage.setItem('diagnostico-municipio', primerMensaje);
    setEstado('completado');
  }, [messages, estado]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;
    append({ role: 'user', content: text });
    setInput('');
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] max-h-[800px]">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

        {/* Bienvenida — solo cuando no hay mensajes */}
        {messages.length === 0 && !isLoading && (
          <div
            className="rounded-xl border p-6 flex flex-col gap-4"
            style={{ backgroundColor: '#0A0F1E', borderColor: '#1E2A45' }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-teal shrink-0" />
              <p
                className="text-base font-semibold text-foreground"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                Comenzando el diagnóstico
              </p>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Un investigador especializado te hará preguntas sobre tu municipio.
              Responde con la mayor honestidad posible — no hay respuestas correctas ni incorrectas.
            </p>

            <ul className="flex flex-col gap-2">
              {[
                'La conversación toma entre 10 y 15 minutos',
                'Puedes tomarte el tiempo que necesites para cada respuesta',
                'Mientras más específico, mejor el diagnóstico',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <CheckCircle2 size={14} className="text-teal shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs text-subtle">
              Escribe tu municipio o rol para comenzar
            </p>
          </div>
        )}

        {/* Mensajes */}
        {messages.map((msg) => {
          const text = msg.content
            .replace('[ENTREVISTA_COMPLETA]', '')
            .trim();
          if (!text) return null;

          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-teal/20 border border-teal/30 text-foreground'
                    : 'border text-foreground'
                }`}
                style={
                  isUser
                    ? {}
                    : { backgroundColor: '#0F1629', borderColor: '#1E2A45' }
                }
              >
                {text}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="rounded-xl px-4 py-3 border"
              style={{ backgroundColor: '#0F1629', borderColor: '#1E2A45' }}
            >
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: '#1E2A45', backgroundColor: '#0A0F1E' }}
      >
        <div
          className="flex gap-2 items-end rounded-xl border p-2"
          style={{ backgroundColor: '#0F1629', borderColor: '#1E2A45' }}
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || estado === 'completado'}
            placeholder={
              estado === 'completado'
                ? 'Entrevista finalizada'
                : 'Escribe tu respuesta...'
            }
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-subtle outline-none min-h-[36px] max-h-[84px] py-1.5 px-1 disabled:opacity-50"
            style={{ lineHeight: '1.5' }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 84) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || estado === 'completado'}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-teal text-[#0A0F1E] hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-xs text-subtle mt-1.5 px-1">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>

      {/* Overlay de completado */}
      {estado === 'completado' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="glassmorphism p-8 flex flex-col items-center gap-4 text-center max-w-sm mx-4">
            <CheckCircle2 className="text-teal w-12 h-12" />
            <h3
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              Entrevista completada
            </h3>
            <p className="text-sm text-muted">
              El sistema ahora analizará tu territorio
            </p>
            <button
              onClick={() => router.push('/resultado')}
              className="w-full py-3 bg-teal text-[#0A0F1E] font-semibold rounded-xl hover:bg-teal/90 transition-colors text-sm"
            >
              Ver mi diagnóstico →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
