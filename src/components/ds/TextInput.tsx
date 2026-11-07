'use client';

import { useId, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type TextInputProps = Omit<ComponentProps<'input'>, 'size'> & {
  /** Etiqueta accesible. Siempre obligatoria, aunque se oculte. */
  label: string;
  /** Oculta la etiqueta visualmente (sigue disponible para lectores de pantalla). */
  hideLabel?: boolean;
  /** Texto de ayuda bajo el campo. */
  hint?: string;
  size?: 'md' | 'lg';
};

/** Campo de texto con etiqueta. Envuelve `ui/input` temizado con los tokens. */
export function TextInput({ label, hideLabel, hint, size = 'md', className, id, ...props }: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className={cn('text-small font-medium text-foreground', hideLabel && 'sr-only')}>
        {label}
      </label>
      <Input
        id={inputId}
        aria-describedby={hintId}
        className={cn(
          'bg-glass text-foreground placeholder:text-subtle border-border-strong/70 focus-visible:border-teal focus-visible:ring-teal/30',
          size === 'lg' ? 'h-14 px-5 text-body md:text-body' : 'h-11 px-4',
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-caption text-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}
