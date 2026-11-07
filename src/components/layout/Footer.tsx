'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Dialog, Text } from '@/components/ds';
import Logo from './Logo';

function PrivacyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Política de privacidad">
        <div className="flex flex-col gap-4 text-small text-muted">
          <p>
            <span className="font-medium text-foreground">Movilidad Climática Colombia</span> es una plataforma de diagnóstico
            institucional desarrollada con fines de investigación y apoyo técnico a gobiernos locales colombianos.
          </p>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">Datos que recopilamos</p>
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
            <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">Uso de los datos</p>
            <p>
              La información del municipio y del contexto institucional proporcionado se usa exclusivamente para generar
              el diagnóstico solicitado. No usamos los datos para entrenamiento de modelos propios, publicidad ni
              perfilamiento de usuarios.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">Cookies y almacenamiento local</p>
            <p>
              La plataforma utiliza localStorage del navegador para conservar el progreso de la sesión. Esta información
              se elimina automáticamente al iniciar un nuevo diagnóstico. No usamos cookies de seguimiento ni herramientas
              de analítica de terceros.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">Contacto</p>
            <p>
              Para consultas sobre privacidad o sobre el uso de esta plataforma, escríbenos a{' '}
              <a
                href="mailto:serna-mosquera@climatemobility.org"
                className="text-green-ink underline underline-offset-2"
              >
                serna-mosquera@climatemobility.org
              </a>
            </p>
          </div>

          <p className="text-caption text-subtle">Última actualización: abril 2026.</p>
        </div>
    </Dialog>
  );
}

const NAVEGACION = [
  { href: '/#contexto', label: 'Contexto' },
  { href: '/#ciudades', label: 'Ciudades' },
  { href: '/#recomendaciones', label: 'Primeros pasos' },
  { href: '/#diagnostico', label: 'Iniciar diagnóstico' },
];

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />

      <footer className="border-t border-border bg-background">
        <Container className="py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Logo />
              <Text variant="small" className="max-w-xs">
                Plataforma de diagnóstico institucional para municipios colombianos
                frente a la movilidad climática y sus desafíos territoriales.
              </Text>
              <Text variant="caption" tone="muted" className="max-w-xs">
                Desarrollada en el marco de investigación sobre gobernanza local
                y adaptación climática en Colombia.
              </Text>
            </div>

            <div className="flex flex-col gap-2.5">
              <Text variant="eyebrow" className="mb-1">Navegación</Text>
              {NAVEGACION.map((link) => (
                <Link key={link.href} href={link.href} className="text-small text-muted transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <Text variant="eyebrow" className="mb-1">Investigación</Text>
              <Text variant="small" tone="default" weight="medium">Laura Serna</Text>
              <Text variant="small" tone="muted">
                Investigadora en gobernanza climática y movilidad humana forzada en Colombia.
              </Text>
              <a href="mailto:serna-mosquera@climatemobility.org" className="text-small text-green-ink underline-offset-2 hover:underline">
                serna-mosquera@climatemobility.org
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-caption text-subtle sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Movilidad Climática Colombia. Todos los derechos reservados.</span>
            <button type="button" onClick={() => setPrivacyOpen(true)} className="underline underline-offset-2 transition-colors hover:text-foreground">
              Política de privacidad
            </button>
          </div>
        </Container>
      </footer>
    </>
  );
}
