'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, Brain, BarChart2 } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: 'Describes tu territorio',
    description:
      'Conversas con un agente de IA que te hace preguntas específicas sobre tu municipio, sin formularios ni escalas de evaluación.',
  },
  {
    icon: Brain,
    title: 'El sistema analiza',
    description:
      'Dos agentes secuenciales evalúan la entrevista y calculan el nivel de preparación institucional en cinco dimensiones clave.',
  },
  {
    icon: BarChart2,
    title: 'Recibes tu diagnóstico',
    description:
      'Un resultado visual claro con tu nivel, fortalezas, brechas y recomendaciones concretas adaptadas a tu municipio.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="py-28 px-4 sm:px-6"
      style={{
        background: 'linear-gradient(180deg, #0A0C0F 0%, #0F1419 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-16 text-center">
        {/* Título */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            No un cuestionario.
            <br />
            <span className="bg-gradient-to-r from-teal to-blue bg-clip-text text-transparent">
              Una conversación.
            </span>
          </h2>
          <p className="text-base text-muted max-w-lg mx-auto">
            El diagnóstico se construye a través del diálogo, no de casillas marcadas.
          </p>
        </motion.div>

        {/* Pasos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: 'easeOut' }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                  <Icon size={22} className="text-teal" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p
                    className="font-semibold text-foreground"
                    style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                  >
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.45, ease: 'easeOut' }}
        >
          <Link
            href="/diagnostico"
            className="inline-block px-10 py-4 bg-teal text-[#0A0C0F] font-semibold rounded-xl hover:bg-teal/90 transition-colors text-base"
          >
            Comenzar Diagnóstico →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
