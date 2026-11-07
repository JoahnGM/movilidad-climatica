# ADR: Sitio en español e inglés, con el agente en inglés como modo experimental

Fecha: 2026-11-07 · Estado: aceptada · Estándares: `design-system.md` (regla 21b), `agentes-ia.md` (regla 13), `contenido-y-fuentes.md`

## Contexto

El equipo pidió un toggle de idioma para todo el sitio, incluido el agente de IA, para presentar la plataforma a aliados y financiadores internacionales. La matriz, los textos oficiales del iceberg, la rúbrica y el golden set existen y están validados solo en español.

## Decisión

1. **Español es la fuente; inglés es traducción.** Textos de interfaz en `src/lib/i18n/ui.ts`; contenido verificado traducido en `src/lib/contenido/traducciones/en.ts`, indexado por el texto original exacto (si cambia el español sin actualizar la traducción, la UI muestra el español y una prueba falla).
2. **Idioma por cookie (`idioma`), sin rutas `/en`.** El toggle guarda la cookie y refresca la página en el servidor sin perder el estado del chat. Las rutas de IA leen la misma cookie. *Por qué:* el diagnóstico vive en una sola landing y conserva su estado; no hace falta duplicar rutas.
3. **Agente en inglés con directiva añadida, no prompts traducidos.** En español el prompt no cambia. En inglés se agrega una directiva final; la rúbrica y las anclas siguen en español. Las citas se copian en el idioma original (el grounding no cambia).
4. **Textos oficiales intactos.** El resultado guarda el nombre de nivel y los textos del iceberg oficiales en español; la UI en inglés muestra una traducción no oficial por id y lo dice.
5. **Comparabilidad explícita.** Los resultados en inglés llevan `rubrica_version` = `<versión>+en`.

## Consecuencias

- La página `/` deja de ser estática (lee la cookie): se sirve por solicitud.
- Toda copia nueva necesita su versión en inglés (lo exige el tipo de `UI` y `tests/traducciones.test.ts`).
- El modo inglés del agente no está validado: hay que agregar casos en inglés al golden set antes de usarlo en un piloto real.
- Las imágenes del iceberg (`public/icebergs/*.png`) tienen texto en español dibujado: al redibujarlas, hacerlas sin texto o en dos versiones.
- El catálogo `/ds` queda en español (es documentación interna).

## Alternativas descartadas

- **Rutas por idioma (`/en`)**: duplica la landing y obliga a migrar el estado del chat entre rutas.
- **Traducir los prompts completos al inglés**: dos rúbricas que mantener sincronizadas y sin validar; la directiva añadida mantiene una sola rúbrica.
- **Traducción automática en el navegador**: sin control sobre términos institucionales ni sobre textos oficiales.
