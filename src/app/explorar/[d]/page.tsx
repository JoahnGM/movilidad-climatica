import { notFound } from 'next/navigation';
import { DIRECCIONES, type DireccionId } from '../_exploracion/direcciones';
import { Landing } from '../_exploracion/Landing';

export function generateStaticParams() {
  return Object.keys(DIRECCIONES).map((d) => ({ d }));
}

export default async function DireccionPage({ params }: { params: Promise<{ d: string }> }) {
  const { d } = await params;
  const direccion = DIRECCIONES[d as DireccionId];
  if (!direccion) notFound();
  return <Landing d={direccion} />;
}
