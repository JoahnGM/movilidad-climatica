'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Dialog, Text } from '@/components/ds';
import { useIdioma } from '@/components/i18n/IdiomaProvider';
import Logo from './Logo';

const CORREO = 'serna-mosquera@climatemobility.org';

function PrivacyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useIdioma();
  const p = t.privacidad;
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={t.footer.privacidad} textoCerrar={t.comun.cerrar}>
      <div className="flex flex-col gap-4 text-small text-muted">
        <p>
          <span className="font-medium text-foreground">{p.intro1}</span>{p.intro2}
        </p>
        {p.secciones.map(([titulo, ...parrafos]) => (
          <div key={titulo} className="flex flex-col gap-2">
            <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">{titulo}</p>
            {parrafos.map((texto) => <p key={texto.slice(0, 24)}>{texto}</p>)}
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-caption uppercase tracking-eyebrow text-subtle">{p.contacto}</p>
          <p>
            {p.contactoTexto}{' '}
            <a href={`mailto:${CORREO}`} className="text-green-ink underline underline-offset-2">{CORREO}</a>
          </p>
        </div>
        <p className="text-caption text-subtle">{p.actualizacion}</p>
      </div>
    </Dialog>
  );
}

export default function Footer() {
  const { t } = useIdioma();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const navegacion = [
    { href: '/#contexto', label: t.nav.contexto },
    { href: '/#ciudades', label: t.nav.ciudades },
    { href: '/#recomendaciones', label: t.footer.primerosPasos },
    { href: '/#diagnostico', label: t.footer.iniciar },
  ];

  return (
    <>
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />

      <footer className="border-t border-border bg-background">
        <Container className="py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Logo />
              <Text variant="small" className="max-w-xs">{t.footer.descripcion}</Text>
              <Text variant="caption" tone="muted" className="max-w-xs">{t.footer.marco}</Text>
            </div>

            <div className="flex flex-col gap-2.5">
              <Text variant="eyebrow" className="mb-1">{t.footer.navegacion}</Text>
              {navegacion.map((link) => (
                <Link key={link.href} href={link.href} className="text-small text-muted transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <Text variant="eyebrow" className="mb-1">{t.footer.investigacion}</Text>
              <Text variant="small" tone="default" weight="medium">Laura Serna</Text>
              <Text variant="small" tone="muted">{t.footer.bio}</Text>
              <a href={`mailto:${CORREO}`} className="text-small text-green-ink underline-offset-2 hover:underline">{CORREO}</a>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-caption text-subtle sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} {t.footer.derechos}</span>
            <button type="button" onClick={() => setPrivacyOpen(true)} className="underline underline-offset-2 transition-colors hover:text-foreground">
              {t.footer.privacidad}
            </button>
          </div>
        </Container>
      </footer>
    </>
  );
}
