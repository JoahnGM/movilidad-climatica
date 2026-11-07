'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, BrainCircuit, CheckCircle2, FileSearch, FlaskConical,
  Lock, MessageSquare, Quote, Route, ShieldCheck, Sparkles,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { Direccion } from './direcciones';
import { FondoMontanas } from './FondoMontanas';
import { TituloIA, type TramoTitulo } from './TituloIA';

/* ── Estilos base de la exploración (dependen solo de las variables de la dirección) ── */
const CSS = `
.x-root { background: var(--bg); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
.x-display { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--display-tracking); line-height: 1.02; text-wrap: balance; }
.x-h2 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: calc(var(--display-tracking) * 0.85); line-height: 1.06; text-wrap: balance; }
.x-h3 { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.015em; line-height: 1.25; }
.x-mono { font-family: var(--font-mono); font-feature-settings: "tnum"; }
.x-serif { font-family: var(--font-instrument-serif); font-style: italic; font-weight: 400; letter-spacing: -0.01em; }
.x-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-card); }
.x-card-raised { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-card); box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 12px 32px -12px rgb(0 0 0 / 0.12); }
.x-btn { display: inline-flex; align-items: center; gap: .5rem; height: 3rem; padding: 0 1.4rem; border-radius: var(--radius-btn); font-weight: 500; font-size: 1rem; transition: transform .15s, background .15s, opacity .15s; }
.x-btn:hover { transform: translateY(-1px); }
.x-btn-primary { background: var(--cta-bg); color: var(--cta-ink); }
.x-btn-secondary { background: var(--bg); color: var(--ink); border: 1px solid var(--line); }
.x-btn-secondary:hover { background: var(--surface); }
.x-eyebrow { font-family: var(--font-mono); font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
.x-link { color: var(--ink-2); transition: color .15s; } .x-link:hover { color: var(--ink); }
.x-chip { display: inline-flex; align-items: center; gap: .375rem; border-radius: 999px; padding: .25rem .65rem; font-size: .75rem; font-weight: 500; background: var(--accent-soft); color: var(--accent); }
@keyframes x-pulse { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(2.2); opacity: 0 } }
.x-pulse::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--accent); animation: x-pulse 2s ease-out infinite; }
@media (prefers-reduced-motion: reduce) { .x-pulse::before { animation: none } .x-btn:hover { transform: none } }
`;

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const DIMENSIONES = [
  { n: 'Reconocimiento', v: 5 },
  { n: 'Instrumentos', v: 4 },
  { n: 'Capacidad institucional', v: 3 },
  { n: 'Información y datos', v: 3 },
  { n: 'Respuestas', v: 3 },
  { n: 'Equidad y justicia', v: 1 },
];

const NAV = ['Contexto', 'Ciudades', 'Recomendaciones', 'Metodología'];

/* ── Motivos decorativos ──────────────────────────────────────────────── */

