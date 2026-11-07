import { cookies } from 'next/headers';
import HeroSection from '@/components/sections/HeroSection';
import ContextSection from '@/components/sections/ContextSection';
import CitiesSection from '@/components/sections/CitiesSection';
import RecomendacionesSection from '@/components/sections/RecomendacionesSection';
import CTASection from '@/components/sections/CTASection';
import EjemploSection from '@/components/sections/EjemploSection';
import DiagnosticoSection from '@/components/sections/DiagnosticoSection';
import Footer from '@/components/layout/Footer';
import { COOKIE_ACCESO, modoAcceso, verificarAcceso } from '@/lib/seguridad/acceso';

export default async function Home() {
  // Piloto cerrado: si no hay cookie válida, la sección del diagnóstico pide el código antes del chat.
  const requiereCodigo =
    modoAcceso() === 'passcode' && !(await verificarAcceso((await cookies()).get(COOKIE_ACCESO)?.value));

  return (
    <main id="contenido" className="flex flex-1 flex-col">
      <HeroSection />
      <ContextSection />
      <CitiesSection />
      <RecomendacionesSection />
      <CTASection />
      <EjemploSection />
      <DiagnosticoSection requiereCodigo={requiereCodigo} />
      <Footer />
    </main>
  );
}
