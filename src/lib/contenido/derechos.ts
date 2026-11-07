// Derechos y justicia climática (docs/investigacion/07-derechos-justicia-climatica.md).
// Correcciones aplicadas: Principios de Península = 2013 (no 2023); la Ley 1448 de 2011
// no cubre a desplazados ambientales (T-123/2024); la Ley 2577/2026 existe y crea el RUDA.
import type { GrupoAfectado, HitoLegal, Obligacion, PrincipioRespuestaJusta } from './types'
import {
  ACNUR_CHOCO_2024,
  ACNUR_GUIA_REUBICACION_2015,
  ACNUR_OC_32,
  DECRETO_1807_2014,
  LAS2ORILLAS_GRAMALOTE,
  LEY_1523_2012,
  LEY_2577_2026,
  MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  ONU_ESCAZU,
  RADIO_NACIONAL_OCHA_2022,
  R4V_VICHADA_2023,
  RADIO_NACIONAL_TIERRA_BOMBA,
  T_025_2004,
  T_123_2024,
  T_333_2022,
  VANGUARDIA_WAYUU_2023,
} from './fuentes'

// ── Qué le exige la ley a tu municipio (9 obligaciones) ───────────────────

export const OBLIGACIONES: Obligacion[] = [
  {
    id: 'delimitar-zonas-riesgo',
    texto: 'Identificar y delimitar en el POT las zonas de alto riesgo no mitigable y los suelos para reasentar a quienes viven allí.',
    base: 'Decreto 1807 de 2014 (compilado en el Decreto 1077 de 2015); Ley 1523 de 2012',
    fuente: DECRETO_1807_2014,
    publicable: true,
  },
  {
    id: 'estudios-participativos',
    texto: 'Hacer estudios de riesgo con participación de la comunidad afectada y comunicar sus resultados.',
    base: 'Sentencia T-123 de 2024',
    fuente: T_123_2024,
    notas: 'En el caso concreto, la Corte ordenó a la alcaldía un estudio de riesgo participativo en un año.',
    publicable: true,
  },
  {
    id: 'prevenir-desplazamiento',
    texto: 'Adoptar medidas para prevenir el desplazamiento: reducir la exposición antes del desastre, no solo responder después.',
    base: 'Ley 2577 de 2026, arts. 4 y 6; Ley 1523 de 2012',
    fuente: LEY_2577_2026,
    publicable: true,
  },
  {
    id: 'atencion-humanitaria',
    texto: 'Garantizar atención humanitaria inmediata: alimentos, agua potable, alojamiento, salud, atención psicosocial y educación.',
    base: 'Ley 2577 de 2026, art. 3 par. 4 y art. 6; Sentencia T-123 de 2024',
    fuente: LEY_2577_2026,
    publicable: true,
  },
  {
    id: 'retorno-o-reasentamiento',
    texto:
      'Ofrecer retorno voluntario, seguro y digno o, si no es posible, reasentamiento con vivienda adecuada, servicios y fuente de ingresos acorde con la identidad cultural.',
    base: 'Ley 2577 de 2026, art. 6 (iii); Sentencia T-123 de 2024',
    fuente: T_123_2024,
    publicable: true,
  },
  {
    id: 'consulta-previa',
    texto: 'Hacer consulta previa con pueblos indígenas, afrodescendientes, raizales y palenqueros antes de decidir su reubicación o reconstrucción.',
    base: 'Sentencia T-333 de 2022',
    fuente: T_333_2022,
    publicable: true,
  },
  {
    id: 'debido-proceso-desalojos',
    texto: 'Respetar el debido proceso y ofrecer una alternativa de vivienda antes de cualquier desalojo por riesgo.',
    base: 'Sentencias T-305 de 2024 y T-547 de 2019',
    fuente: T_123_2024,
    notas: 'T-305/2024 y T-547/2019 no se leyeron en texto completo (informe 07). Verificar antes de publicar.',
    publicable: false,
  },
  {
    id: 'registro-desagregado',
    texto:
      'Orientar y acompañar a las personas afectadas para que declaren e ingresen al Registro Único de Desplazamiento Ambiental; las personerías municipales reciben las declaraciones.',
    base: 'Ley 2577 de 2026, art. 3 (incluido el parágrafo 2)',
    fuente: LEY_2577_2026,
    notas: 'La UNGRD administra el registro y tenía 8 meses desde la promulgación para implementarlo; no se verificó si ya opera.',
    publicable: true,
  },
  {
    id: 'enfoque-diferencial',
    texto: 'Aplicar enfoque diferencial: género, edad, discapacidad y pertenencia étnica en toda medida de prevención, atención y reasentamiento.',
    base: 'Ley 2577 de 2026, arts. 1 y 4 par. 3',
    fuente: LEY_2577_2026,
    publicable: true,
  },
]