function contorno(cx: number, cy: number, r: number, k: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const rr = r * (1 + 0.09 * Math.sin(3 * t + k) + 0.05 * Math.sin(5 * t + 2 * k) + 0.03 * Math.cos(7 * t + k));
    pts.push(`${(cx + rr * Math.cos(t)).toFixed(1)},${(cy + rr * 0.72 * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function Topografia({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" className={className} fill="none">
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={contorno(560, 260, 40 + i * 26, i * 0.35)} stroke="var(--ink)" strokeOpacity={0.07 + (i % 4 === 0 ? 0.05 : 0)} strokeWidth={1} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={`b${i}`} d={contorno(120, 520, 30 + i * 24, 1.7 + i * 0.4)} stroke="var(--ink)" strokeOpacity={0.06} strokeWidth={1} />
      ))}
    </svg>
  );
}

function Fondo({ motivo }: { motivo: Direccion['motivo'] }) {
  if (motivo === 'aurora') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full blur-3xl" style={{ background: 'var(--glow-1)' }} />
        <div className="absolute -top-20 right-[18%] h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ background: 'var(--glow-2)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
      </div>
    );
  }
  if (motivo === 'organico') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[34rem] w-[46rem] rounded-[45%_55%_60%_40%/55%_45%_55%_45%] blur-2xl" style={{ background: 'var(--glow-1)' }} />
        <div className="absolute top-40 right-[30%] h-64 w-64 rounded-full blur-3xl" style={{ background: 'var(--glow-2)' }} />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 60% 30%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 60% 30%, black, transparent)',
          opacity: 0.6,
        }}
      />
      <Topografia className="absolute -right-20 -top-10 h-[46rem] w-auto" />
    </div>
  );
}

/* ── Piezas de producto (la interfaz como ilustración) ─────────────────── */

function NivelMini({ activo }: { activo: number }) {
  return (
    <div className="flex flex-col gap-1">
      {[1, 2, 3, 4].map((c) => (
        <div key={c} className="flex items-center gap-2">
          <span className="x-mono w-12 text-[10px] text-(--ink-3)">Capa {c}</span>
          <span
            className="h-2 flex-1 rounded-full"
            style={{ background: c <= activo ? 'var(--lvl-2)' : 'var(--surface-2)', opacity: c <= activo ? 1 - (c - 1) * 0.25 : 1 }}
          />
        </div>
      ))}
    </div>
  );
}

function ResultadoMock({ compacto = false }: { compacto?: boolean }) {
  return (
    <div className="x-card-raised flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="x-eyebrow">Resultado del diagnóstico</span>
          <span className="x-h3 text-lg">Municipio de Ejemplo</span>
          <span className="text-xs text-(--ink-3)">Datos ficticios · 6 nov 2026</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="x-mono text-3xl font-medium leading-none">19<span className="text-base text-(--ink-3)">/54</span></span>
          <span className="mt-2 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: 'color-mix(in srgb, var(--lvl-2) 16%, transparent)', color: 'color-mix(in srgb, var(--lvl-2) 70%, var(--ink))' }}>
            Nivel 2 · Reconocimiento parcial
          </span>
        </div>
      </div>
      {!compacto && <NivelMini activo={2} />}
      <div className="flex flex-col gap-2.5">
        {DIMENSIONES.slice(0, compacto ? 3 : 6).map((d) => (
          <div key={d.n} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-xs text-(--ink-2)">{d.n}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--surface-2)">
              <span className="block h-full rounded-full" style={{ width: `${(d.v / 9) * 100}%`, background: d.v <= 1 ? 'var(--lvl-1)' : 'var(--accent)' }} />
            </span>
            <span className="x-mono w-8 text-right text-xs text-(--ink-3)">{d.v}/9</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMock() {
  return (
    <div className="x-card-raised flex w-full max-w-sm flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-(--accent-soft) text-(--accent)"><Sparkles className="size-3.5" /></span>
        <span className="text-xs font-medium">Asistente de diagnóstico</span>
        <span className="x-chip ml-auto !py-0.5 !text-[10px]">IA · piloto</span>
      </div>
      <p className="rounded-2xl rounded-tl-sm bg-(--surface) px-3 py-2 text-[13px] leading-snug text-(--ink-2)">
        ¿Qué instrumentos de planeación de tu municipio incorporan hoy el riesgo de inundación?
      </p>
      <p className="ml-8 rounded-2xl rounded-tr-sm px-3 py-2 text-[13px] leading-snug" style={{ background: 'var(--cta-bg)', color: 'var(--cta-ink)' }}>
        El PMGRD de 2021 identifica las zonas inundables de la ribera…
      </p>
    </div>
  );
}

function EvidenciaMock() {
  return (
    <div className="x-card-raised flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="x-mono text-xs text-(--ink-3)">P4 · Instrumentos</span>
        <span className="x-mono rounded-md bg-(--accent-soft) px-2 py-0.5 text-xs text-(--accent)">2 / 3</span>
      </div>
      <p className="flex gap-2 text-[13px] leading-snug text-(--ink-2)">
        <Quote className="mt-0.5 size-3.5 shrink-0 text-(--accent)" />
        “El PMGRD de 2021 identifica las zonas inundables de la ribera.”
      </p>
      <span className="text-[11px] text-(--ink-3)">Puntaje basado solo en lo que dijiste</span>
    </div>
  );
}

/* ── Secciones ────────────────────────────────────────────────────────── */

function Contenedor({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

function Nav({ d }: { d: Direccion }) {
  return (
    <header className="sticky top-0 z-10 border-b border-(--line) backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}>
      <Contenedor className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/explorar/${d.id}`} className="flex items-center gap-2">
            <Logo d={d} />
          </Link>
          <span className="x-chip hidden sm:inline-flex"><FlaskConical className="size-3" />Piloto experimental</span>
        </div>
        <nav aria-label="Principal" className="hidden items-center gap-7 text-[15px] md:flex">
          {NAV.map((n) => <a key={n} href="#" className="x-link">{n}</a>)}
        </nav>
        <a href="#" className="x-btn x-btn-primary !hidden !h-10 !px-4 text-[15px] sm:!inline-flex">Iniciar diagnóstico</a>
      </Contenedor>
    </header>
  );
}

