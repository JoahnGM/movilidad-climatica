// Traducciones al inglés del contenido verificado. El español es la fuente: cada entrada se
// indexa por el texto original EXACTO, así una afirmación nueva o editada sin traducir se
// detecta (tests/traducciones.test.ts) y la UI cae al español en vez de mostrar algo viejo.
// Las fuentes, años y URLs no se traducen: se toman del objeto original.
import type { AnalisisResult, DiagnosticoResult } from '@/lib/types'
import { EJEMPLO_DIAGNOSTICO, EJEMPLO_SCORES } from '../ejemplo-resultado'

export const TRADUCCIONES_EN: Record<string, string> = {
  // ── Ciudades: Bogotá ──────────────────────────────────────────────────
  'Capital con ocupación informal en laderas del sur (Ciudad Bolívar, Usme, San Cristóbal) y en zonas inundables de los ríos Bogotá y Tunjuelo.':
    'Capital city with informal settlements on the southern hillsides (Ciudad Bolívar, Usme, San Cristóbal) and in the floodplains of the Bogotá and Tunjuelo rivers.',
  'Ejecuta el programa de reasentamiento más grande del país: la Caja de la Vivienda Popular gestiona 20.872 familias, de las cuales 10.699 ya terminaron el proceso.':
    "Runs the country's largest resettlement program: the Caja de la Vivienda Popular manages 20,872 families, 10,699 of whom have completed the process.",
  'Movimientos en masa en las laderas del sur e inundaciones por desbordamiento en el occidente (Suba, Engativá, Fontibón, Kennedy, Bosa).':
    'Landslides on the southern hillsides and river flooding in the west (Suba, Engativá, Fontibón, Kennedy, Bosa).',
  'Incendios forestales en los Cerros Orientales en enero y febrero de 2024: 148 hectáreas afectadas.':
    'Wildfires in the Eastern Hills in January and February 2024: 148 hectares affected.',
  'POT "Bogotá Reverdece" (Decreto 555 de 2021): los asentamientos en alto riesgo no mitigable deben entrar al programa de reasentamiento.':
    'Land-use plan "Bogotá Reverdece" (Decree 555 of 2021): settlements at high, non-mitigable risk must enter the resettlement program.',
  'Plan de Acción Climática 2020-2050, con medidas de mitigación y de adaptación.':
    'Climate Action Plan 2020-2050, with mitigation and adaptation measures.',
  'Reparto institucional: el IDIGER identifica y registra a las familias en riesgo y la Caja de la Vivienda Popular ejecuta el reasentamiento transitorio y definitivo.':
    'Division of roles: IDIGER identifies and registers families at risk, and the Caja de la Vivienda Popular carries out temporary and permanent resettlement.',
  'Programa "Vivienda Segura": meta de 2.000 hogares reasentados en 2024-2027.':
    '"Vivienda Segura" (Safe Housing) program: target of 2,000 households resettled in 2024-2027.',
  'El 29 de octubre de 2026 entregó el reasentamiento número 420 del programa, en Bosa.':
    'On October 29, 2026 it delivered the program’s 420th resettlement, in Bosa.',
  'Durante La Niña 2024 activó reasentamientos y reubicaciones transitorias de familias en riesgo.':
    'During La Niña 2024 it activated resettlements and temporary relocations of families at risk.',
  'El reasentamiento avanza más despacio que la meta: 420 entregas en casi tres años frente a 2.000 hogares en el cuatrienio.':
    'Resettlement is slower than the target: 420 handovers in almost three years against 2,000 households in the four-year term.',
  'La propia CVP reconoce que miles de familias siguen viviendo en zonas de alto riesgo no mitigable.':
    'The CVP itself acknowledges that thousands of families still live in high, non-mitigable risk zones.',
  'Los datos públicos de exposición a inundación no se actualizan desde 2013.':
    'Public data on flood exposure has not been updated since 2013.',
  'Bogotá tiene el andamiaje institucional más completo del país, pero su reasentamiento avanza a una fracción de la demanda y aún no nombra la movilidad climática.':
    'Bogotá has the most complete institutional framework in the country, but its resettlement covers a fraction of the need and it still does not name climate mobility.',

  // ── Ciudades: Medellín ───────────────────────────────────────────────
  'Valle estrecho con crecimiento informal en laderas, empujado por el precio del suelo, el loteo ilegal y la llegada de población desplazada por el conflicto (4.723 personas en 2024).':
    'Narrow valley with informal growth on its hillsides, driven by land prices, illegal subdivision and the arrival of people displaced by the armed conflict (4,723 people in 2024).',
  'Cerca del 30 % de la población (unas 780.000 personas) vive en zonas de alto riesgo por movimientos en masa, avenidas torrenciales e inundaciones.':
    'About 30% of the population (some 780,000 people) lives in areas at high risk of landslides, flash floods and flooding.',
  'Más de 65 puntos críticos de asentamientos informales en ladera y 4.360 emergencias atendidas por el DAGRD en 2025.':
    'More than 65 critical hotspots of informal hillside settlements, and 4,360 emergencies handled by DAGRD in 2025.',
  'El Plan de Acción Climática proyecta más días de calor extremo hacia 2040-2050.':
    'The Climate Action Plan projects more days of extreme heat by 2040-2050.',
  'POT vigente: Acuerdo 48 de 2014. Su revisión (Proyecto de Acuerdo 104 de 2026) fue aprobada en primer debate el 19 de octubre de 2026 e incluye adaptación al cambio climático en laderas.':
    'Current land-use plan: Agreement 48 of 2014. Its revision (Draft Agreement 104 of 2026) passed first debate on October 19, 2026 and includes climate adaptation on hillsides.',
  'Plan de Acción Climática 2020-2050, con un eje de adaptación y gestión del riesgo de desastres.':
    'Climate Action Plan 2020-2050, with a pillar on adaptation and disaster risk management.',
  'Política Pública de Protección a Moradores, Actividades Económicas y Productivas (Acuerdo 145 de 2019), que regula cómo se protege a los habitantes en obras públicas, renovación urbana y obras de gestión del riesgo.':
    'Public Policy for the Protection of Residents and Economic Activities (Agreement 145 of 2019), which sets how residents are protected in public works, urban renewal and risk-reduction works.',
  'Corredores Verdes: más de 30 corredores que reducen hasta 2 °C la temperatura en puntos de la ciudad; premiados internacionalmente.':
    'Green Corridors: more than 30 corridors that lower temperatures by up to 2 °C in parts of the city; internationally awarded.',
  'Ninguna de las 25 obras del Plan de Mitigación de la Comuna 8 quedó priorizada en el Plan de Desarrollo 2024-2027.':
    'None of the 25 works in the Comuna 8 Mitigation Plan was prioritized in the 2024-2027 Development Plan.',
  'La respuesta predominante ante el riesgo en ladera es la evacuación y el desalojo, no el reasentamiento preventivo.':
    'The main response to hillside risk is evacuation and eviction, not preventive resettlement.',
  'No hay cifra pública reciente (2023-2026) de hogares en alto riesgo no mitigable ni de reasentamientos de ISVIMED.':
    'There is no recent public figure (2023-2026) of households at high, non-mitigable risk, nor of ISVIMED resettlements.',
  'Medellín documenta bien su riesgo de ladera y lidera en adaptación verde, pero sigue gestionando la movilidad por evacuación y desalojo, no por reasentamiento preventivo con enfoque climático.':
    'Medellín documents its hillside risk well and leads in green adaptation, but still manages mobility through evacuation and eviction, not climate-informed preventive resettlement.',

  // ── Ciudades: Barranquilla ───────────────────────────────────────────
  'Ciudad costera y ribereña en la desembocadura del río Magdalena, con una ladera suroccidental donde hay sectores declarados de alto riesgo.':
    'Coastal and riverside city at the mouth of the Magdalena River, with a southwestern hillside that includes areas declared high-risk.',
  'Cerca de 146.600 personas extranjeras viven en la ciudad, alrededor del 10 % de la población.':
    'About 146,600 foreign nationals live in the city, around 10% of the population.',
  'Arroyos urbanos que se desbordan con las lluvias por la falta de drenaje pluvial en buena parte de la ciudad.':
    'Urban streams that overflow with the rains because much of the city lacks storm drainage.',
  'Movimientos en masa en la ladera suroccidental: en noviembre de 2024 colapsó un edificio en Campo Alegre, desalojado 14 años antes.':
    'Landslides on the southwestern hillside: in November 2024 a building collapsed in Campo Alegre, evacuated 14 years earlier.',
  'Un estudio de la Universidad de Oxford la ubica como la ciudad de América Latina con mayor peligro por olas de calor entre 205 ciudades analizadas.':
    'A University of Oxford study ranks it as the Latin American city most exposed to heatwave danger among 205 cities analyzed.',
  'POT 2012-2032 (Decreto 0212 de 2014), con documento de seguimiento y evaluación de diciembre de 2022; no se encontró una revisión adoptada.':
    'Land-use plan 2012-2032 (Decree 0212 of 2014), with a monitoring and evaluation report from December 2022; no adopted revision was found.',
  'Mesa Distrital de Cambio Climático instalada en 2021 para formular un plan integral de gestión del cambio climático. No se encontró un plan de acción climática distrital adoptado (búsqueda de noviembre de 2026).':
    'District Climate Change Board set up in 2021 to draft a comprehensive climate change management plan. No adopted district climate action plan was found (search of November 2026).',
  'Canalización de arroyos con inversiones superiores a un billón de pesos en 12 años.':
    'Stream channelization with investments of more than one trillion pesos over 12 years.',
  'Ecoparque Ciénaga de Mallorquín: recuperación de cerca de 980 hectáreas de ecosistema costero.':
    'Ciénaga de Mallorquín Eco-park: restoration of about 980 hectares of coastal ecosystem.',
  'No se encontró un programa de reasentamiento por riesgo comparable a los de Bogotá (CVP) o Medellín (ISVIMED).':
    'No risk-driven resettlement program comparable to those of Bogotá (CVP) or Medellín (ISVIMED) was found.',
  'No hay cifras públicas de población expuesta a inundación, erosión o movimientos en masa.':
    'There are no public figures on the population exposed to flooding, erosion or landslides.',
  'La respuesta se concentra en obra gris (canalización) más que en rutas de reasentamiento o protección de la población.':
    'The response focuses on grey infrastructure (channelization) rather than resettlement pathways or protection of residents.',
  'Barranquilla invierte en obra dura y en naturaleza, pero no tiene una ruta institucional de reasentamiento ni datos públicos de exposición, siendo la ciudad latinoamericana con mayor peligro por calor.':
    'Barranquilla invests in hard infrastructure and nature, but has no institutional resettlement pathway or public exposure data, despite being the Latin American city most exposed to heat danger.',

  // ── Hallazgo, definición, cifras, alcance ────────────────────────────
  'Ninguna de las tres ciudades nombra la "movilidad climática" en su POT, su plan de gestión del riesgo o su plan de acción climática. Gestionan el riesgo y la vivienda por separado, sin un concepto que los integre.':
    'None of the three cities names "climate mobility" in its land-use plan, risk management plan or climate action plan. They manage risk and housing separately, without a concept that brings them together.',
  'La movilidad climática se refiere a las distintas formas en que las personas cambian —o no logran cambiar— su relación con el territorio como resultado de los impactos de la crisis climática. Incluye el desplazamiento, la migración, la reubicación planificada y las situaciones de inmovilidad.':
    'Climate mobility refers to the different ways in which people change —or are unable to change— their relationship with their territory as a result of the impacts of the climate crisis. It includes displacement, migration, planned relocation and situations of immobility.',
  'desplazamientos por desastres': 'disaster displacements',
  'Número de movimientos forzados registrados en el año, no de personas: una misma persona puede contarse varias veces y se incluyen evacuaciones preventivas.':
    'Number of forced movements recorded in the year, not of people: the same person may be counted several times, and preventive evacuations are included.',
  'Desplazamientos por tormentas, inundaciones, sequías e incendios en 2023. Número de movimientos forzados registrados en el año, no de personas: una misma persona puede contarse varias veces y se incluyen evacuaciones preventivas.':
    'Displacements caused by storms, floods, droughts and wildfires in 2023. Number of forced movements recorded in the year, not of people: the same person may be counted several times, and preventive evacuations are included.',
  'Desplazamientos ≠ personas desplazadas': 'Displacements ≠ displaced people',
  '"Desplazamientos" cuenta los movimientos forzados ocurridos durante el año (incluye movimientos repetidos y evacuaciones). "Personas desplazadas internas" es una foto del total de personas que siguen viviendo en desplazamiento al 31 de diciembre.':
    '"Displacements" counts the forced movements that occurred during the year (including repeated movements and evacuations). "Internally displaced people" is a snapshot of the total number of people still living in displacement on December 31.',
  'Línea base orientativa generada por IA a partir de tu conversación. No sustituye un diagnóstico técnico ni un proceso participativo de planificación territorial. El nivel describe un momento, no una calificación.':
    'An indicative AI-generated baseline based on your conversation. It does not replace a technical assessment or a participatory territorial planning process. The level describes a moment in time, not a grade.',
}

