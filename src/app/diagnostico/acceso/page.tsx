'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Formulario mínimo del piloto cerrado (ACCESS_MODE=passcode). Sin diseño nuevo:
// solo componentes shadcn existentes. Ver docs/estandares/seguridad.md.
export default function AccesoPage() {
  const router = useRouter();
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
        router.replace('/diagnostico');
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
    <div className="min-h-screen pt-16 flex items-center justify-center px-4" style={{ backgroundColor: '#0A0F1E' }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Código de acceso</CardTitle>
          <CardDescription>
            Durante el piloto, el diagnóstico está disponible para los municipios participantes.
            Ingresa el código que recibiste.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código"
              autoComplete="off"
              aria-label="Código de acceso"
              maxLength={100}
            />
            {error && <p className="text-sm text-muted" role="alert">{error}</p>}
            <Button type="submit" disabled={enviando || !codigo.trim()}>
              {enviando ? 'Verificando…' : 'Continuar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
