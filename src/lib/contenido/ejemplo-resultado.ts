import type { AnalisisResult, DiagnosticoResult } from '@/lib/types'

/**
 * Ejemplo de resultado con datos FICTICIOS para la ruta `/ejemplo` y la demo guiada del taller.
 *
 * REGLA DE USO: cualquier pantalla que renderice estos datos DEBE mostrar, de forma persistente,
 * el banner "Ejemplo ilustrativo con datos ficticios — no corresponde a ningún municipio real"
 * y el badge "EJEMPLO" en el nivel. Ver docs/piloto/micro-encuesta-spec.md y
 * docs/estandares/medicion-y-feedback.md. Estos datos nunca se guardan en localStorage
 * (no deben confundirse con un diagnóstico real) ni se envían al pipeline de agentes.
 *
 * Los textos del iceberg_2 son los oficiales de CLAUDE.md §4 y no se parafrasean.
 * Subtotales: 5 + 4 + 3 + 2 + 3 + 2 = 19 de 54 (nivel_2, rango 14-27).
 */
export const ES_EJEMPLO = true

export const MUNICIPIO_EJEMPLO = 'Municipio de Ejemplo (ficticio)'

export const BANNER_EJEMPLO =
  'Ejemplo ilustrativo con datos ficticios — no corresponde a ningún municipio real'

export const EJEMPLO_DIAGNOSTICO: DiagnosticoResult = {
  municipio: MUNICIPIO_EJEMPLO,
  nivel_id: 'nivel_2',
  nivel_nombre: 'Reconocimiento parcial del problema',
  iceberg_id: 'iceberg_2',
  puntaje_total: 19,
  puntaje_maximo: 54,
  capas_activas: ['capa_1', 'capa_2'],
  iceberg_texto_corto:
    'Tu territorio comienza a reconocer que la movilidad climática responde a dinámicas recurrentes y no solo a emergencias aisladas, pero aún requiere mayor articulación institucional y programática.',
  iceberg_texto_ampliado:
    'Esto sugiere que el territorio ya ve parte del problema por debajo de la superficie, pero todavía necesita integrar mejor instrumentos, capacidades y respuestas.',
  resumen_territorio:
    'El Municipio de Ejemplo, ficticio y de categoría 5 con una cabecera junto a un río que se desborda cada temporada de lluvias, ya identifica que las familias de ciertos barrios se mudan o regresan después de cada creciente. Ese reconocimiento todavía vive en la experiencia de pocos funcionarios y no en instrumentos ni en rutas definidas.',
  dimensiones_resumen: [
    {
      id: 'd1_reconocimiento',
      nombre: 'Reconocimiento y enfoque del problema',
      subtotal: 5,
      maximo: 9,
      estado: 'en_desarrollo',
    },
    {
      id: 'd2_instrumentos',
      nombre: 'Instrumentos de planeación y política',
      subtotal: 4,
      maximo: 9,
      estado: 'en_desarrollo',
    },
    {
      id: 'd3_capacidad',
      nombre: 'Capacidad institucional y articulación',
      subtotal: 3,
      maximo: 9,
      estado: 'en_desarrollo',
    },
    {
      id: 'd4_informacion',
      nombre: 'Información, datos y análisis territorial',
      subtotal: 2,
      maximo: 9,
      estado: 'brecha_critica',
    },
    {
      id: 'd5_respuestas',
      nombre: 'Respuestas y rutas de actuación',
      subtotal: 3,
      maximo: 9,
      estado: 'en_desarrollo',
    },
    {
      id: 'd6_equidad',
      nombre: 'Equidad, participación y justicia climática',
      subtotal: 2,
      maximo: 9,
      estado: 'brecha_critica',
    },
  ],
  fortalezas: [
    'Quien fue entrevistado reconoce que las inundaciones recurrentes llevan a algunas familias a mudarse de manera temporal o definitiva, y no solo a necesitar ayuda inmediata (ficticio).',
    'El Plan Municipal de Gestión del Riesgo identifica los barrios ribereños como zona de amenaza por inundación, lo que da un punto de partida para conversar con otras dependencias (ficticio).',
  ],
  brechas: [
    'No hay un registro propio de las familias que se han movido por las inundaciones; hoy la información depende de la memoria de funcionarios y de líderes comunitarios.',
    'Planeación, ambiente y gestión del riesgo trabajan cada una por su lado y no existe una instancia donde se hable del tema de forma conjunta.',
    'Las comunidades de los barrios afectados no participan de manera sistemática en definir qué hacer frente a la amenaza.',
  ],
  recomendaciones: [
    {
      dimension: 'd4_informacion',
      area: 'Información y datos',
      accion:
        'Como primer paso, arme con gestión del riesgo una lista sencilla (hoja de cálculo) de los barrios que se inundan cada temporada, con número aproximado de familias y si han salido o regresado. No necesita un sistema nuevo: basta con empezar a registrar lo que hoy se sabe.',
      urgencia: 'inmediata',
    },
    {
      dimension: 'd3_capacidad',
      area: 'Capacidad institucional',
      accion:
        'En los próximos meses, proponga una reunión trimestral entre planeación, ambiente, gestión del riesgo y desarrollo social para revisar esa lista y acordar quién lleva cada tema. Dejar el acuerdo en un acta corta ya crea una ruta de articulación.',
      urgencia: 'corto_plazo',
    },
    {
      dimension: 'd2_instrumentos',
      area: 'Instrumentos de planeación',
      accion:
        'A mediano plazo, lleve lo aprendido a la próxima revisión del Plan de Ordenamiento Territorial o del plan de desarrollo, de modo que la movilidad asociada a inundaciones quede nombrada y con una línea de acción, así sea pequeña. Consulte a la corporación autónoma regional y a la gobernación por apoyo técnico.',
      urgencia: 'mediano_plazo',
    },
  ],
  mensaje_final:
    'Gracias por conversar con nosotros. Este es un ejemplo ficticio, pero muestra cómo se ve un punto de partida: no es una calificación, es una foto de dónde está hoy el territorio y de los primeros pasos posibles. Cuando haga el diagnóstico de su propio municipio, lo que usted describa será la base del resultado.',
}

