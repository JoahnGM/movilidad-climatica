'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const cities = [
  {
    name: 'Bogotá',
    risk: 'Riesgo hídrico y desplazamiento urbano',
    badge: 'Caso documentado',
    color: 'text-blue',
  },
  {
    name: 'Medellín',
    risk: 'Deslizamientos y vulnerabilidad en ladera',
    badge: 'Caso documentado',
    color: 'text-violet',
  },
  {
    name: 'Barranquilla',
    risk: 'Inundaciones costeras y calor urbano',
    badge: 'Caso documentado',
    color: 'text-amber',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function CitiesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="ciudades" ref={ref} className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center flex flex-col gap-3"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Casos de Ciudad
          </h2>
          <p className="text-base text-muted max-w-xl mx-auto">
            Cómo tres ciudades colombianas están —y no están— abordando el problema
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <motion.div
              key={city.name}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: 'easeOut' }}
              className="glassmorphism p-6 flex flex-col gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col gap-2">
                <h3
                  className={`text-2xl font-bold ${city.color}`}
                  style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                  {city.name}
                </h3>
                <p className="text-sm text-muted leading-snug">{city.risk}</p>
              </div>

              <Badge
                variant="outline"
                className="self-start text-xs border-white/20 text-subtle"
              >
                {city.badge}
              </Badge>

              <button
                className="mt-auto text-sm text-muted hover:text-foreground text-left transition-colors"
                onClick={() => console.log(`Ver caso: ${city.name}`)}
              >
                Ver caso →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
