'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const metrics = [
  {
    value: '8.7M', // TODO: reemplazar con datos reales
    label: 'personas en riesgo',
    description:
      'colombianos que podrían verse forzados a moverse por eventos climáticos extremos en la próxima década.',
  },
  {
    value: '642', // TODO: reemplazar con datos reales
    label: 'municipios vulnerables',
    description:
      'territorios con alta exposición a inundaciones, deslizamientos o sequías severas según el IDEAM.',
  },
  {
    value: '3.2%', // TODO: reemplazar con datos reales
    label: 'del PIB en pérdidas',
    description:
      'impacto económico anual estimado por eventos climáticos sobre infraestructura y producción nacional.',
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
      className="py-24 px-4 sm:px-6"
      style={{ backgroundColor: '#111418' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        {/* Título */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          Por qué importa
        </motion.h2>

        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
              className="flex flex-col gap-2"
            >
              <span
                className="text-5xl font-bold text-teal"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                {m.value}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted">
                {m.label}
              </span>
              <p className="text-sm text-subtle leading-relaxed">
                {m.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Párrafo explicativo */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.4, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-center flex flex-col gap-1"
        >
          <p className="text-base text-muted leading-relaxed">
            La <span className="text-foreground font-medium">movilidad climática</span> es el desplazamiento de personas
            causado —directa o indirectamente— por fenómenos climáticos: inundaciones, sequías,
            deslizamientos o el deterioro progresivo de ecosistemas de los que dependen comunidades enteras.
          </p>
          <p className="text-base text-muted leading-relaxed">
            A diferencia de la migración voluntaria, estos movimientos son forzados y generan presión
            sobre los territorios receptores sin que existan marcos institucionales claros para
            absorberlos, proteger los derechos de las personas o planificar el ordenamiento territorial.
          </p>
          <p className="text-base text-muted leading-relaxed">
            Los municipios colombianos están en la primera línea de esta crisis —y muchos aún no saben
            qué tan preparados (o desprotegidos) están para enfrentarla.
          </p>
        </motion.div>

        <Separator className="bg-white/10" />
      </div>
    </section>
  );
}
