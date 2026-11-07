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
    slug: 'estructura',
    titulo: 'Layout',
    descripcion: 'Estructura de página: anchos, secciones, encabezados y animación de entrada.',
    primitivas: ['Container', 'Section', 'SectionHeader', 'PageHeader', 'Reveal', 'MotionProvider', 'SkipLink'],
  },
  {
    slug: 'tipografia',
    titulo: 'Tipografía',
    descripcion: 'Títulos en Instrument Sans, acento en Instrument Serif itálica y cifras en Geist Mono.',
    primitivas: ['Heading', 'Acento', 'Text', 'Mono'],
  },
  {
    slug: 'superficies',
    titulo: 'Superficies y avisos',
    descripcion: 'Tarjetas, avisos destacados, franjas, estados vacíos, diálogos y esqueletos de carga.',
    primitivas: ['Card', 'Callout', 'Banner', 'EmptyState', 'Dialog', 'Skeleton'],
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
  {
    slug: 'procesos',
    titulo: 'Procesos y efectos',
    descripcion: '"Cómo funciona", etapas de avance y los dos efectos de la marca: cordillera y titular IA.',
    primitivas: ['Pasos', 'Etapas', 'FondoMontanas', 'TituloIA'],
  },
];
