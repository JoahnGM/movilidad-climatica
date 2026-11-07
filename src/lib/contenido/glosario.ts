// Glosario de tipos de movilidad climática, cada uno enlazado a un ejemplo colombiano.
// Definiciones redactadas a partir del glosario de la Hoja de ruta Minambiente-PNUD (2026),
// que a su vez cita a la CIDH (2024), la Iniciativa Nansen (2015) y la UNGRD (2021).
import type { TerminoGlosario } from './types'
import { LEY_2577_2026, MINAMBIENTE_PNUD_HOJA_DE_RUTA } from './fuentes'

/** Definición general que encabeza el glosario (texto actual de ContextSection, conservado). */
export const DEFINICION_MOVILIDAD_CLIMATICA =
  'La movilidad climática se refiere a las distintas formas en que las personas cambian —o no logran cambiar— su relación con el territorio como resultado de los impactos de la crisis climática. Incluye el desplazamiento, la migración, la reubicación planificada y las situaciones de inmovilidad.'

export const GLOSARIO: TerminoGlosario[] = [
  {
    id: 'desplazamiento',
    termino: 'Desplazamiento interno',
    definicion:
      'Cuando las personas deben salir de su casa de forma forzada por un desastre o para evitar sus efectos (inundaciones, deslizamientos, tormentas, erosión), sin cruzar una frontera. En Colombia, la Ley 2577 de 2026 lo reconoce como desplazamiento forzado interno por causas climáticas, ambientales o de desastres.',
    ejemploId: 'mocoa-2017',
    fuente: LEY_2577_2026,
  },
  {
    id: 'migracion',
    termino: 'Migración',
    definicion:
      'Cuando el movimiento ocurre de forma gradual, combinando factores climáticos (como la sequía o la pérdida de cosechas) con factores económicos y sociales. Suele asociarse a eventos de evolución lenta.',
    ejemploId: 'sequia-caribe-2024',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  },
  {
    id: 'inmovilidad',
    termino: 'Inmovilidad y poblaciones atrapadas',
    definicion:
      'Personas que viven en zonas expuestas y no se mueven: porque no pueden (inmovilidad involuntaria o poblaciones atrapadas, por falta de recursos o de alternativas) o porque deciden quedarse por razones culturales, económicas o sociales (inmovilidad voluntaria).',
    ejemploId: 'tierra-bomba',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  },
  {
    id: 'reubicacion-planificada',
    termino: 'Reubicación planificada o reasentamiento',
    definicion:
      'Conjunto de medidas que el Estado organiza, por iniciativa propia o a solicitud de la comunidad, para trasladar a personas que viven en zonas de alto riesgo no mitigable hacia lugares más seguros que permitan su desarrollo integral.',
    ejemploId: 'gramalote',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  },
  {
    id: 'erosion-costera',
    termino: 'Erosión costera (factor)',
    definicion:
      'Retroceso de la línea de costa por la acción del mar y de la intervención humana, que se agrava con tormentas, marejadas e inundaciones. No es un tipo de movilidad sino un factor que puede causar desplazamiento, reubicación o inmovilidad.',
    ejemploId: 'erosion-costas',
    fuente: MINAMBIENTE_PNUD_HOJA_DE_RUTA,
  },
]