// ── ¿Quiénes están en mayor riesgo? (8 grupos) ────────────────────────────

export const GRUPOS_AFECTADOS: GrupoAfectado[] = [
  {
    id: 'afro-raizales',
    nombre: 'Comunidades afrodescendientes y raizales',
    dato: 'Chocó, noviembre de 2024: las inundaciones afectaron a más de 180.000 personas, en su mayoría pueblos indígenas y comunidades afrocolombianas.',
    fuente: ACNUR_CHOCO_2024,
    obligacion: 'Consulta previa antes de reubicar o reconstruir.',
    obligacionId: 'consulta-previa',
    publicable: true,
  },
  {
    id: 'indigenas',
    nombre: 'Pueblos indígenas',
    dato: 'En 2022, el 69 % de las personas afectadas por inundaciones en Colombia pertenecían a comunidades étnicas.',
    fuente: RADIO_NACIONAL_OCHA_2022,
    obligacion: 'Consulta previa y reasentamiento acorde con su identidad cultural.',
    obligacionId: 'consulta-previa',
    publicable: true,
  },
  {
    id: 'campesinos',
    nombre: 'Población campesina',
    dato: 'La Sentencia T-123 de 2024 protegió a una pareja campesina de adultos mayores desplazada por inundaciones en Saravena (Arauca).',
    fuente: T_123_2024,
    obligacion: 'Reasentamiento con acceso a tierra y medios de vida, no solo a vivienda.',
    obligacionId: 'retorno-o-reasentamiento',
    publicable: true,
  },
  {
    id: 'mujeres-ninez',
    nombre: 'Mujeres, niñas y niños',
    obligacion: 'Enfoque diferencial de género y edad; la Ley 2577 pone énfasis en mujeres y niñas en situación de especial vulnerabilidad.',
    obligacionId: 'enfoque-diferencial',
    fuente: LEY_2577_2026,
    sinDato: true,
    publicable: true,
  },
  {
    id: 'victimas-conflicto',
    nombre: 'Víctimas del conflicto doblemente desplazadas',
    dato: 'La Corte reconoció que víctimas del conflicto ya desplazadas pueden volver a ser desplazadas por un desastre.',
    fuente: T_123_2024,
    obligacion: 'El registro ambiental es independiente del Registro Único de Víctimas: estar en uno no excluye del otro.',
    obligacionId: 'registro-desagregado',
    publicable: true,
  },
  {
    id: 'migrantes',
    nombre: 'Población migrante',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
    obligacion: 'Incluir a la población migrante en registros y caracterizaciones de afectados; la hoja de ruta nacional pide que el registro contemple a las personas migrantes.',
    obligacionId: 'registro-desagregado',
    sinDato: true,
    publicable: true,
  },
  {
    id: 'mayores-discapacidad',
    nombre: 'Personas mayores y personas con discapacidad',
    obligacion: 'Enfoque diferencial por edad y discapacidad en evacuación, atención y reasentamiento.',
    obligacionId: 'enfoque-diferencial',
    fuente: LEY_2577_2026,
    sinDato: true,
    publicable: true,
  },
  {
    id: 'asentamientos-informales',
    nombre: 'Habitantes de asentamientos informales',
    dato: 'La hoja de ruta nacional señala vivir en asentamientos informales de alta exposición como una condición previa de vulnerabilidad.',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
    obligacion: 'Identificar las zonas de riesgo no mitigable y ofrecer alternativas antes de desalojar.',
    obligacionId: 'delimitar-zonas-riesgo',
    publicable: true,
  },
]

