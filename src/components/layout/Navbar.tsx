'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button, Chip, Container } from '@/components/ds';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import SelectorIdioma from './SelectorIdioma';
import BotonCompartir from '@/components/compartir/BotonCompartir';
import { useIdioma } from '@/components/i18n/IdiomaProvider';

export default function Navbar() {
  const { t } = useIdioma();
  const links = [
    { href: '/#contexto',         label: t.nav.contexto },
    { href: '/#ciudades',         label: t.nav.ciudades },
    { href: '/#recomendaciones',  label: t.nav.recomendaciones },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300',
        scrolled || menuOpen ? 'border-border bg-background/85' : 'border-transparent bg-background/0',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-2 md:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label={t.nav.inicioAria} className="shrink-0">
            <Logo compactoEnMovil />
          </Link>
          <Chip variant="experimental" size="sm" className="hidden lg:inline-flex">{t.comun.pilotoExperimental}</Chip>
        </div>

        <nav aria-label={t.nav.principal} className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-small text-muted transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <BotonCompartir forma="icono" variant="ghost" />
          <SelectorIdioma />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/#diagnostico">{t.nav.diagnostico}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </Container>

      {menuOpen && (
        <div id="menu-movil" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 pt-2 pb-4">
            <Chip variant="experimental" size="sm" className="mb-2 lg:hidden">{t.comun.pilotoExperimental}</Chip>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 text-small text-muted transition-colors hover:text-foreground" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/#diagnostico" onClick={() => setMenuOpen(false)}>{t.nav.diagnostico}</Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