function Logo({ d }: { d: Direccion }) {
  return (
    <>
      <svg aria-hidden="true" viewBox="0 0 28 28" className="size-7">
        {d.motivo === 'cordillera' ? (
          <>
            <circle cx="14" cy="14" r="13" fill="var(--ink)" />
            <path d="M5 19l5.5-7 3 3.5L18 9l5 10z" fill="var(--bg)" />
            <circle cx="20" cy="7.5" r="1.6" fill="var(--glow-2)" />
          </>
        ) : d.motivo === 'topografico' ? (
          <>
            <rect x="1" y="1" width="26" height="26" rx="6" fill="var(--ink)" />
            <path d="M6 18c3-5 6-5 8-2s5 3 8-3" stroke="var(--bg)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M6 13c3-5 6-5 8-2s5 3 8-3" stroke="var(--bg)" strokeOpacity=".5" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : d.motivo === 'organico' ? (
          <>
            <circle cx="14" cy="14" r="13" fill="var(--accent)" />
            <path d="M8 17c2.5-4 5-6 6-6s2 3 6 3" stroke="var(--accent-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="19" cy="9" r="2" fill="var(--glow-2)" />
          </>
        ) : (
          <>
            <rect x="1" y="1" width="26" height="26" rx="8" fill="var(--ink)" />
            <path d="M7 16h5l3-6 3 9 2-3h2" stroke="var(--bg)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <span className="x-h3 whitespace-nowrap text-[17px] tracking-tight">
        Movilidad Climática <span className="text-(--ink-3)">CO</span>
      </span>
    </>
  );
}

const TRAMOS_TITULO: TramoTitulo[] = [
  { escribe: 'Diag', fantasma: 'nostica tu territorio. ' },
  { escribe: 'Act', fantasma: 'úa con datos.', className: 'x-serif text-(--accent)' },
];

function HeroCordillera() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden">
        <FondoMontanas
          color="#16352E"
          intensidad={0.7} desfase={23}
          className="absolute inset-x-0 top-0 h-[70%] w-full [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_62%,transparent_96%)] md:h-[74%]"
        />
        <Contenedor className="relative mt-auto flex flex-col items-start gap-6 pt-[46svh] pb-14 md:pb-16">
          <TituloIA
            tramos={TRAMOS_TITULO}
            className="x-display max-w-3xl text-[2.5rem] sm:text-6xl lg:text-[4.5rem]"
            claseFantasma="opacity-30"
          />
          <motion.p {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="max-w-xl text-lg leading-relaxed text-(--ink-2)">
            Una conversación guiada por IA construye una línea base de la preparación institucional de tu municipio frente a la movilidad climática.
          </motion.p>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.2 }} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="#" className="x-btn x-btn-primary justify-center">Iniciar diagnóstico <ArrowRight className="size-4" /></a>
            <a href="#" className="x-btn x-btn-secondary justify-center">Ver ejemplo de resultado</a>
          </motion.div>
        </Contenedor>
      </section>
      <section className="pb-8">
        <Contenedor className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <motion.div {...fade} className="flex flex-col gap-4">
            <span className="x-eyebrow">El resultado</span>
            <h2 className="x-h2 text-3xl sm:text-4xl">Tu nivel, tus brechas y por dónde empezar.</h2>
            <p className="max-w-md text-[15px] leading-relaxed text-(--ink-2)">Gratuito · Sin registro · Resultados inmediatos</p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="relative">
            <ResultadoMock />
            <div className="absolute -top-14 -right-4 hidden w-72 md:block xl:-right-16"><ChatMock /></div>
          </motion.div>
        </Contenedor>
      </section>
    </>
  );
}

