# Contenido editorial

- **Datos** (cifras, ciudades, derechos, ejemplos, glosario, recursos): `src/lib/contenido/*.ts`. Se editan ahí, siguiendo `docs/estandares/contenido-y-fuentes.md`.
- **Textos largos**: la fuente editable es `docs/contenido/textos/<id>.md` (metadatos `id`, `titulo`, `version`, `fecha` + cuerpo en Markdown). `src/lib/contenido/textos.ts` se **genera** con:

  ```bash
  node scripts/check-contenido.mjs --sync-textos
  ```

  Al editar un texto, sube `version` y `fecha`. Los placeholders van en minúscula entre corchetes (`[proveedor]`).
- **Verificaciones**: cada ronda de verificación de fuentes queda en `verificacion-AAAA-MM.md`.
- **Inventario de la UI actual**: `inventario-ui.md` mapea cada cifra, afirmación y definición que hoy está en los componentes a su nuevo lugar o a su retiro.

| Texto | Uso previsto (ola 2) |
|---|---|
| `antes-de-empezar` | Pantalla previa al chat (4 bloques + encabezado del chat) |
| `sobre` | Página `/sobre`: ficha de transparencia algorítmica (Directiva Conjunta 007/2025) |
| `metodologia` | Página `/metodologia` (8 bloques) |
| `alcance` | Pie del resultado en `/resultado` |
| `politica-de-datos` | Modal del footer (reemplaza el texto actual) |
| `derechos-seccion` | Sección "Derechos y justicia climática" del home (datos en `derechos.ts`) |
| `dos-modos` | Tarjetas A y B en `/diagnostico` |
| `concept-note-parrafo` | Para la concept note (no se muestra en la plataforma) |
| `recomendaciones-home` | Nuevo tono de `RecomendacionesSection` |