/** Texto en el idioma pedido; si no hay traducción, el original en español. */
export function traducir(texto: string, idioma: 'es' | 'en'): string {
  return idioma === 'en' ? (TRADUCCIONES_EN[texto] ?? texto) : texto
}

export const BANNER_EJEMPLO_EN = 'Illustrative example with fictitious data — it does not correspond to any real municipality'

/** Ejemplo de resultado en inglés (mismos números que el original; ver ejemplo-resultado.ts). */
export const EJEMPLO_DIAGNOSTICO_EN: DiagnosticoResult = {
  ...EJEMPLO_DIAGNOSTICO,
  municipio: 'Example Municipality (fictitious)',
  resumen_territorio:
    'The Example Municipality, fictitious and category 5, with its main town next to a river that floods every rainy season, already recognizes that families in certain neighborhoods move away or come back after each flood. That recognition still lives in the experience of a few officials, not in planning instruments or defined pathways.',
  fortalezas: [
    'The person interviewed recognizes that recurring floods lead some families to move temporarily or permanently, not only to need immediate assistance (fictitious).',
    'The Municipal Risk Management Plan identifies the riverside neighborhoods as a flood hazard zone, which gives a starting point for talking with other departments (fictitious).',
  ],
  brechas: [
    'There is no record of the families who have moved because of the floods; today the information depends on the memory of officials and community leaders.',
    'Planning, environment and risk management each work on their own, and there is no forum where the issue is discussed jointly.',
    'Communities in the affected neighborhoods do not participate systematically in deciding what to do about the hazard.',
  ],
  recomendaciones: [
    {
      ...EJEMPLO_DIAGNOSTICO.recomendaciones[0],
      area: 'Information and data',
      accion:
        'As a first step, put together with risk management a simple list (a spreadsheet) of the neighborhoods that flood each season, with the approximate number of families and whether they have left or returned. No new system is needed: just start recording what is known today.',
    },
    {
      ...EJEMPLO_DIAGNOSTICO.recomendaciones[1],
      area: 'Institutional capacity',
      accion:
        'In the coming months, propose a quarterly meeting between planning, environment, risk management and social development to review that list and agree on who leads each issue. Recording the agreement in short minutes already creates a coordination pathway.',
    },
    {
      ...EJEMPLO_DIAGNOSTICO.recomendaciones[2],
      area: 'Planning instruments',
      accion:
        'In the medium term, bring what you learn into the next revision of the Land-Use Plan or the development plan, so that flood-related mobility is named and has a line of action, however small. Ask the regional environmental authority and the departmental government for technical support.',
    },
  ],
  mensaje_final:
    'Thank you for talking with us. This is a fictitious example, but it shows what a starting point looks like: it is not a grade, it is a snapshot of where the territory stands today and of the first possible steps. When you run the assessment for your own municipality, what you describe will be the basis of the result.',
}