function Hero({ d }: { d: Direccion }) {
  if (d.motivo === 'cordillera') return <HeroCordillera />;
  return (
    <section className="relative overflow-hidden">
      <Fondo motivo={d.motivo} />
      <Contenedor className="relative grid items-center gap-14 pt-16 pb-20 md:pt-24 md:pb-28 lg:grid-cols-[1.1fr_1fr]">
        <motion.div {...fade} className="flex flex-col items-start gap-7">
          <span className="x-eyebrow">Movilidad climática · Colombia</span>
          <h1 className="x-display text-[2.75rem] sm:text-6xl lg:text-[4.25rem]">
            Diagnostica tu territorio.{' '}
            {d.acentoSerif ? (
              <span className="x-serif text-(--accent)">Actúa con datos.</span>
            ) : (
              <span className="text-(--ink-3)">Actúa con datos.</span>
            )}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-(--ink-2) sm:text-xl">
            Una conversación guiada por IA construye una línea base de la preparación institucional de tu municipio frente a la movilidad climática.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="x-btn x-btn-primary">Iniciar diagnóstico <ArrowRight className="size-4" /></a>
            <a href="#" className="x-btn x-btn-secondary">Ver ejemplo de resultado</a>
          </div>
          <p className="x-mono text-xs text-(--ink-3)">Gratuito · Sin registro · Resultados inmediatos</p>
        </motion.div>
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }} className="relative sm:pb-40">
          <ResultadoMock />
          <div className="absolute bottom-0 -left-6 hidden w-72 sm:block lg:-left-14">
            <ChatMock />
          </div>
        </motion.div>
      </Contenedor>
    </section>
  );
}

function Marcos() {
  const items = ['Agenda de Protección Nansen', 'UNDRR Scorecard', 'Ley 1523 de 2012', 'Sentencia T-123 de 2024', 'Hoja de ruta Minambiente–PNUD'];
  return (
    <section className="border-y border-(--line)">
      <Contenedor className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-center md:gap-10">
        <span className="x-eyebrow shrink-0">Marco de referencia</span>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-(--ink-2)">
          {items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </Contenedor>
    </section>
  );
}

function Encabezado({ eyebrow, titulo, lead, centro = false }: { eyebrow: string; titulo: ReactNode; lead?: string; centro?: boolean }) {
  return (
    <motion.div {...fade} className={`flex max-w-2xl flex-col gap-5 ${centro ? 'mx-auto items-center text-center' : ''}`}>
      <span className="x-eyebrow">{eyebrow}</span>
      <h2 className="x-h2 text-4xl sm:text-5xl">{titulo}</h2>
      {lead && <p className="text-lg leading-relaxed text-(--ink-2)">{lead}</p>}
    </motion.div>
  );
}

function Features({ d }: { d: Direccion }) {
  return (
    <section className="py-24 md:py-32">
      <Contenedor className="flex flex-col gap-14">
        <Encabezado
          eyebrow="Por qué funciona"
          titulo={d.acentoSerif ? <>No un cuestionario. <span className="x-serif text-(--accent)">Una conversación.</span></> : 'No un cuestionario. Una conversación.'}
          lead="El diagnóstico se construye a través del diálogo y se evalúa solo con lo que el funcionario describe."
        />
        <div className="grid gap-4 md:grid-cols-6">
          <motion.article {...fade} className="x-card flex flex-col gap-6 overflow-hidden p-6 md:col-span-4 md:p-8">
            <div className="flex flex-col gap-2">
              <MessageSquare className="size-5 text-(--accent)" />
              <h3 className="x-h3 text-xl">Entrevista conversacional</h3>
              <p className="max-w-md text-[15px] leading-relaxed text-(--ink-2)">Una IA explora las 6 dimensiones con preguntas abiertas, como lo haría un investigador.</p>
            </div>
            <div className="flex justify-end"><ChatMock /></div>
          </motion.article>
          <motion.article {...fade} transition={{ ...fade.transition, delay: 0.08 }} className="x-card flex flex-col gap-6 p-6 md:col-span-2 md:p-8">
            <div className="flex flex-col gap-2">
              <ShieldCheck className="size-5 text-(--accent)" />
              <h3 className="x-h3 text-xl">Solo evidencia explícita</h3>
              <p className="text-[15px] leading-relaxed text-(--ink-2)">Lo no mencionado puntúa 0. Cada puntaje cita lo que dijiste.</p>
            </div>
            <EvidenciaMock />
          </motion.article>
          <motion.article {...fade} transition={{ ...fade.transition, delay: 0.12 }} className="x-card flex flex-col gap-3 p-6 md:col-span-3 md:p-8">
            <Route className="size-5 text-(--accent)" />
            <h3 className="x-h3 text-xl">Recomendaciones progresivas</h3>
            <p className="text-[15px] leading-relaxed text-(--ink-2)">Primer paso sin costo, siguiente paso y ruta ampliada, según la capacidad real de tu municipio.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Primer paso · ≤6 meses', 'Siguiente paso · 6–18 meses', 'Ruta ampliada'].map((t, i) => (
                <span key={t} className="x-mono rounded-full border border-(--line) px-3 py-1 text-xs" style={{ color: i === 0 ? 'var(--accent)' : 'var(--ink-2)' }}>{t}</span>
              ))}
            </div>
          </motion.article>
          <motion.article {...fade} transition={{ ...fade.transition, delay: 0.16 }} className="x-card flex flex-col gap-3 p-6 md:col-span-3 md:p-8">
            <Lock className="size-5 text-(--accent)" />
            <h3 className="x-h3 text-xl">Tus datos se quedan contigo</h3>
            <p className="text-[15px] leading-relaxed text-(--ink-2)">Sin registro. El resultado se guarda solo en tu navegador. No escribas datos personales de terceros.</p>
            <a href="#" className="x-link mt-3 inline-flex items-center gap-1 text-sm font-medium">Ver política de datos <ArrowUpRight className="size-3.5" /></a>
          </motion.article>
        </div>
      </Contenedor>
    </section>
  );
}

