'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import {
  AlertCircle, RefreshCw, Plus, CheckCircle2, AlertTriangle,
  MessageSquare, Copy, Check, ChevronDown, ChevronUp,
} from 'lucide-react';
import DiagnosticoLoader from '@/components/chat/DiagnosticoLoader';
import IcebergVisualization from '@/components/resultado/IcebergVisualization';
import NivelBadge from '@/components/resultado/NivelBadge';
import DimensionBar from '@/components/resultado/DimensionBar';
import RecomendacionCard from '@/components/resultado/RecomendacionCard';
import { NIVELES } from '@/lib/matriz';
import type { DiagnosticoAPIResponse, DiagnosticoResult, AnalisisResult } from '@/lib/types';

type Estado = 'cargando' | 'listo' | 'error';

const LS_KEYS = {
  transcript: 'diagnostico-transcript',
  municipio:  'diagnostico-municipio',
  resultado:  'diagnostico-resultado',
  scores:     'diagnostico-scores',
} as const;

function limpiarStorage() {
  Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
}

// Wrapper con fade-in + slide-up al entrar en viewport
function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function ResultadoPage() {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>('cargando');
  const [resultado, setResultado] = useState<DiagnosticoResult | null>(null);
  const [scores, setScores] = useState<AnalisisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [mostrarTecnico, setMostrarTecnico] = useState(false);

  useEffect(() => {
    const transcript = localStorage.getItem(LS_KEYS.transcript);
    const municipio  = localStorage.getItem(LS_KEYS.municipio);

    if (!transcript || !municipio) {
      router.replace('/diagnostico');
      return;
    }

    const cachedResultado = localStorage.getItem(LS_KEYS.resultado);
    const cachedScores    = localStorage.getItem(LS_KEYS.scores);
    if (cachedResultado && cachedScores) {
      try {
        setResultado(JSON.parse(cachedResultado) as DiagnosticoResult);
        setScores(JSON.parse(cachedScores) as AnalisisResult);
        setEstado('listo');
        return;
      } catch { /* caché corrupto → llamar API */ }
    }

    fetchDiagnostico(transcript, municipio);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDiagnostico(transcript: string, municipio: string) {
    setEstado('cargando');
    setErrorMsg('');
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, municipio }),
      });
      const data = await res.json() as DiagnosticoAPIResponse & { error?: boolean; message?: string };
      if (!res.ok || data.error) throw new Error(data.message ?? `Error ${res.status}`);
      localStorage.setItem(LS_KEYS.resultado, JSON.stringify(data.resultado));
      localStorage.setItem(LS_KEYS.scores,    JSON.stringify(data.scores));
      setResultado(data.resultado);
      setScores(data.scores);
      setEstado('listo');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
      setEstado('error');
    }
  }

  function handleReintentar() {
    fetchDiagnostico(
      localStorage.getItem(LS_KEYS.transcript) ?? '',
      localStorage.getItem(LS_KEYS.municipio)  ?? ''
    );
  }

  function handleNuevoDiagnostico() {
    limpiarStorage();
    router.push('/diagnostico');
  }

  async function handleCopiar() {
    await navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  // ── Cargando ─────────────────────────────────────────────────────────────
  if (estado === 'cargando') return <DiagnosticoLoader />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (estado === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0F1E' }}>
        <div className="glassmorphism p-8 max-w-md w-full flex flex-col items-center gap-4 text-center">
          <AlertCircle className="text-amber w-10 h-10" />
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            Error al generar el diagnóstico
          </h2>
          <p className="text-sm text-muted">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button onClick={handleReintentar}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal text-[#0A0F1E] font-semibold rounded-xl hover:bg-teal/90 transition-colors text-sm">
              <RefreshCw size={15} /> Reintentar
            </button>
            <button onClick={handleNuevoDiagnostico}
              className="flex-1 py-2.5 border border-white/20 text-muted rounded-xl hover:text-foreground hover:border-white/40 transition-colors text-sm">
              Nuevo diagnóstico
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Listo ─────────────────────────────────────────────────────────────────
  if (!resultado) return null;

  const nivelColor = NIVELES[resultado.nivel_id].color;
  const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6" style={{ backgroundColor: '#0A0F1E' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-24">

        {/* ── SECCIÓN 1: Header ───────────────────────────────────────────── */}
        <FadeSection>
          <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <p className="text-xs text-subtle">
              Inicio <span className="mx-1">/</span> Diagnóstico <span className="mx-1">/</span> Resultado
            </p>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1
                  className="text-3xl sm:text-4xl font-bold text-foreground"
                  style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                  {resultado.municipio}
                </h1>
                <p className="text-sm text-muted">{fecha}</p>
              </div>
              <NivelBadge
                nivel_id={resultado.nivel_id}
                nivel_nombre={resultado.nivel_nombre}
                puntaje={resultado.puntaje_total}
              />
            </div>
          </div>
        </FadeSection>

        {/* ── SECCIÓN 2: Iceberg + Síntesis ───────────────────────────────── */}
        <FadeSection delay={0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8">
            {/* Columna izquierda: Iceberg */}
            <IcebergVisualization
              iceberg_id={resultado.iceberg_id}
              nivel_nombre={resultado.nivel_nombre}
              iceberg_texto_corto={resultado.iceberg_texto_corto}
              capas_activas={resultado.capas_activas}
            />

            {/* Columna derecha: cards apiladas */}
            <div className="flex flex-col gap-4">
              {/* Síntesis */}
              <div className="glassmorphism p-8 flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Síntesis</p>
                <p className="text-sm text-muted leading-relaxed">{resultado.resumen_territorio}</p>
              </div>

              {/* Fortalezas */}
              <div className="glassmorphism p-8 flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Fortalezas</p>
                <ul className="flex flex-col gap-4">
                  {resultado.fortalezas.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                      <CheckCircle2 size={15} className="text-teal shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brechas */}
              <div className="glassmorphism p-8 flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Brechas prioritarias</p>
                <ul className="flex flex-col gap-4">
                  {resultado.brechas.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                      <AlertTriangle size={15} className="text-amber shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* ── SECCIÓN 3: Dimensiones ──────────────────────────────────────── */}
        <FadeSection delay={0.05}>
          <div className="flex flex-col gap-6">
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              Resultado por dimensión
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resultado.dimensiones_resumen.map((d) => (
                <div key={d.id} className="glassmorphism p-6">
                  <DimensionBar
                    id={d.id}
                    nombre={d.nombre}
                    subtotal={d.subtotal}
                    maximo={d.maximo}
                    estado={d.estado}
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* ── SECCIÓN 4: Texto ampliado del iceberg ───────────────────────── */}
        <FadeSection delay={0.05}>
          <div
            className="p-6 rounded-xl border-l-4"
            style={{
              borderLeftColor: nivelColor,
              backgroundColor: nivelColor + '0D',
              border: `1px solid ${nivelColor}33`,
              borderLeft: `4px solid ${nivelColor}`,
            }}
          >
            <p className="text-base text-foreground leading-relaxed">
              {resultado.iceberg_texto_ampliado}
            </p>
          </div>
        </FadeSection>

        {/* ── SECCIÓN 5: Recomendaciones ──────────────────────────────────── */}
        <FadeSection delay={0.05}>
          <div className="flex flex-col gap-6">
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              Primeras acciones para tu territorio
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {resultado.recomendaciones.map((r, i) => (
                <RecomendacionCard
                  key={i}
                  dimension={r.dimension}
                  area={r.area}
                  accion={r.accion}
                  urgencia={r.urgencia}
                />
              ))}
            </div>
          </div>
        </FadeSection>

        {/* ── SECCIÓN 6: Mensaje final ─────────────────────────────────────── */}
        <FadeSection delay={0.05}>
          <div
            className="p-6 rounded-xl border flex flex-col gap-4"
            style={{
              background: 'linear-gradient(135deg, #2DD4BF10, #60A5FA10)',
              borderColor: '#2DD4BF33',
            }}
          >
            <MessageSquare className="text-teal w-6 h-6" />
            <p className="text-base text-foreground leading-relaxed">{resultado.mensaje_final}</p>
          </div>
        </FadeSection>

        {/* ── BOTONES FINALES ──────────────────────────────────────────────── */}
        <FadeSection delay={0.05}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleNuevoDiagnostico}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-muted rounded-xl hover:text-foreground hover:border-white/40 transition-colors text-sm"
              >
                <Plus size={15} /> Nuevo diagnóstico
              </button>

              <button
                onClick={handleCopiar}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-muted rounded-xl hover:text-foreground hover:border-white/40 transition-colors text-sm"
              >
                {copiado ? <Check size={15} className="text-teal" /> : <Copy size={15} />}
                {copiado ? '¡Copiado!' : 'Copiar enlace'}
              </button>

              <button
                onClick={() => setMostrarTecnico((v) => !v)}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-muted rounded-xl hover:text-foreground hover:border-white/40 transition-colors text-sm"
              >
                {mostrarTecnico ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                Ver datos técnicos
              </button>
            </div>

            {/* JSON técnico del Agente 2 */}
            {mostrarTecnico && scores && (
              <div className="glassmorphism p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-3">
                  Evaluación técnica — Agente 2 (AnalisisResult)
                </p>
                <pre
                  className="text-xs text-muted overflow-auto max-h-96 leading-relaxed"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {JSON.stringify(scores, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </FadeSection>

      </div>
    </div>
  );
}
