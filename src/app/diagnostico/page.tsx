import { redirect } from 'next/navigation';

/** El diagnóstico vive en la landing (sección #diagnostico). Esta ruta se conserva para enlaces viejos. */
export default function DiagnosticoPage() {
  redirect('/#diagnostico');
}