const PASOS = [
  { icon: MessageSquare, t: 'Describes tu territorio', p: 'Conversas con un agente de IA que te hace preguntas específicas sobre tu municipio, sin formularios ni escalas.', mock: 'chat' },
  { icon: BrainCircuit, t: 'El sistema analiza', p: 'Dos agentes evalúan la entrevista y calculan tu nivel de preparación institucional en 6 dimensiones.', mock: 'analisis' },
  { icon: FileSearch, t: 'Recibes tu diagnóstico', p: 'Un resultado visual con tu nivel, fortalezas, brechas y recomendaciones adaptadas a tu municipio.', mock: 'resultado' },
] as const;

function AnalisisMock() {
  return (
    <div className="x-card-raised flex flex-col gap-2 p-4">
      {DIMENSIONES.map((d, i) => (
        <div key={d.n} className="flex items-center gap-3 text-[13px]">
          <CheckCircle2 className="size-4 shrink-0" style={{ color: i < 4 ? 'var(--accent)' : 'var(--line)' }} />
          <span className={i < 4 ? 'text-(--ink-2)' : 'text-(--ink-3)'}>{d.n}</span>
          <span className="x-mono ml-auto text-xs text-(--ink-3)">{i < 4 ? 'evaluada' : i === 4 ? 'evaluando…' : 'en cola'}</span>
        </div>
      ))}
    </div>
  );
}

