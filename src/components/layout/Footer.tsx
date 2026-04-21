import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
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
          </div>

          {/* Columna 2: Links del sitio */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-2">
              Navegación
            </p>
            {[
              { href: '/#contexto', label: 'Contexto' },
              { href: '/#ciudades', label: 'Ciudades' },
              { href: '/diagnostico', label: 'Iniciar diagnóstico' },
              { href: '/resultado', label: 'Ver resultado' },
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

          {/* Columna 3: Créditos institucionales */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-2">
              Institucional
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Desarrollado en el marco de iniciativas de adaptación climática y
              gobernanza territorial para Colombia.
            </p>
            <p className="text-sm text-muted mt-1">
              Contacto:{' '}
              <span className="text-teal">info@movilidadclimatica.co</span>
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-subtle">
          <span>© {new Date().getFullYear()} Movilidad Climática Colombia. Todos los derechos reservados.</span>
          <span>Hecho con IA para gobiernos locales colombianos.</span>
        </div>
      </div>
    </footer>
  );
}
