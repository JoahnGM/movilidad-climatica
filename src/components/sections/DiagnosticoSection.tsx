'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, ChevronDown, ChevronUp, Copy, Plus, RefreshCw } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import DiagnosticoLoader from '@/components/chat/DiagnosticoLoader';
import AccesoPiloto from '@/components/diagnostico/AccesoPiloto';
import ProgresoDiagnostico, { type FaseDiagnostico } from '@/components/diagnostico/ProgresoDiagnostico';
import { CLAVE_MUNICIPIO_INICIAL, EVENTO_INICIAR } from '@/components/diagnostico/eventos';
import ResultadoDiagnostico from '@/components/resultado/ResultadoDiagnostico';
import { Button, Card, EmptyState, Reveal, Section, SectionHeader } from '@/components/ds';
import type { AnalisisResult, DiagnosticoAPIResponse, DiagnosticoResult } from '@/lib/types';

const LS_KEYS = {
  transcript: 'diagnostico-transcript',
  municipio:  'diagnostico-municipio',
  resultado:  'diagnostico-resultado',
  scores:     'diagnostico-scores',
} as const;

function limpiarStorage() {
  Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
}

/** Mensaje para cada error del pipeline (la API no expone detalles internos). */
function mensajeError(status: number, message?: string): string {
  if (message) return message;
  if (status === 429) return 'Hiciste varias solicitudes seguidas. Espera un momento e inténtalo de nuevo.';
  if (status === 504) return 'El análisis tardó más de lo esperado. Inténtalo de nuevo.';
  if (status === 503) return 'El diagnóstico no está disponible en este momento.';
  return `Error ${status}`;
}

interface Props {
  /** Piloto cerrado sin cookie de acceso válida: pide el código antes del chat. */
  requiereCodigo: boolean;
}

/**
 * El diagnóstico completo dentro de la landing: acceso (si aplica) → entrevista → análisis → resultado.
 * Persistencia según CLAUDE.md §10: al volver, retoma el resultado o el análisis pendiente.
 */
