'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, TrendingUp, MapPin, Lock, Home } from 'lucide-react';

const FORMAS = [
  {
    icon: ArrowRight,
    titulo: 'Desplazamiento interno',
    descripcion:
      'Cuando las personas deben salir de su lugar de residencia de forma involuntaria por inundaciones, tormentas, deslizamientos o erosión.',
  },
  {
    icon: TrendingUp,
    titulo: 'Migración',
    descripcion:
      'Cuando el movimiento ocurre de manera gradual o estratégica, combinando factores climáticos, económicos y sociales.',
  },
  {
    icon: MapPin,
    titulo: 'Inmovilidad',
    descripcion:
      'Cuando las personas permanecen en lugares expuestos a riesgos, ya sea porque no pueden salir o porque deciden quedarse.',
  },
  {
    icon: Lock,
    titulo: 'Poblaciones atrapadas',
    descripcion:
      'Cuando la permanencia no es una elección real, sino el resultado de restricciones materiales, sociales o institucionales.',
  },
  {
    icon: Home,
    titulo: 'Reubicación planificada',
    descripcion:
      'Cuando el traslado se organiza de manera anticipada o institucional frente a riesgos que hacen inviable la permanencia.',
  },
];

const AREAS = [
  'Planeación territorial',
  'Adaptación climática',
  'Gestión del riesgo',
  'Vivienda y hábitat',
  'Inclusión social',
  'Resiliencia territorial',
];

const metrics = [
  {
    value: '536.000',
    label: 'DESPLAZAMIENTOS',
    descripcion: 'Nuevos desplazamientos internos por desastres entre 2016 y 2022',
  },
  {
    value: '281.000',
    label: 'EN UN AÑO',
    descripcion: 'Desplazamientos reportados solo en 2022',
  },
  {
    value: '9.850',
    label: 'PERSONAS',
    descripcion: 'Desplazadas por cambio climático, según la Defensoría del Pueblo en 2023',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function ContextSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="contexto"
      ref={ref}
      className="py-32 md:py-40 px-6 md:px-12"
      style={{
        backgroundColor: '#111418',
        backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(45,212,191,0.04), transparent)',
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-20">

        {/* ── HEADER ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col gap-6 max-w-3xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-teal">
            Contexto
          </span>
          <h2
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            La crisis climática<br />está moviendo a Colombia
          </h2>
          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-2xl">
            En Colombia, el fenómeno no se explica solo por inundaciones o deslizamientos,
            sino por cómo esos impactos se combinan con desigualdad, debilidad institucional
            y presión creciente sobre ciudades y territorios.
          </p>
        </motion.div>

        {/* ── BLOQUE 1: ¿Qué es la movilidad climática? ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
          className="flex flex-col gap-8"
        >
          <div
            className="p-6 rounded-xl"
            style={{
              borderLeft: '4px solid #2DD4BF',
              borderTop: '1px solid rgba(45,212,191,0.2)',
              borderRight: '1px solid rgba(45,212,191,0.1)',
              borderBottom: '1px solid rgba(45,212,191,0.1)',
              backgroundColor: 'rgba(45,212,191,0.04)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-4">
              ¿Qué es la movilidad climática?
            </p>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              La movilidad climática se refiere a las distintas formas en que las personas cambian
              —o no logran cambiar— su relación con el territorio como resultado de los impactos
              de la crisis climática.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORMAS.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.titulo}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: 'easeOut' }}
                  className="glassmorphism p-8 flex flex-col gap-4"
                >
                  <Icon size={18} className="text-teal shrink-0" />
                  <p
                    className="text-sm font-semibold text-foreground leading-snug"
                    style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                  >
                    {f.titulo}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{f.descripcion}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── CALLOUT standalone ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.14, ease: 'easeOut' }}
        >
          <p
            className="text-2xl md:text-3xl font-bold text-foreground leading-snug max-w-2xl"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Los municipios colombianos están en la primera línea de esta crisis.
          </p>
        </motion.div>

        {/* ── BLOQUE 2: Evidencia / Métricas ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
          className="flex flex-col gap-12"
        >
          {/* Sub-header del bloque */}
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal">
              La evidencia
            </span>
            <h3
              className="text-3xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              Colombia enfrenta<br />una crisis silenciosa
            </h3>
            <p className="text-lg text-muted leading-relaxed max-w-2xl">
              Los datos oficiales muestran el tamaño del fenómeno — aunque todavía
              subestiman su verdadera dimensión.
            </p>
          </div>

          {/* Las 3 métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {metrics.map((m, i) => (
              <motion.div
                key={m.value}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.1, ease: 'easeOut' }}
                className={`flex flex-col gap-3 ${
                  i > 0 ? 'md:border-l md:border-white/10 md:pl-12' : ''
                } ${i < metrics.length - 1 ? 'md:pr-12' : ''}`}
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-subtle">
                  Dato
                </span>
                <span
                  className="text-5xl md:text-7xl font-bold text-teal leading-none"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {m.value}
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-teal"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {m.label}
                </span>
                <p className="text-sm text-muted leading-relaxed">{m.descripcion}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-base text-muted leading-relaxed max-w-2xl mt-8">
            Colombia se ha ubicado entre los países de la región con mayores niveles de
            desplazamiento inducido por desastres, combinado con el conflicto armado,
            la migración regional y profundas desigualdades territoriales.
          </p>
        </motion.div>

        {/* ── BLOQUE 3: ¿Por qué importa para ciudades? ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
          className="flex flex-col gap-8"
        >
          <div
            className="p-6 rounded-xl"
            style={{
              borderLeft: '4px solid #60A5FA',
              borderTop: '1px solid rgba(96,165,250,0.2)',
              borderRight: '1px solid rgba(96,165,250,0.1)',
              borderBottom: '1px solid rgba(96,165,250,0.1)',
              backgroundColor: 'rgba(96,165,250,0.04)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-4">
              ¿Por qué importa para ciudades?
            </p>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              La mayor parte de estas presiones de movilidad tienden a ser internas. Muchas personas
              no cruzan fronteras internacionales, sino que se desplazan hacia municipios, ciudades
              intermedias o grandes centros urbanos. Esto vuelve a los territorios locales actores
              centrales del problema.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {AREAS.map((area) => (
              <span
                key={area}
                className="text-sm text-muted border border-white/15 rounded-full px-4 py-1.5"
              >
                {area}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