const EVIDENCIAS_EN: Record<string, string> = {
  p1: '[FICTITIOUS] "When the river rises, families from the La Ribera neighborhood go to stay with relatives and some never come back."',
  p2: '[FICTITIOUS] "I think the risk plan mentions something about it, but I\'m not sure."',
  p3: '[FICTITIOUS] "It\'s not just about responding to the emergency; we also have to think about where people can live."',
  p4: '[FICTITIOUS] "The risk management plan identifies the riverside neighborhoods as a flood zone."',
  p5: '[FICTITIOUS] "The documents exist, but I don\'t know if they talk to each other."',
  p6: '[FICTITIOUS] "There is a list of homes in high-risk areas, with no defined pathway for them."',
  p7: '[FICTITIOUS] "Each department handles its own thing; sometimes we call each other when there\'s an emergency."',
  p8: '[FICTITIOUS] "We have one risk management person, with many responsibilities."',
  p9: '[FICTITIOUS] "The regional environmental authority has supported us on occasion."',
  p10: '[FICTITIOUS] "We have hazard maps from several years ago."',
  p12: '[FICTITIOUS] "The maps are used when we have to decide where to build mitigation works."',
  p13: '[FICTITIOUS] "When the river floods, a temporary shelter opens in the sports center."',
  p14: '[FICTITIOUS] "There has been talk of relocating some families, but there is no project."',
  p15: '[FICTITIOUS] "Housing is what\'s needed most, but there is no program."',
  p16: '[FICTITIOUS] "The affected neighborhoods are the poorest; there are many women heads of household there."',
  p17: '[FICTITIOUS] "Community board leaders warn us when the river rises."',
}

function traducirScores(s: AnalisisResult): AnalisisResult {
  const dimensiones = Object.fromEntries(
    Object.entries(s.dimensiones).map(([d, dim]) => [
      d,
      Object.fromEntries(
        Object.entries(dim).map(([k, v]) =>
          typeof v === 'object' && v !== null && 'evidencia' in v ? [k, { ...v, evidencia: EVIDENCIAS_EN[k] ?? v.evidencia }] : [k, v],
        ),
      ),
    ]),
  ) as AnalisisResult['dimensiones']
  return {
    ...s,
    municipio: EJEMPLO_DIAGNOSTICO_EN.municipio,
    dimensiones,
    gaps_de_informacion: [
      'It was not clear whether there is data on families who have moved because of the floods.',
      'No equity or differential-protection criteria were mentioned in the measures.',
    ],
  }
}

export const EJEMPLO_SCORES_EN: AnalisisResult = traducirScores(EJEMPLO_SCORES)