export default function DiagnosticoSection({ requiereCodigo }: Props) {
  const [fase, setFase] = useState<FaseDiagnostico>(requiereCodigo ? 'acceso' : 'chat');
  const [mensajes, setMensajes] = useState(0);
  const [pasoAnalisis, setPasoAnalisis] = useState(0);
  const [resultado, setResultado] = useState<DiagnosticoResult | null>(null);
  const [scores, setScores] = useState<AnalisisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [chatKey, setChatKey] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const [mostrarTecnico, setMostrarTecnico] = useState(false);
  const inicioRef = useRef<HTMLDivElement>(null);

  const irAlInicio = () => inicioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const analizar = useCallback(async () => {
    const transcript = localStorage.getItem(LS_KEYS.transcript) ?? '';
    const municipio = localStorage.getItem(LS_KEYS.municipio) ?? '';
    setFase('analizando');
    setPasoAnalisis(0);
    setErrorMsg('');
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, municipio }),
      });
      if (res.status === 401) {
        setFase('acceso');
        return;
      }
      const data = (await res.json().catch(() => ({}))) as Partial<DiagnosticoAPIResponse> & { error?: boolean; message?: string };
      if (!res.ok || data.error || !data.resultado || !data.scores) throw new Error(mensajeError(res.status, data.message));
      localStorage.setItem(LS_KEYS.resultado, JSON.stringify(data.resultado));
      localStorage.setItem(LS_KEYS.scores, JSON.stringify(data.scores));
      setResultado(data.resultado);
      setScores(data.scores);
      setFase('resultado');
      irAlInicio();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
      setFase('error');
    }
  }, []);

  // Al cargar: retomar un resultado guardado o un análisis pendiente
  useEffect(() => {
    const r = localStorage.getItem(LS_KEYS.resultado);
    const s = localStorage.getItem(LS_KEYS.scores);
    if (r && s) {
      try {
        setResultado(JSON.parse(r) as DiagnosticoResult);
        setScores(JSON.parse(s) as AnalisisResult);
        setFase('resultado');
        return;
      } catch { /* caché corrupto → volver a analizar si hay transcripción */ }
    }
    if (localStorage.getItem(LS_KEYS.transcript) && localStorage.getItem(LS_KEYS.municipio) && !requiereCodigo) {
      analizar();
    }
  }, [analizar, requiereCodigo]);

  function nuevoDiagnostico() {
    limpiarStorage();
    setResultado(null);
    setScores(null);
    setMensajes(0);
    setMostrarTecnico(false);
    setChatKey((k) => k + 1);
    setFase(requiereCodigo ? 'acceso' : 'chat');
    irAlInicio();
  }

  // Inicio desde el campo del hero: el chat toma el municipio como primer mensaje al montarse.
  useEffect(() => {
    function alIniciar() {
      if (fase === 'resultado' || fase === 'error') {
        nuevoDiagnostico();
      } else if (fase === 'chat' && mensajes === 0) {
        setChatKey((k) => k + 1); // remonta el chat para que envíe el municipio guardado
      } else if (fase === 'chat' || fase === 'analizando') {
        localStorage.removeItem(CLAVE_MUNICIPIO_INICIAL); // no interrumpir una conversación en curso
      }
      // fase 'acceso': el municipio queda guardado y se envía al entrar al chat
    }
    window.addEventListener(EVENTO_INICIAR, alIniciar);
    return () => window.removeEventListener(EVENTO_INICIAR, alIniciar);
  });

  async function copiar() {
    await navigator.clipboard.writeText(`${window.location.origin}/#diagnostico`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Section id="diagnostico" background="alt" border aria-labelledby="diagnostico-titulo">
      <div ref={inicioRef} className="scroll-mt-24">
        <SectionHeader
          eyebrow="Diagnóstico"
          title={<span id="diagnostico-titulo">{fase === 'resultado' ? 'Tu diagnóstico' : 'Comienza la conversación'}</span>}
          lead={
            fase === 'resultado'
              ? 'Tu nivel, tus brechas y una ruta para empezar. Se guarda solo en este navegador.'
              : 'Responde desde tu experiencia. Al terminar, el resultado aparece aquí mismo.'
          }
        />
      </div>

      {fase === 'resultado' && resultado ? (
        <ResultadoDiagnostico
          resultado={resultado}
          scores={scores}
          fecha={fecha}
          idBase="diagnostico"
          acciones={
            <>
              <Button variant="secondary" onClick={nuevoDiagnostico}><Plus aria-hidden="true" /> Nuevo diagnóstico</Button>
              <Button variant="secondary" onClick={copiar}>
                {copiado ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                {copiado ? '¡Copiado!' : 'Copiar enlace'}
              </Button>
              <Button variant="ghost" onClick={() => setMostrarTecnico((v) => !v)} aria-expanded={mostrarTecnico}>
                {mostrarTecnico ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                Ver datos técnicos
              </Button>
              {mostrarTecnico && scores && (
                <Card variant="flat" padding="sm" className="w-full">
                  <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">Evaluación técnica — Agente 2 (AnalisisResult)</p>
                  <pre className="max-h-96 overflow-auto font-mono text-caption leading-relaxed text-muted">{JSON.stringify(scores, null, 2)}</pre>
                </Card>
              )}
            </>
          }
        />
      ) : (
        <Reveal className="grid items-start gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-24">
            <ProgresoDiagnostico fase={fase} mensajes={mensajes} pasoAnalisis={pasoAnalisis} />
          </aside>
          <div className="min-w-0">
            {fase === 'acceso' && <AccesoPiloto onAcceso={() => setFase('chat')} />}
            {fase === 'chat' && (
              <ChatInterface
                key={chatKey}
                onUserMessageCount={setMensajes}
                onCompletado={analizar}
                onRequiereAcceso={() => setFase('acceso')}
              />
            )}
            {fase === 'analizando' && <DiagnosticoLoader onPaso={setPasoAnalisis} />}
            {fase === 'error' && (
              <EmptyState
                icon={AlertCircle}
                title="Error al generar el diagnóstico"
                description={errorMsg}
                headingLevel="h3"
                className="min-h-[480px] max-w-none justify-center"
                actions={
                  <>
                    <Button onClick={analizar}><RefreshCw aria-hidden="true" /> Reintentar</Button>
                    <Button variant="secondary" onClick={nuevoDiagnostico}>Nuevo diagnóstico</Button>
                  </>
                }
              />
            )}
          </div>
        </Reveal>
      )}
    </Section>
  );
}
