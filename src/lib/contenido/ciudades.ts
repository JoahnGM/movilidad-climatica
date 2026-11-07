// Casos de ciudad con la plantilla estándar de 6 campos (docs/investigacion/06-casos-ciudad.md).
// Cada afirmación lleva `fuente`, `cifraId` o `sintesis: true`. Las que no se pudieron
// confirmar quedan con `publicable: false` y una nota.
import type { Afirmacion, Ciudad } from './types'
import {
  BARRANQUILLA_MESA_CC_2021,
  BARRANQUILLA_POT_SEGUIMIENTO,
  BLU_RADIO_MEDELLIN_2025,
  BOGOTA_LA_NINA_2024,
  BOGOTA_MEPOT_2013,
  BOGOTA_PAC,
  BOGOTA_POT_555,
  BOGOTA_REASENTAMIENTO_2025,
  BOMBEROS_BOGOTA_2024,
  CVP_FICHA_EBI_8071,
  EL_COLOMBIANO_COMUNA_8_2024,
  EL_COLOMBIANO_LADERAS_2025,
  EL_HERALDO_ARROYOS_2022,
  EL_HERALDO_CAMPO_ALEGRE_2024,
  EL_HERALDO_MIGRANTES_2023,
  LEY_2577_2026,
  MEDELLIN_ACUERDO_145_2019,
  MEDELLIN_PAC_2021,
  MINAMBIENTE_MALLORQUIN_2022,
  MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  MINUTO30_POT_MEDELLIN_2026,
  PORTAFOLIO_CALOR_2026,
  T_123_2024,
  UNEP_MEDELLIN_CORREDORES,
} from './fuentes'

/** Hallazgo transversal: ninguna de las tres ciudades nombra la movilidad climática. */
export const HALLAZGO_CIUDADES: Afirmacion[] = [
  {
    texto:
      'Ninguna de las tres ciudades nombra la "movilidad climática" en su POT, su plan de gestión del riesgo o su plan de acción climática. Gestionan el riesgo y la vivienda por separado, sin un concepto que los integre.',
    sintesis: true,
    notas: 'Resultado de la revisión de instrumentos de docs/investigacion/06-casos-ciudad.md (nov-2026). Ver `nombraMovilidadClimatica` de cada ciudad.',
  },
  {
    texto:
      'El reconocimiento llega desde el nivel nacional: la Corte Constitucional (Sentencia T-123 de 2024) y el Congreso (Ley 2577 de 2026) ya reconocen el desplazamiento por causas climáticas y ambientales.',
    fuente: LEY_2577_2026,
  },
  {
    texto:
      'Minambiente y el PNUD trabajan una hoja de ruta para la política pública nacional de desplazamiento por desastres y eventos de evolución lenta (documento de trabajo, mayo de 2026).',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  },
]

