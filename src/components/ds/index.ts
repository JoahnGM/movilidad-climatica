/**
 * Design system "Cordillera" — punto de entrada único. Importa siempre desde `@/components/ds`.
 * Cada componente exportado aquí DEBE aparecer en el catálogo /ds (check:ds lo verifica).
 * Estándar: docs/estandares/design-system.md
 */

// Fundamentos
export { MOTION, fadeUp } from './motion';
export { TONES, type Tone } from './tones';
export { MotionProvider } from './MotionProvider';

// Layout
export { Container, type ContainerProps } from './Container';
export { Section, type SectionProps } from './Section';
export { SectionHeader, type SectionHeaderProps } from './SectionHeader';
export { PageHeader, type PageHeaderProps, type Crumb } from './PageHeader';
export { Reveal, type RevealProps } from './Reveal';
export { SkipLink } from './SkipLink';

// Tipografía
export { Heading, Acento, Text, Mono, type HeadingProps, type TextProps, type MonoProps, type TextTone } from './Typography';

// Superficies y avisos
export { Card, type CardProps } from './Card';
export { Callout, type CalloutProps } from './Callout';
export { Banner, type BannerProps } from './Banner';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { Dialog, type DialogProps } from './Dialog';
export { Skeleton } from './Skeleton';

// Etiquetas
export { Badge, Chip, type BadgeProps, type ChipProps } from './Badge';
export { IconTile, type IconTileProps } from './IconTile';

// Datos y fuentes
export { Stat, type StatProps } from './Stat';
export { CifraConFuente, type CifraConFuenteProps } from './CifraConFuente';
export { SourceLink, type SourceLinkProps } from './SourceLink';
export { ProgressBar, type ProgressBarProps } from './ProgressBar';
export { Timeline, type TimelineProps, type TimelineItem } from './Timeline';
export { IconList, type IconListProps } from './IconList';

// Procesos
export { Pasos, type PasosProps, type Paso } from './Pasos';
export { Etapas, type EtapasProps, type Etapa, type EstadoEtapa } from './Etapas';

// Interacción
export { Button, buttonVariants, type ButtonProps } from './Button';
export { TextInput, type TextInputProps } from './TextInput';
export { Disclosure, DisclosureItem, type DisclosureItemProps } from './Disclosure';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { FeedbackThumbs, type FeedbackThumbsProps, type Voto } from './FeedbackThumbs';

// Efectos (uno protagonista por página)
export { FondoMontanas, type FondoMontanasProps } from './efectos/FondoMontanas';
export { TituloIA, type TituloIAProps, type TramoTitulo } from './efectos/TituloIA';
