import { redirect } from 'next/navigation';

/** El resultado se muestra en la landing (sección #diagnostico), leído de localStorage. Ruta conservada para enlaces viejos. */
export default function ResultadoPage() {
  redirect('/#diagnostico');
}
