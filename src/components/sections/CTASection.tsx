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
      'Conversas con un agente de IA que te hace preguntas específicas sobre tu municipio, sin formularios ni escalas.',
  },
  {
    icon: Brain,
    title: 'El sistema analiza',
    description:
      'Dos agentes evalúan la entrevista y calculan tu nivel de preparación institucional en 6 dimensiones.',
  },
  {
    icon: BarChart2,
    title: 'Recibes tu diagnóstico',
    description:
      'Un resultado visual con tu nivel, fortalezas, brechas y recomendaciones adaptadas a tu municipio.',
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
      className="py-32 md:py-40 px-6 md:px-12"
      style={{
        background: 'linear-gradient(180deg, #0A0C0F 0%, #0F1419 60%, #131920 100%)',
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
            Cómo funciona
          </span>

          <h2
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            No un cuestionario.{' '}
            <span className="bg-gradient-to-r from-teal to-blue bg-clip-text text-transparent">
              Una conversación.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
            El diagnóstico se construye a través del diálogo, no de casillas marcadas.
            Tu municipio merece una evaluación que entienda su contexto específico.
          </p>
        </motion.div>

        {/* Pasos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: 'easeOut' }}
                className="glassmorphism p-8 flex flex-col gap-5"
              >
                <div className="w-11 h-11 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-teal" />
                </div>
                <div className="flex flex-col gap-2">
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

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.55, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-start gap-6"
        >
          <Link
            href="/diagnostico"
            className="inline-block px-10 py-4 bg-teal text-[#0A0C0F] font-semibold rounded-xl hover:bg-teal/90 transition-colors text-base"
          >
            Comenzar Diagnóstico →
          </Link>
          <p className="text-sm text-subtle self-center">
            Gratuito · Sin registro · Resultados inmediatos
          </p>
        </motion.div>

      </div>
    </section>
  );
}
