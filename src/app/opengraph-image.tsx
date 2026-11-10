import { TAMANO_OG, imagenCompartir } from '@/lib/og/imagen-compartir';

/** Vista previa del enlace al compartir (WhatsApp, correo, redes). Se genera en el build. */
export const alt = '¿Qué tan preparada está tu ciudad para la movilidad climática? Primer diagnóstico gratuito.';
export const size = TAMANO_OG;
export const contentType = 'image/png';

export default function Image() {
  return imagenCompartir({
    marca: 'Movilidad Climática CO',
    titulo: '¿Qué tan preparada está tu ciudad',
    acento: 'para la movilidad climática?',
    bajada: 'Un primer diagnóstico gratuito, en 10 a 15 minutos de conversación guiada por IA.',
  });
}
