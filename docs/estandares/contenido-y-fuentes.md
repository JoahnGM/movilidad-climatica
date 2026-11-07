# Estándar: contenido y fuentes

> Versión 1.0 · 6 de noviembre de 2026 · Verificación: `npm run check:contenido`
> Léelo antes de agregar o cambiar una cifra, una ciudad, un ejemplo, un recurso o un texto de la plataforma.

## 1. Alcance

Cubre todo el contenido editorial que la plataforma muestra o que alimenta la UI:

| Qué | Archivo |
|---|---|
| Tipos | `src/lib/contenido/types.ts` |
| Catálogo de fuentes | `src/lib/contenido/fuentes.ts` |
| Cifras | `src/lib/contenido/cifras.ts` |
| Casos de ciudad (Bogotá, Medellín, Barranquilla) | `src/lib/contenido/ciudades.ts` |
| Derechos: grupos, obligaciones, línea de tiempo, principios | `src/lib/contenido/derechos.ts` |
| Ejemplos colombianos y glosario | `src/lib/contenido/ejemplos.ts`, `glosario.ts` |
| Recursos | `src/lib/contenido/recursos.ts` |
| Textos largos (antes de empezar, sobre, metodología, alcance, política de datos…) | fuente editable: `docs/contenido/textos/<id>.md` → generado: `src/lib/contenido/textos.ts` |
| Punto de entrada | `src/lib/contenido/index.ts` (la UI importa de `@/lib/contenido`) |
| Registro de verificaciones | `docs/contenido/verificacion-AAAA-MM.md` |
| Prueba | `scripts/check-contenido.mjs` |

No cubre: textos oficiales del iceberg y nombres de niveles (viven en `CLAUDE.md` §4 y `src/lib/matriz.ts`, y no se parafrasean), prompts de los agentes (`docs/estandares/agentes-ia.md`) ni estilos (`docs/estandares/design-system.md`).

## 2. Reglas obligatorias

1. **Sin fuente primaria verificable no se publica una cifra.** Una `Cifra` con `publicable: true` exige `fuente.tipo: 'primaria'`, `fuente.url`, `anio`, `definicion` y `confianza` distinta de `baja`. *Por qué:* la revisión externa pidió fuente, año y definición para cada dato; una cifra destacada es lo que más se cita y se replica.
2. **Jerarquía de fuentes.** (1) Fuente primaria oficial colombiana: norma, sentencia, documento o comunicado de la entidad que produce el dato. (2) Informe de organismo internacional que produce el dato (IDMC, PNUD, Banco Mundial, ACNUR, OIM). (3) Prensa que cita una fuente oficial o institucional identificada, o reportería de agencias de noticias (AP, AFP, EFE). (4) **Nunca** blogs, opinión, redes sociales ni cifras sin autor. Los niveles 1 y 2 se marcan `tipo: 'primaria'`; el nivel 3 `tipo: 'secundaria'` con `citaA` obligatorio. *Por qué:* hace explícito qué tan cerca del dato está cada afirmación.
3. **Las afirmaciones narrativas** (ciudades, ejemplos, grupos afectados) pueden usar nivel 3, pero nunca nivel 4, y cada una lleva `fuente`, `cifraId` o `sintesis: true`. `sintesis` solo para conclusiones editoriales construidas con afirmaciones con fuente del mismo bloque (p. ej. el mensaje clave de una ciudad). *Por qué:* las ciudades y ejemplos necesitan contexto que no siempre está en documentos oficiales, pero el lector debe saber de dónde viene.
4. **Lo dudoso se marca y no se usa.** Todo ítem no verificado lleva `publicable: false` y `notas` que dicen qué falta. Nunca se estima ni se calcula una cifra a partir de otras. *Por qué:* regla dura del proyecto.
5. **Nada de `[verificar]` ni `TODO` en un ítem publicable.** *Por qué:* son marcas de trabajo pendiente.
6. **Ningún dato se escribe suelto en el JSX.** La UI importa de `@/lib/contenido` y renderiza solo ítems con `publicable: true` (en `Afirmacion`, `publicable` ausente = true). *Por qué:* un solo lugar para auditar y actualizar.
7. **Referencias válidas.** Todo `cifraId`, `ejemploId` y `obligacionId` existe; una afirmación publicable no puede apuntar a una cifra no publicable; un término del glosario no puede apuntar a un ejemplo no publicable.
8. **Desplazamientos ≠ personas.** Toda cifra de IDMC se muestra con la nota `idmc-definicion-desplazamientos`. Los "afectados" o "damnificados" de la UNGRD nunca se presentan como desplazados.
9. **Los textos largos se editan en `docs/contenido/textos/*.md`** y se regeneran con `node scripts/check-contenido.mjs --sync-textos`. Nunca se edita `textos.ts` a mano. Cada texto lleva `version` (semver) y `fecha`.
10. **Placeholders en minúscula entre corchetes** (`[proveedor]`, `[institución]`, `[financiador]`, `[versión]`); etiquetas de botón con mayúscula (`[Ver política de datos]`). Un texto con placeholders no se publica hasta que el equipo los reemplace (la prueba los lista como aviso).
11. **Correcciones vigentes** (no reintroducir): Principios de Península = 2013; la Ley 1448 de 2011 no cubre a desplazados ambientales (T-123/2024); existe la Ley 2577 de 2026 con su Registro Único de Desplazamiento Ambiental; el dato de Bogotá de >800.000 personas en amenaza de inundación es de 2013.

