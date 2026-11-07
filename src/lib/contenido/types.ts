// Tipos del contenido editorial de la plataforma.
// Estándar: docs/estandares/contenido-y-fuentes.md · Verificación: npm run check:contenido
//
// Regla dura: sin fuente verificable no se publica. Todo ítem que la UI pueda
// mostrar lleva `publicable`; la UI solo renderiza ítems con `publicable: true`.

/** Fecha ISO `AAAA-MM-DD`. */
export type FechaISO = string

export type TipoFuente = 'primaria' | 'secundaria'

export interface Fuente {
  /** Quién produce el dato o el documento (p. ej. "IDMC", "Corte Constitucional"). */
  institucion: string
  titulo: string
  /** Año de publicación del documento (no del dato). */
  anio: number
  url: string
  consultadoEl: FechaISO
  /**
   * primaria: la institución que produce el dato lo publica ella misma
   * (norma, sentencia, informe oficial, informe de organismo internacional).
   * secundaria: prensa u otro tercero que reproduce una fuente identificada.
   */
  tipo: TipoFuente
  /** Obligatorio si `tipo` es 'secundaria': fuente oficial o institucional que el medio cita. */
  citaA?: string
}

export type Confianza = 'alta' | 'media' | 'baja'

export interface Cifra {
  /** Identificador estable en kebab-case; la UI y otros módulos lo referencian. */
  id: string
  /** Valor tal como se muestra, con separador de miles colombiano ("91.000"). */
  valor: string
  unidad?: string
  /** Qué mide, en una línea. Obligatoria si `publicable`. */
  definicion: string
  fuente: Fuente
  /** Año (o periodo) al que corresponde el dato. */
  anio: number | string
  confianza: Confianza
  notas?: string
  /** Una cifra destacada solo se publica con fuente primaria (ver estándar, regla 1). */
  publicable: boolean
}

/** Una afirmación de contenido con su respaldo. */
export interface Afirmacion {
  texto: string
  fuente?: Fuente
  /** Referencia a una `Cifra` de `cifras.ts`. */
  cifraId?: string
  /** Síntesis editorial construida a partir de afirmaciones con fuente del mismo bloque. */
  sintesis?: true
  /** Por defecto true. false = verificado insuficiente; la UI no la muestra. */
  publicable?: boolean
  notas?: string
}

export interface Ciudad {
  id: 'bogota' | 'medellin' | 'barranquilla'
  nombre: string
  contexto: Afirmacion[]
  riesgos: Afirmacion[]
  marcos: Afirmacion[]
  respuestas: Afirmacion[]
  brechas: Afirmacion[]
  /** Una frase; siempre `sintesis: true`. */
  mensajeClave: Afirmacion
  /** ¿Algún instrumento de la ciudad nombra la "movilidad climática"? */
  nombraMovilidadClimatica: { valor: boolean; afirmacion: Afirmacion }
}

export type GrupoRecurso = 'reportes' | 'guias' | 'datos-abiertos' | 'marco-legal' | 'agenda-nacional'

export interface Recurso {
  id: string
  grupo: GrupoRecurso
  titulo: string
  institucion: string
  anio: number
  url: string
  /** Una línea: para qué le sirve a un funcionario municipal. */
  paraQueSirve: string
  idioma?: 'es' | 'en' | 'es/en'
  publicable: boolean
  notas?: string
}

export type TipoMovilidad =
  | 'desplazamiento'
  | 'migracion'
  | 'inmovilidad'
  | 'reubicacion-planificada'
  | 'erosion-costera'

export interface Ejemplo {
  id: string
  tipoMovilidad: TipoMovilidad
  lugar: string
  /** 2-3 líneas. */
  texto: string
  fuente: Fuente
  /** Fuentes adicionales que respaldan partes del texto. */
  otrasFuentes?: Fuente[]
  publicable: boolean
  notas?: string
}

export interface GrupoAfectado {
  id: string
  nombre: string
  dato?: string
  fuente?: Fuente
  /** Obligación municipal más directa para este grupo. */
  obligacion: string
  /** Referencia a `Obligacion.id`. */
  obligacionId: string
  /** true cuando no existe dato desagregado oficial: la UI muestra "Sin dato desagregado". */
  sinDato?: true
  publicable: boolean
}

export interface Obligacion {
  id: string
  /** Qué le exige la ley al municipio, en una frase imperativa. */
  texto: string
  /** Norma o sentencia, p. ej. "Sentencia T-123 de 2024". */
  base: string
  fuente: Fuente
  publicable: boolean
  notas?: string
}

export interface HitoLegal {
  id: string
  /** Etiqueta corta para la línea de tiempo, p. ej. "T-123/24". */
  etiqueta: string
  fecha: FechaISO
  titulo: string
  queReconoce: string
  fuente: Fuente
  publicable: boolean
  notas?: string
}

export interface PrincipioRespuestaJusta {
  id: string
  nombre: string
  descripcion: string
  ejemplo: string
  fuente: Fuente
  publicable: boolean
}

export interface TerminoGlosario {
  id: string
  termino: string
  definicion: string
  /** Referencia a `Ejemplo.id`. */
  ejemploId: string
  fuente?: Fuente
}

export interface Texto {
  /** Coincide con el nombre del archivo en docs/contenido/textos/<id>.md */
  id: string
  titulo: string
  /** Markdown. Puede contener placeholders entre corchetes: [proveedor], [institución]… */
  cuerpo: string
  version: string
  fecha: FechaISO
}
