import type { Metadata } from 'next';
import { MessageSquare, Scale, ShieldCheck } from 'lucide-react';
import { Badge, Chip, IconTile, TONES } from '@/components/ds';
import { CabeceraCatalogo, Muestra, Specimen } from '../_catalogo/Specimen';

export const metadata: Metadata = { title: 'Etiquetas' };

export default function Etiquetas() {
  return (
    <>
      <CabeceraCatalogo titulo="Etiquetas">Estados, categorías, el chip &quot;Piloto experimental&quot; e íconos en cuadro.</CabeceraCatalogo>

      <Specimen nombre="Badge" archivo="src/components/ds/Badge.tsx"
        descripcion="Estado o categoría corta, no interactiva: nivel, urgencia, estado de dimensión, EJEMPLO. Variantes soft (por defecto), outline, solid."
        codigo={`<Badge tone="amber">Nivel 2 · Reconocimiento parcial</Badge>
<Badge tone="amber" variant="solid" size="sm">EJEMPLO</Badge>`}
        usar={['Estados y niveles']} noUsar={['Acciones (usa Button)', 'Temas o etiquetas libres (usa Chip)']}
        a11y="El color nunca es la única señal: el texto dice el estado.">
        {(['soft', 'outline', 'solid'] as const).map((v) => (
          <Muestra key={v} etiqueta={`variant="${v}"`}>{TONES.map((t) => <Badge key={t} tone={t} variant={v}>{t}</Badge>)}</Muestra>
        ))}
      </Specimen>

      <Specimen nombre="Chip" archivo="src/components/ds/Badge.tsx"
        descripcion="Etiqueta en píldora para temas; variant=&quot;experimental&quot; es el chip &quot;Piloto experimental&quot; (navbar, chat)."
        codigo={`<Chip variant="experimental" size="sm">Piloto experimental</Chip>`}
        usar={['Áreas temáticas, piloto/experimental']} noUsar={['Estados con significado (usa Badge)']}>
        <Muestra etiqueta="variant"><Chip>Gestión del riesgo</Chip><Chip variant="experimental">Piloto experimental</Chip><Chip variant="experimental" size="sm">IA · piloto</Chip></Muestra>
      </Specimen>

      <Specimen nombre="IconTile" archivo="src/components/ds/IconTile.tsx"
        descripcion="Ícono decorativo en un cuadro tenue del tono indicado."
        codigo={`<IconTile icon={MessageSquare} />`}
        usar={['Encabezar tarjetas de features o categorías']} noUsar={['Botones de ícono (usa Button size="icon")']}
        a11y="aria-hidden: el título de la tarjeta lleva el significado.">
        <Muestra etiqueta="tone · size"><IconTile icon={MessageSquare} /><IconTile icon={ShieldCheck} tone="blue" /><IconTile icon={Scale} tone="violet" size="sm" /></Muestra>
      </Specimen>
    </>
  );
}
