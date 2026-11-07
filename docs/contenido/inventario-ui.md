# Inventario del contenido actual de la UI (nov-2026)

Lectura de `ContextSection.tsx`, `CitiesSection.tsx`, `RecomendacionesSection.tsx`, `HeroSection.tsx`, `CTASection.tsx` y `Footer.tsx` en `main` (commit `f554d2e`). Cada fila dice qué pasa con el contenido al migrar a `@/lib/contenido` (ola 2).

Decisión: **conservar** (se mueve tal cual o casi), **reemplazar** (se cambia por un dato verificado), **retirar** (sin fuente; no se publica).

## ContextSection

| Contenido actual | Decisión | Nuevo lugar |
|---|---|---|
| Titular "La crisis climática está moviendo a Colombia" y párrafo de desigualdad, debilidad institucional y presión urbana | conservar (texto de encuadre, sin cifras) | queda en el componente |
| Definición "¿Qué es la movilidad climática?" | conservar, ampliada con los 4 tipos | `glosario.ts` → `DEFINICION_MOVILIDAD_CLIMATICA` |
| 5 formas: desplazamiento interno, migración, inmovilidad, poblaciones atrapadas, reubicación planificada | conservar y ampliar con ejemplo colombiano; inmovilidad y poblaciones atrapadas se unen en un término; se agrega erosión costera como factor | `glosario.ts` (`GLOSARIO`) + `ejemplos.ts` |
| Cifra "536.000 desplazamientos 2016-2022" | **retirar** (sin fuente) | `cifras.ts` → `ui-536000-2016-2022` (`publicable: false`); reemplazar por `idmc-colombia-desastres-2025` |
| Cifra "281.000 en un año (2022)" | **retirar** (no hallada en fuente primaria) | `ui-281000-2022`; reemplazar por `idmc-colombia-desastres-2024` o `-2023` |
| Cifra "9.850 personas desplazadas por cambio climático, Defensoría 2023" | **retirar** (no hallada) | `ui-9850-defensoria-2023`; reemplazar por `ungrd-2025-familias-afectadas` o `idmc-sequia-2024` |
| "Los datos oficiales… todavía subestiman su verdadera dimensión" | conservar con la nota `idmc-definicion-desplazamientos` (IDMC no publica stock por desastres) | `cifras.ts` |
| "Colombia se ha ubicado entre los países de la región con mayores niveles de desplazamiento inducido por desastres…" | reemplazar por afirmación con fuente | `cifras.ts` → `hoja-de-ruta-351000` |
| "La mayor parte de estas presiones de movilidad tienden a ser internas…" | conservar; respaldo opcional con `groundswell-america-latina-2050` | queda en el componente |
| Chips de áreas (planeación, adaptación, riesgo, vivienda, inclusión, resiliencia) | conservar | queda en el componente |

## CitiesSection

| Contenido actual | Decisión | Nuevo lugar |
|---|---|---|
| Estructura: tagline, nivel, contexto, fortalezas, brechas, zonas | reemplazar por la plantilla de 6 campos | `ciudades.ts` |
| **Nivel asignado a cada ciudad** (Bogotá "Integración institucional en desarrollo", Medellín "Reconocimiento parcial", Barranquilla "Respuesta reactiva") | **retirar**: ninguna ciudad hizo el diagnóstico; asignarles un nivel oficial de la matriz sin evaluación contradice el principio anti-alucinación | — |
| Bogotá: "más de 50.000 personas en rondas de ríos y humedales en riesgo no mitigable" | **retirar** (sin fuente) | `ui-bogota-50000-rondas`; reemplazar por `bogota-cvp-familias-gestion` |
| Bogotá: "POMCA Río Bogotá con mapas de amenaza actualizados (2022)", "POT 2021 incorpora lenguaje de cambio climático y reubicación", "déficit de coordinación IDIGER-SDA", "reubicaciones sin seguimiento post-traslado" | retirar las que no tienen fuente; el POT 2021 se conserva con fuente | `ciudades.ts` (marcos) |
| Medellín: "DAGRD con capacidad técnica robusta", "mapa geotécnico actualizado", "sin ruta de acogida para desplazados del Oriente Antioqueño" | retirar (sin fuente) | reemplazadas por afirmaciones con fuente en `ciudades.ts` |
| Barranquilla: "temperaturas que superan los 38 °C de forma recurrente" | **retirar** (sin fuente) | `ui-barranquilla-38-grados`; reemplazar por el estudio de Oxford sobre olas de calor |
| Barranquilla: "Plan de Manejo de la Ciénaga de Mallorquín en formulación", "Barranquilla 2036…", "drenaje pluvial en El Silencio" | retirar (sin fuente); Mallorquín se conserva vía Ecoparque con fuente Minambiente | `ciudades.ts` |
| Zonas prioritarias por ciudad | retirar salvo las respaldadas (Bogotá: Ciudad Bolívar, Usme, Bosa; Medellín: Comuna 8) | dentro de afirmaciones de `ciudades.ts` |
| Titular "Tres ciudades. Tres realidades." | conservar | queda en el componente |

## RecomendacionesSection

| Contenido actual | Decisión | Nuevo lugar |
|---|---|---|
| 8 acciones (inventariar zonas, identificar comunidades vulnerables, protocolo de emergencia, articular con el departamento, movilidad climática en el POT, reubicación preventiva, capacitar funcionarios, alertas tempranas) | conservar la sustancia; reescribir como rutas progresivas con primer paso | `docs/contenido/textos/recomendaciones-home.md` |
| "8 acciones concretas que cualquier municipio puede implementar…" | reemplazar por "rutas sugeridas, no una lista de obligaciones" | mismo texto |

## HeroSection y CTASection

| Contenido actual | Decisión | Nuevo lugar |
|---|---|---|
| "Diagnostica tu territorio. Actúa con datos.", "Basado en investigación sobre gobernanza local y movilidad climática en Colombia" | conservar | queda en el componente |
| CTA: "Describes tu territorio… sin formularios ni escalas" | revisar si se adoptan los dos modos (el modo A sí tiene escala) | `dos-modos.md` |
| "Gratuito · Sin registro · Resultados inmediatos" | conservar; agregar el chip "Piloto experimental" (plan §3.1) | queda en el componente |

## Footer

| Contenido actual | Decisión | Nuevo lugar |
|---|---|---|
| Política de privacidad (menciona Gemini, "no recopilamos datos personales", abril 2026) | reemplazar: debe reflejar el proveedor real, la retención y el marco SIC/DNP | `politica-de-datos.md` (con placeholders) |
| "Desarrollada en el marco de investigación sobre gobernanza local…" | conservar hasta definir autoría | `sobre.md` → `[institución]`, `[financiador]` |
| Contacto: Laura Serna, correo de contacto | conservar; decidir si es el contacto oficial para objeciones | `sobre.md` → `[correo de contacto]`, `[correo para objeciones]` |
