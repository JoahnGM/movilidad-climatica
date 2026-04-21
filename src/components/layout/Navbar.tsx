'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/#contexto', label: 'Contexto' },
    { href: '/#ciudades', label: 'Ciudades' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0C0F]/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading font-bold text-lg text-teal tracking-tight"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          CM Colombia
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnostico"
            className="text-sm text-teal border border-teal rounded-lg px-4 py-1.5 hover:bg-teal/10 transition-colors"
          >
            Diagnóstico
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0C0F]/95 backdrop-blur-md border-b border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-3 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-foreground transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/diagnostico"
              className="text-sm text-teal border border-teal rounded-lg px-4 py-2 text-center hover:bg-teal/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Diagnóstico
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
