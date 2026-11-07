/** Índice del catálogo. Cada primitiva exportada en src/components/ds/index.ts aparece en una página. */
export interface GrupoCatalogo {
  slug: string;
  titulo: string;
  descripcion: string;
  primitivas: string[];
}

export const GRUPOS: GrupoCatalogo[] = [
  {
    slug: 'fundamentos',
    titulo: 'Fundamentos',
    descripcion: 'Tokens de color, contraste, tipografía, espaciado, radios, sombras, movimiento y tonos.',
    primitivas: [],
  },
  {
    slug: 'layout',
    titulo: 'Layout',
    descripcion: 'Estructura de página: anchos, secciones, encabezados y animación de entrada.',
    primitivas: ['Container', 'Section', 'SectionHeader', 'PageHeader', 'Reveal', 'MotionProvider', 'SkipLink'],
  },
  {
    slug: 'tipografia',
    titulo: 'Tipografía',
    descripcion: 'Títulos en Syne, texto en Inter y cifras en JetBrains Mono.',
    primitivas: ['Heading', 'Text', 'Mono'],
  },
  {
    slug: 'superficies',
    titulo: 'Superficies y avisos',
    descripcion: 'Tarjetas, avisos destacados, franjas, estados vacíos, diálogos y esqueletos de carga.',
    primitivas: ['GlassCard', 'Callout', 'Banner', 'EmptyState', 'Dialog', 'Skeleton'],
  },
  {
    slug: 'etiquetas',
    titulo: 'Etiquetas',
    descripcion: 'Estados, categorías, el chip "Piloto experimental" e íconos en cuadro.',
    primitivas: ['Badge', 'Chip', 'IconTile'],
  },
  {
    slug: 'datos',
    titulo: 'Datos y fuentes',
    descripcion: 'Cifras, cifras con fuente, citas, barras de puntaje, líneas de tiempo y listas.',
    primitivas: ['Stat', 'CifraConFuente', 'SourceLink', 'ProgressBar', 'Timeline', 'IconList'],
  },
  {
    slug: 'interaccion',
    titulo: 'Interacción',
    descripcion: 'Botones, campos, acordeones, pestañas y la micro-encuesta 👍/👎.',
    primitivas: ['Button', 'TextInput', 'Disclosure', 'DisclosureItem', 'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent', 'FeedbackThumbs'],
  },
];
