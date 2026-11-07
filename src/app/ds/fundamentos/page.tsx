import type { Metadata } from 'next';
import { Badge, Heading, MOTION, Text, TONES } from '@/components/ds';
import { CabeceraCatalogo } from '../_catalogo/Specimen';
import { MuestrasColor, TablaContraste } from '../_catalogo/Tokens';

export const metadata: Metadata = { title: 'Fundamentos' };

const COLORES = {
  'Fondos y superficies': [
    { nombre: 'background', uso: 'Fondo base (papel)' },
    { nombre: 'background-alt', uso: 'Secciones alternas' },
    { nombre: 'surface', uso: 'Tarjeta plana' },
    { nombre: 'surface-raised', uso: 'Tarjeta elevada, chat' },
    { nombre: 'sage', uso: 'Acento suave' },
    { nombre: 'ink', uso: 'Botón primario, burbuja del usuario' },
  ],
  'Texto y bordes': [
    { nombre: 'foreground', uso: 'Texto principal' },
    { nombre: 'muted', uso: 'Texto de apoyo' },
    { nombre: 'subtle', uso: 'Metadatos, eyebrows' },
    { nombre: 'border', uso: 'Divisores y tarjetas' },
    { nombre: 'border-strong', uso: 'Controles (≥3:1)' },
  ],
  'Tonos (relleno · texto)': [
    { nombre: 'green', uso: 'Marca, fortaleza, nivel 4' },
    { nombre: 'blue', uso: 'Info, en desarrollo, nivel 3' },
    { nombre: 'amber', uso: 'Advertencia, nivel 2, ejemplo' },
    { nombre: 'amber-ink', uso: 'Texto ámbar AA' },
    { nombre: 'red', uso: 'Crítico, nivel 1' },
    { nombre: 'red-ink', uso: 'Texto rojo AA' },
    { nombre: 'violet', uso: 'IA y experimental' },
    { nombre: 'violet-ink', uso: 'Texto violeta AA' },
  ],
};

const ESCALA = [
  ['display', 'Hero (una vez por página)'], ['h1', 'Título de página interna'], ['h2', 'Título de sección'],
  ['h3', 'Subsección, mensaje clave'], ['h4', 'Título de tarjeta'], ['lead', 'Entrada de sección'],
  ['body', 'Cuerpo'], ['small', 'Tarjetas, listas, UI'], ['caption', 'Metadatos, fuentes'],
] as const;

const ESPACIOS = [
  ['gutter', '--space-gutter', 'Padding lateral del Container'],
  ['section', '--space-section', 'Padding vertical de Section'],
  ['block', '--space-block', 'Entre bloques de una sección'],
  ['card', '--space-card', 'Padding de Card'],
  ['stack', '--space-stack', 'Dentro de una tarjeta'],
] as const;

export default function Fundamentos() {
  return (
    <>
      <CabeceraCatalogo titulo="Fundamentos">
        Tokens de <code className="font-mono">src/app/globals.css</code>. Los valores se leen en vivo de las variables CSS:
        lo que ves aquí es exactamente lo que usa el sitio.
      </CabeceraCatalogo>

      {Object.entries(COLORES).map(([grupo, tokens]) => (
        <section key={grupo} className="flex flex-col gap-4">
          <Heading as="h2" size="h3">{grupo}</Heading>
          <MuestrasColor tokens={tokens} />
        </section>
      ))}

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">Contraste AA</Heading>
        <Text variant="small">Mismos pares que verifica <code className="font-mono">npm run check:ds</code> (fuente: <code className="font-mono">src/components/ds/contraste.json</code>).</Text>
        <TablaContraste />
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">Tonos semánticos</Heading>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
        </div>
        <Text variant="small">Verde = marca y fortaleza · azul = información · ámbar = advertencia y ejemplo · rojo = crítico · violeta = IA y experimental.</Text>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">Tipografía</Heading>
        <div className="flex flex-col divide-y divide-border rounded-card border border-border bg-surface-raised">
          {ESCALA.map(([t, uso]) => (
            <div key={t} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:gap-6">
              <code className="w-24 shrink-0 font-mono text-caption text-subtle">text-{t}</code>
              <span className={`text-${t} min-w-0 flex-1 truncate font-heading ${['display', 'h1', 'h2', 'h3', 'h4'].includes(t) ? 'font-semibold tracking-heading' : ''} text-foreground`}>Movilidad climática</span>
              <span className="text-caption text-subtle">{uso}</span>
            </div>
          ))}
        </div>
        <Text variant="small">Instrument Sans (UI y títulos) · <span className="font-accent text-green">Instrument Serif itálica</span> (acento) · <span className="font-mono">Geist Mono</span> (cifras, eyebrows, fuentes).</Text>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">Espaciado, radios y sombras</Heading>
        <div className="flex flex-col gap-3">
          {ESPACIOS.map(([n, v, uso]) => (
            <div key={n} className="flex items-center gap-4">
              <code className="w-28 shrink-0 font-mono text-caption text-subtle">{n}</code>
              <span className="h-3 rounded-full bg-green/30" style={{ width: `var(${v})` }} />
              <span className="text-caption text-subtle">{uso}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex size-28 items-center justify-center rounded-control border border-border bg-surface-raised font-mono text-caption text-subtle">control</div>
          <div className="flex size-28 items-center justify-center rounded-card border border-border bg-surface-raised font-mono text-caption text-subtle">card</div>
          <div className="flex size-28 items-center justify-center rounded-card bg-surface-raised font-mono text-caption text-subtle shadow-card">shadow-card</div>
          <div className="flex size-28 items-center justify-center rounded-card bg-surface-raised font-mono text-caption text-subtle shadow-raised">shadow-raised</div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">Movimiento</Heading>
        <Text variant="small">
          <code className="font-mono">MOTION</code> (espejo de <code className="font-mono">--motion-*</code>): fast {MOTION.fast * 1000} ms · base {MOTION.base * 1000} ms ·
          slow {MOTION.slow * 1000} ms · desplazamiento {MOTION.distance} px · escalonado {MOTION.stagger * 1000} ms. Todo respeta
          <code className="font-mono"> prefers-reduced-motion</code>.
        </Text>
      </section>
    </>
  );
}
