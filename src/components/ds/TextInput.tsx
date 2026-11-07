'use client';

import { useId, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type TextInputProps = Omit<ComponentProps<'input'>, 'size'> & {
  /** Etiqueta accesible. Siempre obligatoria, aunque se oculte. */
  label: string;
  /** Oculta la etiqueta visualmente (sigue disponible para lectores de pantalla). */
  hideLabel?: boolean;
  /** Texto de ayuda o error bajo el campo. */
  hint?: string;
  /** Muestra el hint como error (`aria-invalid`). */
  invalid?: boolean;
  size?: 'md' | 'lg';
};

/** Campo de texto con etiqueta, ayuda y estado de error. */
export function TextInput({ label, hideLabel, hint, invalid, size = 'md', className, id, ...props }: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className={cn('text-small font-medium text-foreground', hideLabel && 'sr-only')}>
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        aria-invalid={invalid || undefined}
        className={cn(
          'w-full rounded-control border border-border-strong/70 bg-surface-raised text-foreground outline-none transition-colors placeholder:text-subtle',
          'focus-visible:border-green focus-visible:ring-4 focus-visible:ring-green/15 disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-red',
          size === 'lg' ? 'h-13 px-5 text-body' : 'h-11 px-4 text-small',
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={hintId} role={invalid ? 'alert' : undefined} className={cn('text-caption', invalid ? 'text-red-ink' : 'text-subtle')}>
          {hint}
        </p>
      )}
    </div>
  );
}
