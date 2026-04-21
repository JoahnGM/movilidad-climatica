'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
  const [municipio, setMunicipio] = useState('');
  const router = useRouter();

  function handleStart() {
    if (municipio.trim()) {
      localStorage.setItem('municipio-inicial', municipio.trim());
    }
    router.push('/diagnostico');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleStart();
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(#ffffff08 1px, transparent 1px),
          linear-gradient(90deg, #ffffff08 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        backgroundColor: '#0A0C0F',
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,#2DD4BF14,transparent)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted border border-white/10 rounded-full px-4 py-1.5">
            Plataforma de diagnóstico territorial
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-teal to-blue bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Movilidad Climática<br />en Colombia
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-xl">
            Diagnostica tu territorio. Actúa con datos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="w-full max-w-2xl flex flex-col items-center gap-4"
        >
          <Input
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿En qué municipio trabajas? Cuéntame tu contexto..."
            className="w-full h-14 px-5 text-base bg-white/5 border-teal/30 focus:border-teal focus-visible:ring-0 focus-visible:border-teal rounded-xl text-foreground placeholder:text-subtle transition-colors"
          />

          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3.5 bg-teal text-[#0A0C0F] font-semibold rounded-xl hover:bg-teal/90 transition-colors text-base"
          >
            Iniciar Diagnóstico →
          </button>

          <p className="text-sm text-subtle">
            O explora los casos de{' '}
            <span className="text-muted hover:text-foreground cursor-pointer transition-colors">Bogotá</span>
            {' · '}
            <span className="text-muted hover:text-foreground cursor-pointer transition-colors">Medellín</span>
            {' · '}
            <span className="text-muted hover:text-foreground cursor-pointer transition-colors">Barranquilla</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
