'use client';

import { useState } from 'react';
import { Button, Dialog, FeedbackThumbs, Text, TextInput, usePlaceholderAnimado, type Voto } from '@/components/ds';

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Abrir diálogo</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Política de privacidad">
        <Text variant="small">Contenido largo del diálogo. Esc o clic afuera lo cierran; el foco vuelve al botón.</Text>
      </Dialog>
    </>
  );
}

export function FeedbackDemo() {
  const [voto, setVoto] = useState<Voto | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <FeedbackThumbs pregunta="¿Este resultado te fue útil?" value={voto} onChange={setVoto} labelUp="Sí, me fue útil" labelDown="No me fue útil" />
      <Text variant="caption" tone="muted">Voto recibido por el callback: {voto ?? 'ninguno'}</Text>
    </div>
  );
}

export function PlaceholderDemo() {
  const [valor, setValor] = useState('');
  const [enfocado, setEnfocado] = useState(false);
  const placeholder = usePlaceholderAnimado(['Escribe aquí tu municipio para empezar…', 'Por ejemplo: Mocoa, Putumayo'], !enfocado && valor === '');
  return (
    <div className="max-w-md">
      <TextInput label="Municipio" hideLabel size="lg" value={valor} onChange={(e) => setValor(e.target.value)}
        onFocus={() => setEnfocado(true)} onBlur={() => setEnfocado(false)} placeholder={placeholder} />
    </div>
  );
}