function ComoFunciona() {
  return (
    <section className="bg-(--surface) py-24 md:py-32">
      <Contenedor className="flex flex-col gap-16">
        <Encabezado centro eyebrow="Cómo funciona" titulo="Tres pasos, unos 20 minutos" lead="De la conversación a una línea base orientativa que puedes revisar con tu equipo." />
        <ol className="relative mx-auto flex w-full max-w-3xl flex-col gap-14">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-5 w-px bg-(--line) md:left-1/2" />
          {PASOS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li key={s.t} {...fade} className="relative flex flex-col gap-6 pl-16 md:pl-0">
                <span className="absolute top-0 left-0 z-[1] flex size-10 items-center justify-center rounded-full md:left-1/2 md:-translate-x-1/2" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                  <span className="x-pulse absolute inset-0 rounded-full" />
                  <Icon className="relative size-4.5" />
                </span>
                <div className="x-card-raised flex flex-col gap-5 p-6 md:mt-16 md:p-8">
                  <div className="flex flex-col gap-2">
                    <span className="x-mono text-xs text-(--ink-3)">Paso {String(i + 1).padStart(2, '0')}</span>
                    <h3 className="x-h3 text-2xl">{s.t}</h3>
                    <p className="text-[15px] leading-relaxed text-(--ink-2)">{s.p}</p>
                  </div>
                  <div className="rounded-[calc(var(--radius-card)-6px)] bg-(--surface) p-4 sm:p-6">
                    {s.mock === 'chat' && <ChatMock />}
                    {s.mock === 'analisis' && <AnalisisMock />}
                    {s.mock === 'resultado' && <ResultadoMock compacto />}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </Contenedor>
    </section>
  );
}

function Cifras() {
  const cifras = [
    { v: '91.000', d: 'desplazamientos por desastres en Colombia en 2024', f: 'IDMC, GRID 2025' },
    { v: '88.000', d: 'desplazamientos por desastres en 2025, ≈78.000 por inundaciones', f: 'IDMC, GRID 2026' },
    { v: '351.000', d: 'desplazamientos por desastres en 2023', f: 'IDMC, GRID 2024' },
  ];
  return (
    <section className="py-24 md:py-32">
      <Contenedor className="flex flex-col gap-14">
        <Encabezado eyebrow="La evidencia" titulo="La crisis climática ya está moviendo a Colombia" />
        <div className="grid border-t border-(--line) md:grid-cols-3">
          {cifras.map((c, i) => (
            <motion.figure key={c.v} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className={`flex flex-col gap-3 py-8 md:px-8 ${i > 0 ? 'border-t border-(--line) md:border-t-0 md:border-l' : 'md:pl-0'}`}>
              <span className="x-mono text-5xl font-medium tracking-tight sm:text-6xl">{c.v}</span>
              <figcaption className="flex flex-col gap-3">
                <span className="text-[15px] leading-relaxed text-(--ink-2)">{c.d}</span>
                <span className="x-mono text-xs text-(--ink-3)">Fuente: <a href="#" className="underline underline-offset-2">{c.f}</a></span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}

function CTA({ d }: { d: Direccion }) {
  return (
    <section className="pb-24 md:pb-32">
      <Contenedor>
        <motion.div {...fade} className="relative overflow-hidden rounded-[var(--radius-card)] px-6 py-16 text-center sm:px-12 md:py-24" style={{ background: 'var(--cta-bg)', color: 'var(--cta-ink)' }}>
          {d.motivo === 'topografico' && <Topografia className="absolute -right-10 -top-10 h-[140%] w-auto opacity-60 [&_path]:stroke-white [&_path]:[stroke-opacity:0.25]" />}
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="x-h2 text-4xl sm:text-5xl">
              {d.acentoSerif ? <>Conoce dónde está tu municipio <span className="x-serif">y por dónde empezar.</span></> : 'Conoce dónde está tu municipio y por dónde empezar.'}
            </h2>
            <p className="text-lg opacity-75">Línea base orientativa. No sustituye un diagnóstico técnico ni un proceso participativo.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#" className="x-btn" style={{ background: 'var(--cta-ink)', color: 'var(--cta-bg)' }}>Iniciar diagnóstico <ArrowRight className="size-4" /></a>
              <a href="#" className="x-btn border" style={{ borderColor: 'color-mix(in srgb, var(--cta-ink) 30%, transparent)' }}>Ver ejemplo</a>
            </div>
          </div>
        </motion.div>
      </Contenedor>
    </section>
  );
}

function Pie({ d }: { d: Direccion }) {
  return (
    <footer className="border-t border-(--line)">
      <Contenedor className="flex flex-col gap-6 py-10 text-sm text-(--ink-3) md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-(--ink)"><Logo d={d} /></div>
        <p>Prototipo piloto · No es una herramienta oficial del Estado colombiano.</p>
      </Contenedor>
    </footer>
  );
}

/* ── Página ───────────────────────────────────────────────────────────── */

export function Landing({ d }: { d: Direccion }) {
  return (
    <div className="x-root min-h-screen" style={d.vars as CSSProperties}>
      <style>{CSS}</style>
      <SelectorDireccion actual={d.id} />
      <Nav d={d} />
      <main>
        <Hero d={d} />
        <Marcos />
        <Features d={d} />
        <ComoFunciona />
        <Cifras />
        <CTA d={d} />
      </main>
      <Pie d={d} />
    </div>
  );
}

function SelectorDireccion({ actual }: { actual: Direccion['id'] }) {
  return (
    <div className="flex items-center justify-center gap-1 bg-[#111] px-3 py-2 text-xs text-white/70">
      <span className="mr-2 hidden sm:inline">Exploración DS ·</span>
      {(['a', 'b', 'c', 'd'] as const).map((id) => (
        <Link key={id} href={`/explorar/${id}`} className={`rounded-md px-2.5 py-1 ${id === actual ? 'bg-white text-black' : 'hover:text-white'}`}>
          {id.toUpperCase()} · {{ a: 'Preciso', b: 'Territorio', c: 'Observatorio', d: 'Cordillera' }[id]}
        </Link>
      ))}
    </div>
  );
}
