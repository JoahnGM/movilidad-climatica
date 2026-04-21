'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const TYPING_TEXT = 'Diagnostica tu territorio. Actúa con datos.';

function useTypingEffect(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

export default function HeroSection() {
  const [municipio, setMunicipio] = useState('');
  const router = useRouter();
  const typed = useTypingEffect(TYPING_TEXT, 40);

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
          linear-gradient(#ffffff06 1px, transparent 1px),
          linear-gradient(90deg, #ffffff06 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        backgroundColor: '#0A0C0F',
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,#2DD4BF12,transparent)] pointer-events-none" />

      {/* Bottom fade → next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#111418] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal border border-teal/30 rounded-full px-4 py-1.5">
              Plataforma de diagnóstico territorial
            </span>
            <p className="text-xs text-subtle">
              Basado en investigación sobre gobernanza local y movilidad climática en Colombia
            </p>
          </div>

          {/* Hero title */}
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-teal to-blue bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Movilidad Climática<br />en Colombia
          </h1>

          {/* Subtitle with typing effect */}
          <p className="text-lg md:text-xl text-muted max-w-xl min-h-[2rem] mt-8">
            {typed}
            <span className="animate-pulse">|</span>
          </p>
        </motion.div>

        {/* Input block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="w-full max-w-xl flex flex-col items-center gap-4 mt-12"
        >
          <Input
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿En qué municipio trabajas?"
            className="w-full py-5 px-5 text-base bg-white/5 border-teal/30 focus:border-teal focus-visible:ring-0 focus-visible:border-teal rounded-xl text-foreground placeholder:text-subtle transition-colors"
          />

          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-10 py-3.5 bg-teal text-[#0A0C0F] font-semibold rounded-xl hover:bg-teal/90 transition-colors text-base"
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
