'use client';

import {
  FileSearch,
  BookOpen,
  Network,
  Database,
  Shield,
  Scale,
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

export default function DiagnosticoPage() {
  return (
    <div
      className="min-h-screen pt-16"
      style={{ backgroundColor: '#0A0F1E' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna izquierda — sticky */}
          <aside className="lg:w-2/5 lg:sticky lg:top-24 lg:self-start flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1
                className="text-2xl sm:text-3xl font-bold text-foreground"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                Diagnóstico Territorial
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                Una conversación guiada para evaluar el nivel de preparación de
                tu municipio frente a la movilidad climática
              </p>
            </div>

            {/* 6 dimensiones */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-1">
                Dimensiones evaluadas
              </p>
              {DIMENSIONES.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg"
                  style={{ backgroundColor: '#0F1629' }}
                >
                  <div className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-teal/10">
                    <Icon size={14} className="text-teal" />
                  </div>
                  <span className="text-xs text-muted">
                    <span
                      className="text-subtle font-mono mr-1.5"
                      style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                    >
                      D{i + 1}
                    </span>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-subtle">
              La conversación toma entre 10 y 15 minutos
            </p>
          </aside>

          {/* Columna derecha — chat */}
          <main className="lg:w-3/5">
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: '#1E2A45', backgroundColor: '#0F1629' }}
            >
              <ChatInterface />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
