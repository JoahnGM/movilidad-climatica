# ADR: el contenido editorial vive como datos tipados con fuente

Fecha: 2026-11-06 · Estado: aceptada · Estándar: `docs/estandares/contenido-y-fuentes.md`

## Contexto

Las cifras, casos de ciudad y textos de la plataforma estaban escritos directamente en los componentes (`ContextSection`, `CitiesSection`, `Footer`…). La revisión externa pidió citar cada dato con fuente, año y definición. Al revisarlas, tres de las tres cifras destacadas del home y varias afirmaciones de ciudades no tenían fuente verificable. Con el contenido disperso en JSX no hay forma de auditar qué está respaldado ni de impedir que vuelva a pasar.

## Decisión

1. Todo el contenido editorial vive en `src/lib/contenido/` como datos TypeScript tipados (`Cifra`, `Ciudad`, `Ejemplo`, `Recurso`, `Obligacion`…), cada ítem con su `Fuente` y un campo `publicable`.
2. Una cifra destacada se publica solo con fuente primaria (entidad que produce el dato u organismo internacional). Las afirmaciones narrativas admiten prensa que cita una fuente identificada, marcada como `secundaria` con `citaA`.
3. Los textos largos se editan en Markdown (`docs/contenido/textos/*.md`, legibles por el equipo de contenido) y un script genera `textos.ts`. Se eligió generar el `.ts` en lugar de importar `.md` en Next porque importar Markdown exige configurar un loader en `next.config.ts` (fuera del alcance de esta sesión y con riesgo de romper el build); el script además verifica que ambos estén sincronizados.
4. `npm run check:contenido` hace cumplir las reglas (fuente, año, definición, URLs vivas, referencias, marcas `[verificar]`, `tsc`).

## Consecuencias

- La UI (ola 2) importa de `@/lib/contenido` y filtra por `publicable`; ningún número se escribe en JSX.
- Agregar o cambiar una cifra es un cambio de datos revisable en un PR, con prueba automática.
- La prueba de URLs depende de la red y de sitios .gov.co inestables (certificados incompletos, bloqueos anti-bot). Se mitiga con un segundo intento vía `curl` y una lista corta de excepciones verificadas a mano, con motivo y fecha.
- Parte del contenido queda fuera de la UI hasta verificarse (p. ej. UNGRD 2024, Gramalote, cifras de Medellín). Es preferible a publicar sin respaldo.
- Hay que mantener la periodicidad de revisión (IDMC en junio, UNGRD en enero, etc.).

## Alternativas descartadas

- **CMS externo** (Sanity, Contentful): agrega un servicio, credenciales y costo para un volumen pequeño de contenido; no resuelve la verificación de fuentes por sí solo.
- **JSON plano**: sin tipos ni autocompletado; los errores de estructura aparecen en la UI y no en el PR.
- **MDX en las páginas**: mezcla contenido y presentación, y obliga a tocar `next.config.ts`; dificulta validar cada cifra por separado.
- **Dejar el contenido en los componentes con comentarios de fuente**: no es verificable automáticamente; es lo que causó el problema.
