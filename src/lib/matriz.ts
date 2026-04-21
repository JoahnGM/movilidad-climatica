export const NIVELES = {
  nivel_1: { min: 0,  max: 13, nombre: 'Respuesta reactiva',                     iceberg: 'iceberg_1', color: '#EF4444' },
  nivel_2: { min: 14, max: 27, nombre: 'Reconocimiento parcial del problema',     iceberg: 'iceberg_2', color: '#F59E0B' },
  nivel_3: { min: 28, max: 40, nombre: 'Integración institucional en desarrollo', iceberg: 'iceberg_3', color: '#60A5FA' },
  nivel_4: { min: 41, max: 54, nombre: 'Gobernanza sistémica en consolidación',   iceberg: 'iceberg_4', color: '#2DD4BF' },
}

export const DIMENSIONES = [
  { id: 'd1_reconocimiento', nombre: 'Reconocimiento y enfoque del problema',      preguntas: ['p1','p2','p3'] },
  { id: 'd2_instrumentos',   nombre: 'Instrumentos de planeación y política',      preguntas: ['p4','p5','p6'] },
  { id: 'd3_capacidad',      nombre: 'Capacidad institucional y articulación',     preguntas: ['p7','p8','p9'] },
  { id: 'd4_informacion',    nombre: 'Información, datos y análisis territorial',  preguntas: ['p10','p11','p12'] },
  { id: 'd5_respuestas',     nombre: 'Respuestas y rutas de actuación',            preguntas: ['p13','p14','p15'] },
  { id: 'd6_equidad',        nombre: 'Equidad, participación y justicia climática', preguntas: ['p16','p17','p18'] },
]

export const COLORES_ESTADO = {
  fortaleza:      { bg: '#2DD4BF20', border: '#2DD4BF', text: '#2DD4BF' },
  en_desarrollo:  { bg: '#60A5FA20', border: '#60A5FA', text: '#60A5FA' },
  brecha_critica: { bg: '#EF444420', border: '#EF4444', text: '#EF4444' },
}

export function getNivelFromPuntaje(puntaje: number) {
  return Object.entries(NIVELES).find(([_, v]) => puntaje >= v.min && puntaje <= v.max)?.[0] ?? 'nivel_1'
}