### Cómo citar en la UI

Toda cifra se muestra con cinco elementos, en este orden: **valor · definición en una línea · fuente (institución) · año del dato · enlace**. Ejemplo:

> **91.000** desplazamientos por desastres
> Movimientos forzados registrados en el año, no personas.
> IDMC, GRID 2025 · dato de 2024 · [ver fuente]

Para afirmaciones con fuente secundaria: "según [medio], con datos de [citaA]". Para `sinDato`: "Sin dato desagregado" (no se oculta la tarjeta).

### Tono y estilo

- Español colombiano, institucional pero cercano; tutear al funcionario ("tu municipio").
- Frases cortas, sin jerga técnica; si un término es necesario, va al glosario.
- Separador de miles con punto (91.000) y decimales con coma (22,7 millones); porcentaje con espacio (30 %).
- Fechas: "29 de mayo de 2026" en texto; `AAAA-MM-DD` en datos.
- Recomendaciones como rutas sugeridas, no obligaciones; reconocer que los municipios tienen capacidades distintas.
- Tono de quien acompaña, no de quien juzga.

## 3. Checklist antes de abrir un PR

- [ ] Leí este estándar y `docs/contenido/verificacion-*.md` más reciente.
- [ ] Toda cifra nueva o cambiada tiene fuente primaria, año, definición, `consultadoEl` y confianza.
- [ ] Abrí la fuente y leí el dato en ella (no en un resumen ni en un buscador).
- [ ] Las fuentes secundarias tienen `citaA` y no hay blogs ni opinión.
- [ ] Lo no verificado quedó `publicable: false` con `notas`.
- [ ] Si cambié un texto, edité el `.md`, subí `version`/`fecha` y corrí `--sync-textos`.
- [ ] Si una URL no se puede comprobar automáticamente, la verifiqué a mano y la agregué a `EXCEPCIONES_URL` con motivo y fecha.
- [ ] `npm run check:contenido` pasa (con red).
- [ ] Registré las verificaciones nuevas en `docs/contenido/verificacion-AAAA-MM.md`.
- [ ] Actualicé el historial de este estándar si cambió una regla.

## 4. Pruebas automáticas

`npm run check:contenido` (`scripts/check-contenido.mjs`). Requiere Node ≥ 20 y `curl` en el PATH. Transpila `src/lib/contenido/*.ts` con TypeScript a un directorio temporal y valida los datos reales. Falla si:

| Prueba | Qué verifica |
|---|---|
| a | Cada `Cifra` publicable tiene `fuente.url`, `anio`, `definicion`, fuente primaria y confianza ≠ baja; las no publicables tienen `notas`. |
| b | Cada URL de fuente o recurso publicable responde 2xx/3xx (fetch con user-agent de navegador; segundo intento con `curl`, que usa el almacén de certificados del sistema). Excepciones solo en `EXCEPCIONES_URL`, con motivo y fecha. |
| c | Todo `cifraId`, `ejemploId` y `obligacionId` existe y apunta a algo publicable cuando quien referencia es publicable. |
| d | Ningún ítem publicable contiene `[verificar]` ni `TODO`. |
| e | `tsc --noEmit` pasa en todo el proyecto. |
| extra | `textos.ts` coincide con los `.md`; ids únicos; afirmaciones con respaldo; mensaje clave con `sintesis`; fuentes secundarias con `citaA`; fechas `AAAA-MM-DD`; `sinDato` sin `dato`. |

Opciones: `--sin-red` omite (b) para trabajo local sin conexión (CI nunca la usa); `--sync-textos` regenera `textos.ts` antes de verificar. La prueba lista como aviso los placeholders pendientes de cada texto.

## 5. Qué NO hacer

- Escribir una cifra directamente en un componente ("536.000" en `ContextSection` es el ejemplo de lo que este estándar elimina).
- Usar como fuente el resumen de un buscador, un snippet o un informe interno (`docs/investigacion/`) en lugar del documento original.
- Calcular un valor (p. ej. derivar 2022 de un porcentaje de crecimiento) y presentarlo como dato.
- Presentar una proyección regional (Groundswell) como cifra de Colombia.
- Sumar "afectados" de la UNGRD y "desplazamientos" de IDMC.
- Marcar `tipo: 'primaria'` a una nota de prensa.
- Agregar una URL a `EXCEPCIONES_URL` sin haberla abierto a mano.
- Editar `src/lib/contenido/textos.ts` a mano.
- Parafrasear los textos oficiales del iceberg.