export const EJEMPLO_SCORES: AnalisisResult = {
  municipio: MUNICIPIO_EJEMPLO,
  dimensiones: {
    d1_reconocimiento: {
      p1: { puntaje: 2, evidencia: '[FICTICIO] "Cuando sube el río, hay familias del barrio La Ribera que se van donde parientes y algunas no regresan."' },
      p2: { puntaje: 1, evidencia: '[FICTICIO] "Creo que el plan de riesgo menciona algo de eso, pero no estoy seguro."' },
      p3: { puntaje: 2, evidencia: '[FICTICIO] "No es solo atender la emergencia; también hay que pensar dónde puede vivir la gente."' },
      subtotal: 5,
    },
    d2_instrumentos: {
      p4: { puntaje: 2, evidencia: '[FICTICIO] "El plan de gestión del riesgo identifica los barrios ribereños como zona de inundación."' },
      p5: { puntaje: 1, evidencia: '[FICTICIO] "Los documentos existen, pero no sé si se hablan entre sí."' },
      p6: { puntaje: 1, evidencia: '[FICTICIO] "Hay un listado de viviendas en zona de alto riesgo, sin ruta definida para ellas."' },
      subtotal: 4,
    },
    d3_capacidad: {
      p7: { puntaje: 1, evidencia: '[FICTICIO] "Cada secretaría ve lo suyo; a veces nos llamamos cuando hay emergencia."' },
      p8: { puntaje: 1, evidencia: '[FICTICIO] "Tenemos una persona de gestión del riesgo y varias funciones a su cargo."' },
      p9: { puntaje: 1, evidencia: '[FICTICIO] "La CAR nos ha acompañado en alguna ocasión."' },
      subtotal: 3,
    },
    d4_informacion: {
      p10: { puntaje: 1, evidencia: '[FICTICIO] "Tenemos mapas de amenaza de hace varios años."' },
      p11: { puntaje: 0, evidencia: 'No mencionado' },
      p12: { puntaje: 1, evidencia: '[FICTICIO] "Los mapas se usan cuando toca decidir dónde hacer obras de mitigación."' },
      subtotal: 2,
    },
    d5_respuestas: {
      p13: { puntaje: 1, evidencia: '[FICTICIO] "Cuando hay creciente se abre un albergue temporal en el coliseo."' },
      p14: { puntaje: 1, evidencia: '[FICTICIO] "Se ha hablado de reubicar a algunas familias, pero no hay proyecto."' },
      p15: { puntaje: 1, evidencia: '[FICTICIO] "Lo que más se necesita es vivienda, pero no hay un programa."' },
      subtotal: 3,
    },
    d6_equidad: {
      p16: { puntaje: 1, evidencia: '[FICTICIO] "Los barrios afectados son los más pobres; ahí hay muchas mujeres cabeza de hogar."' },
      p17: { puntaje: 1, evidencia: '[FICTICIO] "Los líderes de las juntas nos avisan cuando sube el río."' },
      p18: { puntaje: 0, evidencia: 'No mencionado' },
      subtotal: 2,
    },
  },
  puntaje_total: 19,
  confianza: 'media',
  dimension_mas_fuerte: 'd1_reconocimiento',
  dimension_mas_debil: 'd4_informacion',
  gaps_de_informacion: [
    'No quedó claro si existen datos sobre familias que se hayan movido a causa de las inundaciones.',
    'No se mencionaron criterios de equidad o protección diferencial en las medidas.',
  ],
}
