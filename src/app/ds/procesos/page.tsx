import type { Metadata } from 'next';
import { BookOpen, FileSearch, MessageSquare, ScanSearch } from 'lucide-react';
import { Acento, Etapas, FondoMontanas, Pasos, Text, TituloIA } from '@/components/ds';
import { CabeceraCatalogo, Specimen } from '../_catalogo/Specimen';

export const metadata: Metadata = { title: 'Procesos y efectos' };

export default function Procesos() {
  return (
    <>
      <CabeceraCatalogo titulo="Procesos y efectos">&quot;Cómo funciona&quot;, etapas de avance y los dos efectos de la marca. <Acento>Un efecto protagonista por página.</Acento></CabeceraCatalogo>

      <Specimen nombre="Pasos" archivo="src/components/ds/Pasos.tsx"
        descripcion="Bloque &quot;Cómo funciona&quot;: línea vertical con nodos que pulsan y una tarjeta por paso con una pieza de la interfaz real como ilustración."
        codigo={`<Pasos pasos={[{ icon: MessageSquare, titulo: 'Describes tu territorio', descripcion: '…', visual: <ChatVistaPrevia /> }]} />`}
        usar={['Explicar un proceso de 3–4 pasos']} noUsar={['Avance en vivo (usa Etapas)', 'Hitos con fecha (usa Timeline)']}
        a11y="Lista ordenada; el pulso se apaga con movimiento reducido.">
        <Pasos pasos={[
          { icon: MessageSquare, titulo: 'Describes tu territorio', descripcion: 'Conversas con un agente de IA.' },
          { icon: ScanSearch, titulo: 'El sistema analiza', descripcion: 'Dos agentes evalúan la entrevista.' },
        ]} />
      </Specimen>

      <Specimen nombre="Etapas" archivo="src/components/ds/Etapas.tsx"
        descripcion="Lista vertical de etapas con estado (pendiente · actual · completa). Es la base del progreso del diagnóstico."
        codigo={`<Etapas label="Etapas del diagnóstico" etapas={[{ id: 'd1', titulo: 'Reconocimiento', estado: 'completa' }, …]} />`}
        usar={['Avance en vivo de un proceso']} noUsar={['Explicar un proceso estático (usa Pasos)']}
        a11y="La etapa actual lleva aria-current=&quot;step&quot;; cada etapa anuncia su estado a lectores de pantalla.">
        <Etapas label="Ejemplo de etapas" etapas={[
          { id: '1', titulo: 'Reconocimiento y enfoque', icon: FileSearch, estado: 'completa' },
          { id: '2', titulo: 'Instrumentos de planeación', detalle: 'POT, plan de gestión del riesgo, decretos', icon: BookOpen, estado: 'actual' },
          { id: '3', titulo: 'Análisis de la evidencia', icon: ScanSearch, estado: 'pendiente' },
        ]} />
      </Specimen>

      <Specimen nombre="FondoMontanas" archivo="src/components/ds/efectos/FondoMontanas.tsx"
        descripcion="Cordillera de partículas finas (canvas, sin dependencias). El relieve sale de la densidad. Es el efecto protagonista del hero."
        codigo={`<FondoMontanas intensidad={0.7} desfase={23} className="absolute inset-x-0 top-16 h-[70%] [mask-image:…]" />`}
        usar={['El hero del home (una vez en todo el sitio)']} noUsar={['Fondos de secciones de contenido', 'Junto a otro efecto animado en la misma pantalla']}
        a11y="aria-hidden. 30 fps, baja a 15 si el equipo es lento, se pausa fuera de pantalla; quieto con movimiento reducido.">
        <div className="relative h-72 overflow-hidden rounded-xl bg-background">
          <FondoMontanas intensidad={0.7} desfase={23} className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_70%,transparent)]" />
        </div>
      </Specimen>

      <Specimen nombre="TituloIA" archivo="src/components/ds/efectos/TituloIA.tsx"
        descripcion="Titular que se escribe con sugerencias fantasma estilo autocompletado de IA. Cada tramo se pinta con su estilo final desde el inicio."
        codigo={`<TituloIA tramos={[
  { escribe: 'Diag', fantasma: 'nostica tu territorio. ' },
  { escribe: 'Act', fantasma: 'úa con datos.', className: 'font-accent text-green' },
]} className="font-heading text-display font-semibold tracking-display" />`}
        usar={['El h1 del hero']} noUsar={['Más de una vez por página', 'Textos largos']}
        a11y="El texto completo está siempre en el DOM (reserva el espacio, lo leen lectores y buscadores); la animación es aria-hidden. Con movimiento reducido aparece completo.">
        <TituloIA as="p" tramos={[{ escribe: 'Diag', fantasma: 'nostica tu territorio. ' }, { escribe: 'Act', fantasma: 'úa con datos.', className: 'font-accent text-green' }]} className="font-heading text-h1 font-semibold tracking-display text-foreground" />
        <Text variant="caption" tone="muted">Recarga la página para ver la animación.</Text>
      </Specimen>
    </>
  );
}
