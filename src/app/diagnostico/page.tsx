'use client';

import { useState } from 'react';
import {
  FileSearch,
  BookOpen,
  Network,
  Database,
  Shield,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

const DIMENSIONES = [
  { icon: FileSearch, label: 'Reconocimiento y enfoque' },
  { icon: BookOpen,   label: 'Instrumentos de planeación' },
  { icon: Network,    label: 'Capacidad institucional' },
  { icon: Database,   label: 'Información y datos' },
  { icon: Shield,     label: 'Respuestas y rutas de actuación' },
  { icon: Scale,      label: 'Equidad y justicia climática' },
];

function getActiveIndex(count: number): number {
  if (count >= 15) return 5;
  if (count >= 12) return 4;
  if (count >= 9)  return 3;
  if (count >= 6)  return 2;
  if (count >= 3)  return 1;
  return 0;
}

export default function DiagnosticoPage() {
  const [userMessageCount, setUserMessageCount] = useState(0);

  const activeIndex    = getActiveIndex(userMessageCount);
  const completedCount = userMessageCount === 0 ? 0 : activeIndex;
  const progressPct    = Math.round((completedCount / 6) * 100);

  return (
    <div
      className="min-h-screen pt-16"
      style={{ backgroundColor: '#0A0F1E' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Columna izquierda — Tracker dinámico */}
          <aside className="lg:w-2/5 lg:sticky lg:top-24 lg:self-start flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1
                className="text-2xl sm:text-3xl font-bold text-foreground"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                Progreso del diagnóstico
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                Evaluación de 6 dimensiones de preparación institucional
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="flex flex-col gap-2">
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: '#1E2A45' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%`, backgroundColor: '#2DD4BF' }}
                />
              </div>
              <p
                className="text-xs text-subtle"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                {completedCount} de 6 dimensiones completadas
              </p>
            </div>

            {/* Lista de dimensiones con estados */}
            <div className="flex flex-col gap-1">
              {DIMENSIONES.map(({ icon: Icon, label }, i) => {
                const status =
                  i < activeIndex
                    ? 'complete'
                    : i === activeIndex
                    ? 'active'
                    : 'pending';

                return (
                  <div
                    key={label}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg relative overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: status === 'active' ? '#0F1629' : 'transparent',
                      borderLeft: status === 'active'
                        ? '3px solid #2DD4BF'
                        : status === 'complete'
                        ? '3px solid #2DD4BF'
                        : '3px solid transparent',
                    }}
                  >
                    {/* Ícono */}
                    <div
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-300"
                      style={{
                        backgroundColor:
                          status === 'pending' ? 'transparent' : 'rgba(45,212,191,0.1)',
                      }}
                    >
                      {status === 'complete' ? (
                        <CheckCircle2 size={14} className="text-teal" />
                      ) : (
                        <Icon
                          size={14}
                          className={
                            status === 'active'
                              ? 'text-teal animate-pulse'
                              : 'text-subtle'
                          }
                        />
                      )}
                    </div>

                    {/* Número + label */}
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        status === 'complete'
                          ? 'text-foreground'
                          : status === 'active'
                          ? 'text-foreground font-semibold'
                          : 'text-muted'
                      }`}
                    >
                      <span
                        className="mr-1.5"
                        style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          color: status === 'pending' ? '#94A3B8' : '#2DD4BF',
                        }}
                      >
                        D{i + 1}
                      </span>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-subtle">
              La conversación toma entre 10 y 15 minutos
            </p>
          </aside>

          {/* Columna derecha — Chat */}
          <main className="lg:w-3/5">
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: '#1E2A45', backgroundColor: '#0F1629' }}
            >
              <ChatInterface onUserMessageCount={setUserMessageCount} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