## 6. Cómo extenderlo

**Agregar o actualizar una cifra**
1. Abre la fuente primaria y ubica el dato (página, tabla o párrafo).
2. Si la fuente no está en `fuentes.ts`, agrégala ahí (`institucion`, `titulo`, `anio` de publicación, `url` directa, `consultadoEl` de hoy, `tipo`).
3. En `cifras.ts` agrega o edita la `Cifra`: `id` en kebab-case estable (no lo cambies si la UI ya lo usa), `valor` con formato colombiano, `unidad`, `definicion` en una línea, `anio` del dato, `confianza`, `notas` con página o tabla.
4. Si reemplaza a otra (p. ej. IDMC 2027 en lugar de 2026), deja la anterior y cambia la referencia en la UI; borra la vieja solo cuando nadie la referencie.
5. `npm run check:contenido`.

**Agregar una ciudad**: amplía el tipo `Ciudad['id']`, copia la plantilla de 6 campos en `ciudades.ts` y completa `nombraMovilidadClimatica` con la revisión de POT, plan de gestión del riesgo y plan de acción climática.

**Agregar un ejemplo, recurso u obligación**: agrega el ítem con su fuente; los recursos llevan una línea `paraQueSirve` desde la perspectiva de un funcionario municipal.

**Traducir al inglés**: el español es la fuente. Las traducciones viven en `src/lib/contenido/traducciones/en.ts`, indexadas por el texto original EXACTO (`TRADUCCIONES_EN`); la UI las pide con `traducir(texto, idioma)` y, si falta una, muestra el español. Fuentes, años, URLs y nombres propios (instituciones, programas, barrios) no se traducen. Si editas una afirmación o cifra que muestra el home, actualiza también su traducción: `tests/traducciones.test.ts` falla si falta. El ejemplo de resultado en inglés (`EJEMPLO_DIAGNOSTICO_EN`) conserva números, nivel e iceberg del original.

**Agregar un texto largo**: crea `docs/contenido/textos/<id>.md` con metadatos `id`, `titulo`, `version`, `fecha`, y corre `node scripts/check-contenido.mjs --sync-textos`.

**Periodicidad de revisión**

| Fuente | Cuándo publica | Revisar |
|---|---|---|
| IDMC, GRID | mayo de cada año | junio: actualizar `idmc-*` |
| UNGRD, balance anual y consolidado | fin de diciembre / enero | enero: `ungrd-*` |
| IDEAM, Comunicación Nacional | Cuarta Comunicación prevista dic-2026 | enero de 2027: reemplazar `ideam-riesgo-climatico-municipios` |
| Ley 2577: reglamentación y política pública | plazos de 6 y 8 meses desde jun-2026 | trimestral hasta que se expidan |
| Hoja de ruta Minambiente-PNUD | documento de trabajo | trimestral: ¿hay versión definitiva? |
| CVP Bogotá, ISVIMED, Barranquilla | fichas e informes de gestión anuales | semestral |
| URLs | — | cada PR (prueba b) |

**Qué hacer con cifras viejas**: si el dato tiene más de 5 años o fue superado, se etiqueta con su año visible ("dato de 2013, sin actualización") o se retira. Si no existe una cifra más reciente, la falta de actualización se publica como brecha, no la cifra (caso Bogotá 2013 en `ciudades.ts`).

## 7. Decisiones y fuentes

- ADR: [`docs/decisiones/2026-11-06-contenido-como-datos.md`](../decisiones/2026-11-06-contenido-como-datos.md).
- Investigación: `docs/investigacion/05-cifras-recursos.md`, `06-casos-ciudad.md`, `07-derechos-justicia-climatica.md`, `03-confianza-marco-institucional.md`, `04-metodologia-recomendaciones.md`.
- Verificación: [`docs/contenido/verificacion-2026-11.md`](../contenido/verificacion-2026-11.md).
- Plan: `docs/plan-feedback.md` §3.1-3.4, 4.1, 5.1-5.5 y 9.

## 8. Historial

| Fecha | Versión | Cambio |
|---|---|---|
| 2026-11-07 | 1.1 | Traducciones al inglés del contenido del home y del ejemplo (`traducciones/en.ts`, `tests/traducciones.test.ts`). |
| 2026-11-06 | 1.0 | Primera versión: contenido como datos tipados, jerarquía de fuentes, `check:contenido` con pruebas a-e, segunda ronda de verificación (Ley 2577, CVP, PAC Barranquilla, Acuerdo 145/2019, UNGRD 2025, Hoja de ruta). |