export const CIUDADES: Ciudad[] = [
  // ───────────────────────────── BOGOTÁ ─────────────────────────────────
  {
    id: 'bogota',
    nombre: 'Bogotá',
    contexto: [
      {
        texto:
          'Capital con ocupación informal en laderas del sur (Ciudad Bolívar, Usme, San Cristóbal) y en zonas inundables de los ríos Bogotá y Tunjuelo.',
        fuente: BOGOTA_POT_555,
      },
      {
        texto:
          'Ejecuta el programa de reasentamiento más grande del país: la Caja de la Vivienda Popular gestiona 20.872 familias, de las cuales 10.699 ya terminaron el proceso.',
        cifraId: 'bogota-cvp-familias-gestion',
      },
    ],
    riesgos: [
      {
        texto: 'Movimientos en masa en las laderas del sur e inundaciones por desbordamiento en el occidente (Suba, Engativá, Fontibón, Kennedy, Bosa).',
        fuente: BOGOTA_MEPOT_2013,
        notas: 'Las localidades expuestas a inundación vienen de la estimación de 2013; no citar la cifra de población.',
      },
      {
        texto:
          'La última estimación pública de población en zonas con amenaza de inundación es de 2013 (más de 800.000 personas) y no ha sido actualizada.',
        cifraId: 'bogota-inundacion-2013',
        publicable: false,
        notas: 'Dato de 2013; solo usar como evidencia de la brecha de información, con su año.',
      },
      {
        texto: 'Incendios forestales en los Cerros Orientales en enero y febrero de 2024: 148 hectáreas afectadas.',
        fuente: BOMBEROS_BOGOTA_2024,
      },
    ],
    marcos: [
      {
        texto:
          'POT "Bogotá Reverdece" (Decreto 555 de 2021): los asentamientos en alto riesgo no mitigable deben entrar al programa de reasentamiento.',
        fuente: BOGOTA_POT_555,
      },
      {
        texto: 'Plan de Acción Climática 2020-2050, con medidas de mitigación y de adaptación.',
        fuente: BOGOTA_PAC,
      },
      {
        texto:
          'Reparto institucional: el IDIGER identifica y registra a las familias en riesgo y la Caja de la Vivienda Popular ejecuta el reasentamiento transitorio y definitivo.',
        fuente: CVP_FICHA_EBI_8071,
      },
    ],
    respuestas: [
      {
        texto: 'Programa "Vivienda Segura": meta de 2.000 hogares reasentados en 2024-2027.',
        cifraId: 'bogota-meta-reasentamiento-2024-2027',
      },
      {
        texto: 'El 29 de octubre de 2026 entregó el reasentamiento número 420 del programa, en Bosa.',
        cifraId: 'bogota-reasentamiento-420',
      },
      {
        texto: 'Durante La Niña 2024 activó reasentamientos y reubicaciones transitorias de familias en riesgo.',
        fuente: BOGOTA_LA_NINA_2024,
      },
    ],
    brechas: [
      {
        texto: 'El reasentamiento avanza más despacio que la meta: 420 entregas en casi tres años frente a 2.000 hogares en el cuatrienio.',
        cifraId: 'bogota-reasentamiento-420',
      },
      {
        texto: 'La propia CVP reconoce que miles de familias siguen viviendo en zonas de alto riesgo no mitigable.',
        fuente: BOGOTA_REASENTAMIENTO_2025,
      },
      {
        texto: 'Los datos públicos de exposición a inundación no se actualizan desde 2013.',
        fuente: BOGOTA_MEPOT_2013,
        notas: 'Se publica la brecha (falta de actualización), no la cifra (bogota-inundacion-2013 no es publicable).',
      },
    ],
    mensajeClave: {
      texto:
        'Bogotá tiene el andamiaje institucional más completo del país, pero su reasentamiento avanza a una fracción de la demanda y aún no nombra la movilidad climática.',
      sintesis: true,
    },
    nombraMovilidadClimatica: {
      valor: false,
      afirmacion: {
        texto:
          'Ni el POT (Decreto 555 de 2021), ni el Plan Distrital de Gestión del Riesgo y Cambio Climático 2018-2030, ni el Plan de Acción Climática 2020-2050 nombran la movilidad climática; la alcaldía la mencionó solo en foros internacionales (2022).',
        fuente: BOGOTA_POT_555,
        notas: 'Revisión de instrumentos en docs/investigacion/06-casos-ciudad.md.',
      },
    },
  },

  // ───────────────────────────── MEDELLÍN ───────────────────────────────
  {
    id: 'medellin',
    nombre: 'Medellín',
    contexto: [
      {
        texto:
          'Valle estrecho con crecimiento informal en laderas, empujado por el precio del suelo, el loteo ilegal y la llegada de población desplazada por el conflicto (4.723 personas en 2024).',
        fuente: EL_COLOMBIANO_LADERAS_2025,
      },
    ],
    riesgos: [
      {
        texto:
          'Cerca del 30 % de la población (unas 780.000 personas) vive en zonas de alto riesgo por movimientos en masa, avenidas torrenciales e inundaciones.',
        fuente: BLU_RADIO_MEDELLIN_2025,
      },
      {
        texto: 'Más de 65 puntos críticos de asentamientos informales en ladera y 4.360 emergencias atendidas por el DAGRD en 2025.',
        fuente: EL_COLOMBIANO_LADERAS_2025,
      },
      {
        texto: 'El Plan de Acción Climática proyecta más días de calor extremo hacia 2040-2050.',
        fuente: MEDELLIN_PAC_2021,
      },
    ],
    marcos: [
      {
        texto:
          'POT vigente: Acuerdo 48 de 2014. Su revisión (Proyecto de Acuerdo 104 de 2026) fue aprobada en primer debate el 19 de octubre de 2026 e incluye adaptación al cambio climático en laderas.',
        fuente: MINUTO30_POT_MEDELLIN_2026,
      },
      {
        texto: 'Plan de Acción Climática 2020-2050, con un eje de adaptación y gestión del riesgo de desastres.',
        fuente: MEDELLIN_PAC_2021,
      },
      {
        texto:
          'Política Pública de Protección a Moradores, Actividades Económicas y Productivas (Acuerdo 145 de 2019), que regula cómo se protege a los habitantes en obras públicas, renovación urbana y obras de gestión del riesgo.',
        fuente: MEDELLIN_ACUERDO_145_2019,
      },
    ],
    respuestas: [
      {
        texto: 'Corredores Verdes: más de 30 corredores que reducen hasta 2 °C la temperatura en puntos de la ciudad; premiados internacionalmente.',
        fuente: UNEP_MEDELLIN_CORREDORES,
      },
      {
        texto: 'Moravia: reasentamiento del Morro entre 2004 y 2012, con reocupación posterior del sector.',
        publicable: false,
        notas: 'Fuente del informe 06 es prensa (El Colombiano) sin fecha verificada; pendiente de fuente con fecha.',
      },
    ],
    brechas: [
      {
        texto: 'Ninguna de las 25 obras del Plan de Mitigación de la Comuna 8 quedó priorizada en el Plan de Desarrollo 2024-2027.',
        fuente: EL_COLOMBIANO_COMUNA_8_2024,
      },
      {
        texto: 'La respuesta predominante ante el riesgo en ladera es la evacuación y el desalojo, no el reasentamiento preventivo.',
        sintesis: true,
        notas: 'Síntesis de la revisión de prensa y documentos de docs/investigacion/06-casos-ciudad.md.',
      },
      {
        texto: 'No hay cifra pública reciente (2023-2026) de hogares en alto riesgo no mitigable ni de reasentamientos de ISVIMED.',
        sintesis: true,
        notas: 'Ausencia constatada en docs/investigacion/05 y 06; la cifra de 2014 (medellin-riesgo-no-mitigable-pot-2014) no es publicable.',
      },
    ],
    mensajeClave: {
      texto:
        'Medellín documenta bien su riesgo de ladera y lidera en adaptación verde, pero sigue gestionando la movilidad por evacuación y desalojo, no por reasentamiento preventivo con enfoque climático.',
      sintesis: true,
    },
    nombraMovilidadClimatica: {
      valor: false,
      afirmacion: {
        texto: 'El POT de 2014 y el resumen del Plan de Acción Climática 2020-2050 no nombran la movilidad climática.',
        fuente: MEDELLIN_PAC_2021,
        notas: 'Revisado el resumen del PAC, no el documento completo.',
      },
    },
  },

  // ─────────────────────────── BARRANQUILLA ─────────────────────────────
  {
    id: 'barranquilla',
    nombre: 'Barranquilla',
    contexto: [
      {
        texto: 'Ciudad costera y ribereña en la desembocadura del río Magdalena, con una ladera suroccidental donde hay sectores declarados de alto riesgo.',
        fuente: EL_HERALDO_CAMPO_ALEGRE_2024,
      },
      {
        texto: 'Cerca de 146.600 personas extranjeras viven en la ciudad, alrededor del 10 % de la población.',
        fuente: EL_HERALDO_MIGRANTES_2023,
      },
    ],
    riesgos: [
      {
        texto: 'Arroyos urbanos que se desbordan con las lluvias por la falta de drenaje pluvial en buena parte de la ciudad.',
        fuente: EL_HERALDO_ARROYOS_2022,
      },
      {
        texto: 'Movimientos en masa en la ladera suroccidental: en noviembre de 2024 colapsó un edificio en Campo Alegre, desalojado 14 años antes.',
        fuente: EL_HERALDO_CAMPO_ALEGRE_2024,
      },
      {
        texto: 'Un estudio de la Universidad de Oxford la ubica como la ciudad de América Latina con mayor peligro por olas de calor entre 205 ciudades analizadas.',
        fuente: PORTAFOLIO_CALOR_2026,
      },
    ],
    marcos: [
      {
        texto: 'POT 2012-2032 (Decreto 0212 de 2014), con documento de seguimiento y evaluación de diciembre de 2022; no se encontró una revisión adoptada.',
        fuente: BARRANQUILLA_POT_SEGUIMIENTO,
      },
      {
        texto:
          'Mesa Distrital de Cambio Climático instalada en 2021 para formular un plan integral de gestión del cambio climático. No se encontró un plan de acción climática distrital adoptado (búsqueda de noviembre de 2026).',
        fuente: BARRANQUILLA_MESA_CC_2021,
      },
    ],
    respuestas: [
      {
        texto: 'Canalización de arroyos con inversiones superiores a un billón de pesos en 12 años.',
        fuente: EL_HERALDO_ARROYOS_2022,
      },
      {
        texto: 'Ecoparque Ciénaga de Mallorquín: recuperación de cerca de 980 hectáreas de ecosistema costero.',
        fuente: MINAMBIENTE_MALLORQUIN_2022,
      },
    ],
    brechas: [
      {
        texto: 'No se encontró un programa de reasentamiento por riesgo comparable a los de Bogotá (CVP) o Medellín (ISVIMED).',
        sintesis: true,
        notas: 'Ausencia constatada en la revisión de docs/investigacion/06-casos-ciudad.md.',
      },
      {
        texto: 'No hay cifras públicas de población expuesta a inundación, erosión o movimientos en masa.',
        sintesis: true,
      },
      {
        texto: 'La respuesta se concentra en obra gris (canalización) más que en rutas de reasentamiento o protección de la población.',
        sintesis: true,
      },
    ],
    mensajeClave: {
      texto:
        'Barranquilla invierte en obra dura y en naturaleza, pero no tiene una ruta institucional de reasentamiento ni datos públicos de exposición, siendo la ciudad latinoamericana con mayor peligro por calor.',
      sintesis: true,
    },
    nombraMovilidadClimatica: {
      valor: false,
      afirmacion: {
        texto: 'Ni el POT ni el Plan Distrital de Gestión del Riesgo 2017-2032 nombran la movilidad climática; el alcalde la mencionó en foros internacionales (2023).',
        fuente: BARRANQUILLA_POT_SEGUIMIENTO,
        notas: 'Revisión de instrumentos en docs/investigacion/06-casos-ciudad.md.',
      },
    },
  },
]

/** Fuentes de contexto nacional que la sección de ciudades puede citar al pie. */
export const FUENTES_CONTEXTO_CIUDADES = [T_123_2024, LEY_2577_2026, MINAMBIENTE_PNUD_HOJA_DE_RUTA]
