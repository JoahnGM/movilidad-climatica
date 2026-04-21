'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ClipboardList, Users, ShieldAlert, GitMerge,
  FileText, ArrowRightLeft, GraduationCap, Bell,
} from 'lucide-react';

interface Recomendacion {
  numero: number;
  icon: React.ElementType;
  titulo: string;
  descripcion: string;
}

const recomendaciones: Recomendacion[] = [
  {
    numero: 1,
    icon: ClipboardList,
    titulo: 'Inventariar zonas de riesgo',
    descripcion:
      'Levanta o actualiza el mapa de amenazas climáticas del municipio e identifica dónde viven las familias en riesgo no mitigable.',
  },
  {
    numero: 2,
    icon: Users,
    titulo: 'Identificar comunidades vulnerables',
    descripcion:
      'Cruza datos de pobreza, género y etnicidad con la cartografía de riesgo para priorizar la atención.',
  },
  {
    numero: 3,
    icon: ShieldAlert,
    titulo: 'Crear protocolo de emergencia climática',
    descripcion:
      'Define roles, alertas tempranas y rutas de evacuación antes del evento, no durante.',
  },
  {
    numero: 4,
    icon: GitMerge,
    titulo: 'Articular con entidades departamentales',
    descripcion:
      'Vincula la gobernación, el IDEAM y la CAR local. La movilidad climática no tiene fronteras municipales.',
  },
  {
    numero: 5,
    icon: FileText,
    titulo: 'Incluir movilidad climática en el POT',
    descripcion:
      'Incorpora zonas de reubicación posibles, perímetros controlados y cinturones verdes de amortiguación.',
  },
  {
    numero: 6,
    icon: ArrowRightLeft,
    titulo: 'Establecer rutas de reubicación preventiva',
    descripcion:
      'Diseña la hoja de ruta: predios, subsidios, acompañamiento psicosocial y seguimiento post-traslado.',
  },
  {
    numero: 7,
    icon: GraduationCap,
    titulo: 'Capacitar funcionarios locales',
    descripcion:
      'El equipo técnico debe entender la diferencia entre gestión del riesgo clásica y movilidad climática estructural.',
  },
  {
    numero: 8,
    icon: Bell,
    titulo: 'Activar sistemas de alerta temprana',
    descripcion:
      'Conecta datos del IDEAM, sensores locales y redes comunitarias para dar tiempo de actuar.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function RecomendacionesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="recomendaciones"
      ref={ref}
      className="py-32 md:py-40 px-6 md:px-12"
      style={{
        background:
          'linear-gradient(135deg, rgba(45,212,191,0.03) 0%, rgba(96,165,250,0.03) 100%), #111418',
      }}
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
          <span className="text-xs font-semibold uppercase tracking-widest text-teal">
            Orientaciones
          </span>

          <h2
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            ¿Por dónde empieza<br />un municipio?
          </h2>

          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
            8 acciones concretas que cualquier municipio puede implementar
            para comenzar a gestionar la movilidad climática,
            independientemente de su nivel actual de preparación.
          </p>
        </motion.div>

        {/* Grid 4×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recomendaciones.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.numero}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.07, ease: 'easeOut' }}
                className="glassmorphism p-8 flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-3xl font-bold text-teal/25 leading-none"
                    style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                  >
                    {String(r.numero).padStart(2, '0')}
                  </span>
                  <Icon size={18} className="text-teal" />
                </div>

                <p
                  className="text-sm font-semibold text-foreground leading-snug"
                  style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                  {r.titulo}
                </p>

                <p className="text-sm text-muted leading-relaxed">{r.descripcion}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.65, ease: 'easeOut' }}
        >
          <p className="text-base text-muted">
            ¿Cuáles de estas acciones son más urgentes para tu territorio?{' '}
            <a
              href="/diagnostico"
              className="text-teal hover:text-teal/80 transition-colors font-medium"
            >
              Realiza el diagnóstico gratuito →
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
