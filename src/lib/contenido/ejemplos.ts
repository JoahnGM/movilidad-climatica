// Ejemplos colombianos para las definiciones (docs/investigacion/07 §4).
// 2-3 líneas cada uno. Prensa solo como nivel 3 de la jerarquía y con `citaA`.
import type { Ejemplo } from './types'
import {
  AP_WAYUU_2025,
  BOGOTA_ALTOS_ESTANCIA,
  EL_ESPECTADOR_MOJANA,
  EL_TIEMPO_MOCOA_CONTRALORIA,
  IDMC_GRID_2025,
  LAS2ORILLAS_GRAMALOTE,
  MINAMBIENTE_EROSION_COSTERA,
  RADIO_NACIONAL_TIERRA_BOMBA,
  T_123_2024,
  T_333_2022,
} from './fuentes'

export const EJEMPLOS: Ejemplo[] = [
  {
    id: 'mocoa-2017',
    tipoMovilidad: 'desplazamiento',
    lugar: 'Mocoa (Putumayo), 2017',
    texto:
      'La avalancha de 2017 dejó más de 320 muertos. De 1.209 viviendas prometidas a las familias afectadas, en 2021 solo se habían entregado 300, según la Contraloría.',
    fuente: EL_TIEMPO_MOCOA_CONTRALORIA,
    publicable: true,
  },
  {
    id: 'saravena-t-123',
    tipoMovilidad: 'desplazamiento',
    lugar: 'Saravena (Arauca)',
    texto:
      'Una pareja campesina de adultos mayores, ya desplazada por el conflicto, perdió su casa por una inundación. Su caso llevó a la Corte Constitucional a reconocer el desplazamiento por factores ambientales (Sentencia T-123 de 2024).',
    fuente: T_123_2024,
    publicable: true,
  },
  {
    id: 'mojana-2021-2025',
    tipoMovilidad: 'desplazamiento',
    lugar: 'La Mojana (Sucre, Bolívar, Córdoba, Antioquia)',
    texto:
      'Tras la ruptura del dique de Cara de Gato en 2021, miles de familias quedaron damnificadas. El Gobierno identificó 46 predios para reasentarlas, pero no hay una cifra oficial de hogares reasentados.',
    fuente: EL_ESPECTADOR_MOJANA,
    publicable: true,
  },
  {
    id: 'sequia-caribe-2024',
    tipoMovilidad: 'migracion',
    lugar: 'Bolívar, Córdoba y Sucre, 2024',
    texto:
      'En 2024, IDMC registró por primera vez desplazamientos por sequía en Colombia: 7.900 en estos tres departamentos. La falta de agua empuja a las familias a moverse de forma gradual, no de un día para otro.',
    fuente: IDMC_GRID_2025,
    publicable: true,
  },
  {
    id: 'guajira-wayuu',
    tipoMovilidad: 'migracion',
    lugar: 'La Guajira',
    texto:
      'Familias wayuu dejan sus rancherías por la falta de agua y se instalan en asentamientos de Riohacha y Maicao, que a su vez se inundan con las lluvias. No hay una cifra consolidada de cuántas se han movido.',
    fuente: AP_WAYUU_2025,
    publicable: true,
  },
  {
    id: 'tierra-bomba',
    tipoMovilidad: 'inmovilidad',
    lugar: 'Tierra Bomba (Cartagena)',
    texto:
      'El mar ha destruido viviendas, el puesto de salud y el cementerio de esta isla. La comunidad afro pide obras de protección para quedarse, no ser reubicada.',
    fuente: RADIO_NACIONAL_TIERRA_BOMBA,
    publicable: true,
  },
  {
    id: 'gramalote',
    tipoMovilidad: 'reubicacion-planificada',
    lugar: 'Gramalote (Norte de Santander)',
    texto:
      'Un deslizamiento destruyó el pueblo en diciembre de 2010. El nuevo casco urbano se construyó en otro sitio y el Fondo Adaptación formalizó la entrega total de las viviendas en octubre de 2024, 14 años después.',
    fuente: LAS2ORILLAS_GRAMALOTE,
    publicable: true,
  },
  {
    id: 'providencia-iota',
    tipoMovilidad: 'reubicacion-planificada',
    lugar: 'Providencia (San Andrés)',
    texto:
      'Tras el huracán Iota (2020), la reconstrucción se hizo sin consultar al pueblo raizal. La Corte Constitucional protegió su derecho a la consulta previa (Sentencia T-333 de 2022).',
    fuente: T_333_2022,
    publicable: true,
  },
  {
    id: 'altos-de-la-estancia',
    tipoMovilidad: 'reubicacion-planificada',
    lugar: 'Altos de la Estancia, Ciudad Bolívar (Bogotá)',
    texto:
      'Zona de remoción en masa en ladera. Bogotá entregó 192 viviendas de interés prioritario a familias reasentadas de este sector, que vivían en riesgo no mitigable.',
    fuente: BOGOTA_ALTOS_ESTANCIA,
    notas: 'Entrega de la administración Bogotá Humana (2012-2015); la página no indica fecha exacta.',
    publicable: true,
  },
  {
    id: 'erosion-costas',
    tipoMovilidad: 'erosion-costera',
    lugar: 'Costas Caribe y Pacífica',
    texto:
      'Cerca del 33 % de la costa Caribe y el 27 % de la Pacífica tienen procesos de erosión. El mar avanza sobre playas, viviendas y cementerios, y obliga a comunidades enteras a decidir entre protegerse o moverse.',
    fuente: MINAMBIENTE_EROSION_COSTERA,
    publicable: true,
  },
]
