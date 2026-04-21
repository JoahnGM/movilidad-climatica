'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

interface CityData {
  name: string;
  tagline: string;
  accentClass: string;
  accentHex: string;
  nivel: string;
  nivelColor: string;
  contexto: string;
  fortalezas: string[];
  brechas: string[];
  zonasClave: string[];
}

const cities: CityData[] = [
  {
    name: 'Bogotá',
    tagline: 'Riesgo hídrico y desplazamiento urbano',
    accentClass: 'text-blue',
    accentHex: '#60A5FA',
    nivel: 'Integración institucional en desarrollo',
    nivelColor: '#60A5FA',
    contexto:
      'Bogotá alberga más de 50.000 personas en rondas de ríos y humedales declarados en riesgo no mitigable. La Secretaría Distrital de Ambiente ha avanzado en cartografía de amenaza, pero los procesos de reubicación se fragmentan entre múltiples entidades sin una hoja de ruta unificada.',
    fortalezas: [
      'Sistema Distrital de Gestión del Riesgo con protocolos consolidados',
      'POMCA Río Bogotá con mapas de amenaza actualizados (2022)',
      'POT 2021 incorpora lenguaje de cambio climático y reubicación',
    ],
    brechas: [
      'Sin política explícita de movilidad climática ni ruta de acogida',
      'Déficit de coordinación entre IDIGER, SDA y alcaldías locales',
      'Reubicaciones ejecutadas sin seguimiento post-traslado',
    ],
    zonasClave: ['Ciudad Bolívar', 'Bosa', 'Engativá', 'Usme'],
  },
  {
    name: 'Medellín',
    tagline: 'Deslizamientos y vulnerabilidad en ladera',
    accentClass: 'text-teal',
    accentHex: '#2DD4BF',
    nivel: 'Reconocimiento parcial del problema',
    nivelColor: '#F59E0B',
    contexto:
      'Las laderas de Medellín concentran comunidades con décadas de historia en zonas de riesgo de deslizamiento. Aunque la ciudad ha invertido en intervención física, la articulación con instrumentos de planeación territorial sobre movilidad climática es aún incipiente.',
    fortalezas: [
      'DAGRD con capacidad técnica robusta en gestión del riesgo',
      'Proyectos de urbanismo social con enfoque de reducción de riesgo',
      'Mapa de riesgo geotécnico actualizado para laderas',
    ],
    brechas: [
      'Movilidad climática no diferenciada de la gestión de riesgo clásica',
      'Sin ruta de acogida para población desplazada del Oriente Antioqueño',
      'Vacíos de información sobre hogares en migración preventiva',
    ],
    zonasClave: ['Comunas 1, 3 y 8', 'San Cristóbal', 'El Pinal'],
  },
  {
    name: 'Barranquilla',
    tagline: 'Inundaciones costeras y calor urbano extremo',
    accentClass: 'text-amber',
    accentHex: '#F59E0B',
    nivel: 'Respuesta reactiva',
    nivelColor: '#EF4444',
    contexto:
      'Barranquilla enfrenta inundaciones fluviales en el sur, ascenso relativo del nivel del mar en Bocas de Ceniza, y temperaturas que superan los 38 °C de forma recurrente. La Ciénaga de Mallorquín actúa como regulador hídrico crítico bajo creciente presión urbanística.',
    fortalezas: [
      'Plan de Manejo de la Ciénaga de Mallorquín en formulación',
      'Barranquilla 2036 incorpora objetivos de adaptación costera',
      'Inversión en drenaje pluvial en el corredor de El Silencio',
    ],
    brechas: [
      'Sin registro de hogares en zonas de amenaza costera',
      'Sin protocolos de acogida para desplazados del Caribe rural',
      'Islas de calor sin estrategia de mitigación en asentamientos informales',
    ],
    zonasClave: ['Suroccidente', 'Las Flores', 'La Playa', 'El Bosque'],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function CityCard({ city, index, inView }: { city: CityData; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.55, delay: 0.12 + index * 0.12, ease: 'easeOut' }}
      className="glassmorphism flex flex-col overflow-hidden transition-colors duration-200"
      style={{ borderColor: open ? city.accentHex + '40' : undefined }}
    >
      {/* Header */}
      <button
        className="w-full p-8 flex flex-col gap-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h3
              className={`text-2xl font-bold ${city.accentClass}`}
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              {city.name}
            </h3>
            <p className="text-sm text-muted leading-snug">{city.tagline}</p>
          </div>
          <div className="shrink-0 mt-1">
            {open ? (
              <ChevronUp size={18} className="text-subtle" />
            ) : (
              <ChevronDown size={18} className="text-subtle" />
            )}
          </div>
        </div>

        <span
          className="self-start text-xs font-semibold px-3 py-1 rounded-full border"
          style={{
            color: city.nivelColor,
            borderColor: city.nivelColor + '55',
            backgroundColor: city.nivelColor + '15',
          }}
        >
          {city.nivel}
        </span>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 flex flex-col gap-6 border-t border-white/10 pt-6">
              <p className="text-sm text-muted leading-relaxed">{city.contexto}</p>

              <div className="flex flex-col gap-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Fortalezas</p>
                <ul className="flex flex-col gap-2">
                  {city.fortalezas.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                      <CheckCircle2 size={14} className="text-teal shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Brechas identificadas</p>
                <ul className="flex flex-col gap-2">
                  {city.brechas.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                      <AlertTriangle size={14} className="text-amber shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Zonas prioritarias</p>
                <div className="flex flex-wrap gap-2">
                  {city.zonasClave.map((z) => (
                    <span
                      key={z}
                      className="flex items-center gap-1.5 text-xs text-muted border border-white/15 rounded-full px-3 py-1"
                    >
                      <MapPin size={11} />
                      {z}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CitiesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="ciudades"
      ref={ref}
      className="py-32 md:py-40 px-6 md:px-12"
      style={{ backgroundColor: '#0A0C0F' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-20">

        {/* EYEBROW + HERO LINE + LEAD */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col gap-6 max-w-3xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-blue">
            Casos de estudio
          </span>

          <h2
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Tres ciudades.<br />Tres realidades.
          </h2>

          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
            Cómo tres ciudades colombianas están —y no están— abordando
            la movilidad climática. Despliega cada caso para ver fortalezas,
            brechas y zonas prioritarias.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <CityCard key={city.name} city={city} index={i} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}