/** Dato de contexto sobre población migrante: no verificable (r4v.info bloquea la descarga). */
export const NOTA_MIGRANTES_VICHADA = {
  texto: 'En Vichada, los asentamientos informales de población refugiada y migrante pasaron de 27 a 32 en 2023, y las inundaciones generan alta movilidad entre ellos.',
  fuente: R4V_VICHADA_2023,
  publicable: false,
  notas: 'Citado en el informe 07; el PDF de R4V responde 403 a toda descarga automática (nov-2026) y no se pudo releer.',
}

/** Dato de contexto sobre el pueblo wayuu: no publicable como cifra (fuente secundaria). */
export const NOTA_WAYUU = {
  texto: 'Sequía en La Guajira: autoridades departamentales reportaron 40 menores wayuu fallecidos en 2023.',
  fuente: VANGUARDIA_WAYUU_2023,
  publicable: false,
  notas: 'Cifra sanitaria vía prensa; no es un dato de movilidad. No hay cifra consolidada de "migrantes climáticos" wayuu.',
}

// ── Lo que ya reconoce Colombia (línea de tiempo) ─────────────────────────

export const HITOS_LEGALES: HitoLegal[] = [
  {
    id: 'hito-t-025-2004',
    etiqueta: 'T-025/04',
    fecha: '2004-01-22',
    titulo: 'Sentencia T-025 de 2004',
    queReconoce:
      'Declara el estado de cosas inconstitucional frente al desplazamiento forzado por el conflicto y fija el estándar de protección que luego se extiende al desplazamiento por causas ambientales.',
    fuente: T_025_2004,
    publicable: true,
  },
  {
    id: 'hito-t-333-2022',
    etiqueta: 'T-333/22',
    fecha: '2022-09-26',
    titulo: 'Sentencia T-333 de 2022',
    queReconoce: 'Protege el derecho a la consulta previa del pueblo raizal en la reconstrucción de Providencia tras el huracán Iota.',
    fuente: T_333_2022,
    publicable: true,
  },
  {
    id: 'hito-t-123-2024',
    etiqueta: 'T-123/24',
    fecha: '2024-04-16',
    titulo: 'Sentencia T-123 de 2024',
    queReconoce:
      'Reconoce el desplazamiento forzado interno por factores ambientales (súbitos y graduales), declara un déficit de protección y exhorta al Congreso a legislar.',
    fuente: T_123_2024,
    publicable: true,
  },
  {
    id: 'hito-escazu-2024',
    etiqueta: 'Escazú 2024',
    fecha: '2024-09-25',
    titulo: 'Colombia ratifica el Acuerdo de Escazú',
    queReconoce: 'Derechos de acceso a la información, participación y justicia en asuntos ambientales (aprobado por la Ley 2273 de 2022).',
    fuente: ONU_ESCAZU,
    publicable: true,
  },
  {
    id: 'hito-oc-32-2025',
    etiqueta: 'OC-32/25',
    fecha: '2025-07-03',
    titulo: 'Opinión Consultiva OC-32/25 de la Corte Interamericana',
    queReconoce: 'Derecho a un clima sano; la movilidad humana por causas climáticas exige atención urgente de los Estados.',
    fuente: ACNUR_OC_32,
    notas: 'Emitida el 29-may-2025 y publicada el 3-jul-2025, a solicitud de Chile y Colombia. Los párrafos sobre desplazamiento interno no se verificaron en el texto original.',
    publicable: true,
  },
  {
    id: 'hito-ley-2577',
    etiqueta: 'Ley 2577/26',
    fecha: '2026-05-29',
    titulo: 'Ley 2577 de 2026',
    queReconoce:
      'Reconoce el desplazamiento forzado interno por cambio climático, degradación ambiental y desastres; crea el Registro Único de Desplazamiento Ambiental (UNGRD) y ordena una política pública articulada con el SINA, el Sistema Nacional de Cambio Climático y el SNGRD.',
    fuente: LEY_2577_2026,
    notas: 'Texto completo leído en el Diario Oficial 53.509 (1-jun-2026). Ver docs/contenido/verificacion-2026-11.md (a).',
    publicable: true,
  },
]

// ── Qué es una respuesta justa (6 principios) ─────────────────────────────

