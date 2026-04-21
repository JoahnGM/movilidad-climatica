import { NIVELES } from '@/lib/matriz';
import type { NivelId } from '@/lib/types';

interface Props {
  nivel_id: NivelId;
  nivel_nombre: string;
  puntaje: number;
}

export default function NivelBadge({ nivel_id, nivel_nombre, puntaje }: Props) {
  const color = NIVELES[nivel_id].color;

  return (
    <div
      className="inline-flex flex-col items-center gap-1.5 px-6 py-4 rounded-xl border"
      style={{
        backgroundColor: color + '33',
        borderColor: color,
      }}
    >
      <span
        className="text-lg font-bold leading-tight"
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          color,
        }}
      >
        {nivel_nombre}
      </span>
      <span
        className="text-sm"
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          color,
          opacity: 0.85,
        }}
      >
        {puntaje} / 54 puntos
      </span>
    </div>
  );
}
