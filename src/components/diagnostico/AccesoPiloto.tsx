'use client';

import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, Heading, Text, TextInput } from '@/components/ds';

interface Props {
  /** Se llama cuando el servidor acepta el código (la cookie de acceso ya quedó guardada). */
  onAcceso: () => void;
  /** h1 cuando es la página propia (/diagnostico/acceso); h3 dentro de la landing. */
  headingLevel?: 'h1' | 'h3';
}

/** Código de acceso del piloto cerrado (ACCESS_MODE=passcode), dentro de la sección del diagnóstico. */
export default function AccesoPiloto({ onAcceso, headingLevel = 'h3' }: Props) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim() || enviando) return;
    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.trim() }),
      });
      if (res.ok) {
        onAcceso();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setError(data.message ?? 'No pudimos verificar el código.');
    } catch {
      setError('No pudimos verificar el código.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card variant="raised" padding="lg" className="min-h-[480px] justify-center">
      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-5">
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-sage text-green-ink">
          <KeyRound className="size-5" />
        </span>
        <div className="flex flex-col gap-2">
          <Heading as={headingLevel} size="h4">Código de acceso</Heading>
          <Text variant="small">
            Durante el piloto, el diagnóstico está disponible para los municipios participantes.
            Ingresa el código que recibiste.
          </Text>
        </div>
        <TextInput
          label="Código de acceso"
          hideLabel
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código"
          autoComplete="off"
          maxLength={100}
          invalid={Boolean(error)}
          hint={error || undefined}
        />
        <Button type="submit" disabled={enviando || !codigo.trim()}>
          {enviando ? 'Verificando…' : 'Continuar'}
        </Button>
      </form>
    </Card>
  );
}
