'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glassmorphism max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            Política de privacidad
          </h2>
          <button
            onClick={onClose}
            className="text-subtle hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-muted leading-relaxed">
          <p>
            <span className="text-foreground font-medium">Movilidad Climática Colombia</span> es una plataforma de diagnóstico
            institucional desarrollada con fines de investigación y apoyo técnico a gobiernos locales colombianos.
          </p>

          <div className="flex flex-col gap-2">
            <p className="text-foreground font-semibold text-xs uppercase tracking-widest">Datos que recopilamos</p>
            <p>
              La plataforma no requiere registro ni autenticación. Durante el diagnóstico, el sistema procesa el texto
              de la conversación entre el funcionario y el agente de inteligencia artificial. Esta información se almacena
              temporalmente en el navegador (localStorage) exclusivamente para generar el reporte de diagnóstico.
            </p>
            <p>
              No recopilamos, almacenamos ni compartimos datos personales identificables en servidores propios. Las
              conversaciones son procesadas por modelos de lenguaje de Google (Gemini) sujetos a sus propias políticas
              de privacidad.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-foreground font-semibold text-xs uppercase tracking-widest">Uso de los datos</p>
            <p>
              La información del municipio y del contexto institucional proporcionado se usa exclusivamente para generar
              el diagnóstico solicitado. No usamos los datos para entrenamiento de modelos propios, publicidad ni
              perfilamiento de usuarios.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-foreground font-semibold text-xs uppercase tracking-widest">Cookies y almacenamiento local</p>
            <p>
              La plataforma utiliza localStorage del navegador para conservar el progreso de la sesión. Esta información
              se elimina automáticamente al iniciar un nuevo diagnóstico. No usamos cookies de seguimiento ni herramientas
              de analítica de terceros.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-foreground font-semibold text-xs uppercase tracking-widest">Contacto</p>
            <p>
              Para consultas sobre privacidad o sobre el uso de esta plataforma, escríbenos a{' '}
              <a
                href="mailto:serna-mosquera@climatemobility.org"
                className="text-teal hover:text-teal/80 transition-colors"
              >
                serna-mosquera@climatemobility.org
              </a>
            </p>
          </div>

          <p className="text-subtle text-xs">Última actualización: abril 2026.</p>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}

      <footer className="bg-[#111419] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Columna 1: Logo + descripción */}
            <div className="flex flex-col gap-3">
              <span
                className="font-bold text-lg text-teal"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                CM Colombia
              </span>
              <p className="text-sm text-muted leading-relaxed max-w-xs">
                Plataforma de diagnóstico institucional para municipios colombianos
                frente a la movilidad climática y sus desafíos territoriales.
              </p>
              <p className="text-xs text-subtle leading-relaxed max-w-xs">
                Desarrollada en el marco de investigación sobre gobernanza local
                y adaptación climática en Colombia.
              </p>
            </div>

            {/* Columna 2: Links del sitio */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-2">
                Navegación
              </p>
              {[
                { href: '/#contexto', label: 'Contexto' },
                { href: '/#ciudades', label: 'Ciudades' },
                { href: '/#primeros-pasos', label: 'Primeros pasos' },
                { href: '/diagnostico', label: 'Iniciar diagnóstico' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Columna 3: Investigadora + contacto */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-1">
                Investigación
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">Laura Serna</p>
                <p className="text-sm text-subtle leading-relaxed">
                  Investigadora en gobernanza climática y movilidad humana forzada en Colombia.
                </p>
                <a
                  href="mailto:serna-mosquera@climatemobility.org"
                  className="text-sm text-teal hover:text-teal/80 transition-colors mt-1"
                >
                  serna-mosquera@climatemobility.org
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-subtle">
            <span>© {new Date().getFullYear()} Movilidad Climática Colombia. Todos los derechos reservados.</span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-subtle hover:text-foreground transition-colors underline underline-offset-2"
            >
              Política de privacidad
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