export const PRINCIPIOS_RESPUESTA_JUSTA: PrincipioRespuestaJusta[] = [
  {
    id: 'ultimo-recurso',
    nombre: 'Reubicar es el último recurso',
    descripcion: 'Antes de trasladar a una comunidad hay que agotar las medidas para reducir el riesgo donde vive.',
    ejemplo: 'Gramalote tardó 14 años en completar su reasentamiento: trasladar un pueblo entero es largo y costoso, y solo se justifica cuando no hay otra opción.',
    fuente: ACNUR_GUIA_REUBICACION_2015,
    publicable: true,
  },
  {
    id: 'decision-informada',
    nombre: 'Decisión informada y voluntaria',
    descripcion: 'Las familias reciben información clara sobre el riesgo y deciden si retornan o se reasientan.',
    ejemplo: 'En la T-123 de 2024, la Corte dejó en manos de la familia la decisión de retornar si el riesgo es mitigable, o de reasentarse si presenta razones fundadas para no volver.',
    fuente: T_123_2024,
    publicable: true,
  },
  {
    id: 'consulta-previa',
    nombre: 'Consulta previa con pueblos étnicos',
    descripcion: 'Ninguna reubicación o reconstrucción que afecte a un pueblo étnico se decide sin consultarlo.',
    ejemplo: 'Providencia: la Corte encontró que la reconstrucción tras el huracán Iota se hizo sin consulta previa al pueblo raizal (T-333 de 2022).',
    fuente: T_333_2022,
    publicable: true,
  },
  {
    id: 'vivienda-y-medios-de-vida',
    nombre: 'Vivienda, medios de vida e identidad',
    descripcion: 'Reubicar no es trasladar casas: es trasladar vida, trabajo y comunidad. Incluye servicios, ingresos y lazos culturales.',
    ejemplo: 'La T-123 de 2024 exige acceso prioritario a vivienda y a una fuente de ingresos acorde con la identidad cultural de la familia.',
    fuente: T_123_2024,
    publicable: true,
  },
  {
    id: 'no-repeticion',
    nombre: 'No repetir el riesgo',
    descripcion: 'Nadie debe ser reasentado en otra zona de riesgo ni reconstruir las mismas condiciones que causaron el desastre.',
    ejemplo: 'La Ley 2577 de 2026 exige que los programas de rehabilitación eviten repetir las condiciones de riesgo preexistentes (art. 6).',
    fuente: LEY_2577_2026,
    publicable: true,
  },
  {
    id: 'derecho-a-permanecer',
    nombre: 'Derecho a permanecer',
    descripcion: 'Quedarse también es una decisión que merece protección: quien no puede o no quiere irse necesita medidas para vivir más seguro donde está.',
    ejemplo: 'En Tierra Bomba (Cartagena), la comunidad afro afectada por la erosión pide obras de protección y no reubicación.',
    fuente: RADIO_NACIONAL_TIERRA_BOMBA,
    publicable: true,
  },
]

/** Microcopy de la sección (docs/investigacion/07 §5). */
export const MICROCOPY_DERECHOS = [
  'Quedarse también es una decisión que merece protección.',
  'Reubicar no es trasladar casas: es trasladar vida, trabajo y comunidad.',
  'Si no hay datos sobre quién está en riesgo, el riesgo ya es una brecha.',
]

/** Correcciones de hechos que la UI y los prompts deben respetar. */
export const CORRECCIONES = [
  {
    texto: 'Los Principios de Península sobre el desplazamiento climático dentro de los Estados son de 2013, no de 2023.',
    fuente: T_123_2024,
    notas: 'La T-123/2024 los cita (nota 35). El año 2013 proviene de la edición de Displacement Solutions revisada en el informe 07.',
  },
  {
    texto: 'La Ley 1448 de 2011 (víctimas del conflicto) no cubre a las personas desplazadas por causas ambientales; la Ley 2577 de 2026 crea un registro propio, independiente del Registro Único de Víctimas.',
    fuente: LEY_2577_2026,
  },
  {
    texto: 'Ya no es exacto decir que Colombia "no tiene marco legal" para el desplazamiento climático: existe la Ley 2577 de 2026, aunque su reglamentación y la política pública estaban pendientes a la fecha de revisión.',
    fuente: LEY_2577_2026,
  },
]

/** Fuentes de contexto (no citadas arriba) que respaldan la sección. */
export const FUENTES_DERECHOS = [LEY_1523_2012, LAS2ORILLAS_GRAMALOTE]
