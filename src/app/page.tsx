import HeroSection from '@/components/sections/HeroSection';
import ContextSection from '@/components/sections/ContextSection';
import CitiesSection from '@/components/sections/CitiesSection';
import RecomendacionesSection from '@/components/sections/RecomendacionesSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <ContextSection />
      <CitiesSection />
      <RecomendacionesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
