import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { toneText, type Tone } from './tones';

/* ── Heading ─────────────────────────────────────────────────────────── */

export const headingVariants = cva('font-heading text-foreground text-balance', {
  variants: {
    size: {
      display: 'text-display font-extrabold tracking-tight',
      h1: 'text-h1 font-bold',
      h2: 'text-h2 font-bold',
      h3: 'text-h3 font-bold',
      h4: 'text-h4 font-bold',
    },
    gradient: {
      true: 'text-gradient',
      false: '',
    },
  },
  defaultVariants: { size: 'h2', gradient: false },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = ComponentProps<'h2'> &
  VariantProps<typeof headingVariants> & {
    /** Nivel semántico. Elige el nivel por la jerarquía del documento, no por el tamaño. */
    as?: HeadingLevel;
  };

const SIZE_BY_LEVEL: Record<HeadingLevel, NonNullable<HeadingProps['size']>> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h4', h6: 'h4',
};

/** Títulos en Syne. `as` fija la semántica; `size` fija la escala visual. */
export function Heading({ as = 'h2', size, gradient, className, ...props }: HeadingProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(headingVariants({ size: size ?? SIZE_BY_LEVEL[as], gradient }), className)}
      {...props}
    />
  );
}

/* ── Text ────────────────────────────────────────────────────────────── */

export const textVariants = cva('', {
  variants: {
    variant: {
      /** Entrada de sección: 17–20px */
      lead: 'text-lead',
      /** Cuerpo: 16px */
      body: 'text-body',
      /** Tarjetas, listas, UI: 14px */
      small: 'text-small',
      /** Metadatos, pies, notas: 12px */
      caption: 'text-caption',
      /** Etiqueta en mayúsculas sobre un título */
      eyebrow: 'text-caption font-semibold uppercase tracking-widest',
    },
    tone: {
      default: 'text-foreground',
      secondary: 'text-muted',
      muted: 'text-subtle',
      teal: toneText.teal,
      blue: toneText.blue,
      amber: toneText.amber,
      red: toneText.red,
      violet: toneText.violet,
    },
    weight: {
      regular: '',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: { variant: 'body', tone: 'secondary', weight: 'regular' },
});

export type TextTone = NonNullable<VariantProps<typeof textVariants>['tone']>;

export type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: 'p' | 'span' | 'div' | 'li' | 'figcaption' | 'dt' | 'dd' | 'label';
  };

/** Texto en Inter. Por defecto: cuerpo, tono secundario (`text-muted`). */
export function Text({ as = 'p', variant, tone, weight, className, ...props }: TextProps) {
  const Comp: ElementType = as;
  const resolvedTone = tone ?? (variant === 'eyebrow' ? 'teal' : undefined);
  return <Comp className={cn(textVariants({ variant, tone: resolvedTone, weight }), className)} {...props} />;
}

/* ── Mono ────────────────────────────────────────────────────────────── */

export const monoVariants = cva('font-mono tabular-nums', {
  variants: {
    size: {
      /** Cifras protagonistas */
      metric: 'text-metric font-semibold',
      lg: 'text-h3 font-semibold',
      body: 'text-body',
      small: 'text-small',
      caption: 'text-caption',
    },
  },
  defaultVariants: { size: 'small' },
});

export type MonoProps = ComponentProps<'span'> &
  VariantProps<typeof monoVariants> & {
    tone?: Tone | 'default' | 'muted';
  };

/** Números, puntajes y datos en JetBrains Mono (cifras tabulares). */
export function Mono({ size, tone = 'default', className, ...props }: MonoProps) {
  const toneClass = tone === 'default' ? 'text-foreground' : tone === 'muted' ? 'text-subtle' : toneText[tone];
  return <span className={cn(monoVariants({ size }), toneClass, className)} {...props} />;
}
