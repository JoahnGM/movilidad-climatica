/** Evento para iniciar el diagnóstico desde otra parte de la landing (p. ej. el campo del hero). */
export const EVENTO_INICIAR = 'diagnostico:iniciar';
export const CLAVE_MUNICIPIO_INICIAL = 'municipio-inicial';

/** Guarda el municipio como primer mensaje del chat, avisa a la sección del diagnóstico y baja hasta ella. */
export function iniciarDiagnostico(municipio: string) {
  const m = municipio.trim();
  if (m) localStorage.setItem(CLAVE_MUNICIPIO_INICIAL, m);
  window.dispatchEvent(new CustomEvent<string>(EVENTO_INICIAR, { detail: m }));
  history.replaceState(null, '', '#diagnostico');
  document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
