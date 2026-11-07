# Estándar: Design system "Cordillera"

> Versión 1.0 · 2026-11-06 · Verificación: `npm run check:ds` · Catálogo vivo: `/ds` (ruta interna, `noindex`)

Lee esto completo antes de tocar cualquier archivo de UI. Si una regla te estorba, cámbiala aquí **y** en `scripts/check-ds.mjs` en el mismo PR.

---

## 1. Alcance

- **Tokens:** `src/app/globals.css` (único archivo con colores literales).
- **Primitivas:** `src/components/ds/**` (se importan siempre desde `@/components/ds`).
- **Componentes de dominio:** `src/components/resultado/**`, `src/components/diagnostico/**`, `src/components/chat/**`, `src/components/sections/**`, `src/components/layout/**`.
- **Páginas:** `src/app/**/page.tsx`, `layout.tsx`, `not-found.tsx`.
- **Catálogo:** `src/app/ds/**`.
- **Utilidad de clases:** `src/lib/utils.ts` (`cn` con la escala del DS para `tailwind-merge`).
- **Fuera de alcance:** `src/components/ui/**` (shadcn, no se edita a mano: se temiza con las variables de `:root`).

### Identidad en una línea

Tecnología con la sobriedad de una ONG climática. Papel cálido (`#FBFAF6`), tinta verde bosque (`#16352E`), una sola grotesca (Instrument Sans), una serif itálica para el acento humano (Instrument Serif), cifras en mono (Geist Mono) y la interfaz real del producto como ilustración. Un único efecto protagonista: la cordillera de partículas del hero.

### Punto de partida (auditoría del diseño anterior, nov-2026)

| Hallazgo | Detalle | Resolución |
|---|---|---|
| Dos fondos base | `#0A0C0F` (home, navbar) y `#0A0F1E` (diagnóstico, resultado) | Un solo `--color-background` |
| Cuatro grises "alternos" sueltos | `#111418`, `#111419`, `#0F1419`, `#131920` | `--color-background-alt` |
| 18 hex y 13 `rgba()` literales en componentes | 64 bloques `style={{…}}`; `fontFamily` en línea en 20+ lugares | Prohibidos (regla 1); clases desde tokens |
| Colores de nivel/urgencia duplicados en 3 sitios | `matriz.ts`, `RecomendacionCard`, `CitiesSection` | `components/resultado/tonos.ts` |
| Contenedores y márgenes inconsistentes | `max-w-4xl/5xl/6xl`, `px-4 sm:px-6` vs `px-6 md:px-12` | `Container` + `--space-gutter` |
| 5 estilos de botón hechos a mano | radios `lg` y `xl` mezclados | `Button` (píldora) |
| Accesibilidad | modal sin foco atrapado ni Esc; tarjetas desplegables sin `aria-expanded`; ciudades del hero con `cursor-pointer` sin ser enlaces; sin `prefers-reduced-motion`; input sin etiqueta | `Dialog`, `Disclosure`, enlaces reales, `MotionProvider`, `TextInput` |
| Enlace roto | footer `/#primeros-pasos` (no existía) | `/#recomendaciones` |
| Cifras sin fuente en el home | 536.000, 281.000, 9.850 (ver `docs/contenido/inventario-ui.md`) | `CifraConFuente` con cifras verificadas de `src/lib/contenido` |

---

## 2. Reglas obligatorias

### Tokens

1. **Ningún color literal fuera de `globals.css`.** Nada de hex, `rgb()`, `bg-[#…]`, `text-slate-400`, `bg-white`, ni `style={{ color… }}`. *Por qué:* un solo lugar para cambiar la marca y verificar contraste.
2. **Usa el token por su función, no por su apariencia:**

| Necesitas | Usa |
|---|---|
| Fondo de página / sección alterna | `bg-background` / `bg-background-alt` (vía `Section`) |
| Tarjeta de contenido / de producto | `Card variant="flat"` / `variant="raised"` |
| Mensaje clave, acento suave | `bg-sage` (`Card variant="sage"`) |
| Texto principal / de apoyo / metadato | `text-foreground` / `text-muted` / `text-subtle` |
| Texto de un tono | `text-{tono}-ink` (`green`, `blue`, `amber`, `red`, `violet`) |
| Relleno de barra, punto, badge sólido | `bg-{tono}` |
| Botón primario, burbuja del usuario | `bg-ink` + `text-on-accent` |
| Divisor / borde de control | `border-border` / `border-border-strong` |

3. **Tonos semánticos fijos:** verde = marca, fortaleza, nivel 4 · azul = información, en desarrollo, nivel 3 · ámbar = advertencia, brecha, nivel 2, datos de ejemplo · rojo = crítico, nivel 1, urgencia inmediata · violeta = IA y experimental. *Por qué:* el color nunca debe contradecir el significado entre pantallas. Mapeos en `src/components/resultado/tonos.ts`; nunca uses `NIVELES[…].color` ni `COLORES_ESTADO` de `matriz.ts` en la UI.
4. **Escala tipográfica nombrada:** `text-display` (solo hero), `text-h1`…`text-h4`, `text-lead`, `text-body`, `text-small`, `text-caption`, `text-metric`. No uses `text-xl`, `text-5xl`, etc. *Por qué:* la escala es fluida (clamp) y no necesita breakpoints.
5. **Espaciado nombrado:** `px-gutter`, `py-section`, `gap-block`, `p-card`, `gap-stack`; la escala de 4 px de Tailwind para el resto.
6. **Radios:** `rounded-control` (botones, inputs, chips: píldora) · `rounded-card` (tarjetas, 24 px) · `rounded-xl` (avisos internos).
7. **Solo modo claro.** No hay `dark:`. Ver el ADR `docs/decisiones/2026-11-06-design-system.md`.

### Primitivas (inventario)

8. **Importa desde `@/components/ds`.** No uses `src/components/ui/button` en páginas. Antes de crear un componente, busca en `/ds`.

| Primitiva | Úsala para | No la uses para |
|---|---|---|
| `Container` | Ancho máximo + gutter | Dentro de `Section` (ya lo trae) |
| `Section` | Cada sección de página (fondo, ritmo, `id`) | Bloques dentro de tarjetas |
| `SectionHeader` | Eyebrow + título + lead de sección (en escritorio: título a la izquierda, lead a la derecha) | Títulos de tarjeta |
| `PageHeader` | Páginas internas (`/sobre`, `/metodologia`, `/recursos`) | El home |
| `Reveal` | Fade-in al hacer scroll (`index` escalona) | Contenido crítico above-the-fold |
| `MotionProvider` | Una vez en `app/layout.tsx` | Anidarlo |
| `SkipLink` | Una vez en `app/layout.tsx`; cada página tiene `<main id="contenido">` | — |
| `Heading` / `Acento` | Títulos / una frase serif por título clave | Párrafos |
| `Text` / `Mono` | Todo texto / cifras y puntajes | — |
| `Card` | Features, fichas, resultado, chat | Tarjetas dentro de tarjetas |
| `Callout` | Definiciones (`nota`), avisos de IA (`ia`), límites (`advertencia`) | Párrafos normales |
| `Banner` | Vistas con datos ficticios (obligatorio) y avisos de piloto | Mensajes efímeros |
| `EmptyState` | Errores del pipeline, 404, vacíos | Avisos dentro de un flujo que funciona |
| `Dialog` | Textos legales, confirmaciones | Contenido que debe indexarse |
| `Skeleton` | Cargas cortas | Esperas de IA (usa el loader con pasos) |
| `Badge` / `Chip` | Estados y niveles / temas y "Piloto experimental" | Acciones |
| `IconTile` / `IconList` | Encabezar tarjetas / fortalezas y brechas | Botones |
| `CifraConFuente` | Toda cifra de contexto | Cifras sin fuente primaria (no se publican) |
| `Stat` | Cifras propias del producto | Cifras de contexto |
| `SourceLink` | Bajo afirmaciones y cifras | Navegación |
| `ProgressBar` | Puntajes, progreso | Cargas sin valor conocido |
| `Timeline` | Hitos con fecha (sentencias, leyes) | Pasos de un proceso |
| `Pasos` | "Cómo funciona" con la interfaz como ilustración | Avance en vivo |
| `Etapas` | Avance en vivo (progreso del diagnóstico) | Procesos estáticos |
| `Button` | Toda acción; `asChild` + `Link` para navegar | Más de un `primary` por vista |
| `TextInput` | Formularios cortos (etiqueta obligatoria) | El textarea del chat |
| `Disclosure` / `DisclosureItem` | FAQ, evidencia por pregunta | Contenido que todos deben leer |
| `Tabs` + `TabsList`/`TabsTrigger`/`TabsContent` | Fichas paralelas (ciudades) | Navegación entre páginas |
| `FeedbackThumbs` | Micro-encuesta 👍/👎 (sin persistencia) | Votaciones de más de 2 opciones |
| `FondoMontanas` | El hero del home, una vez en todo el sitio | Cualquier otra sección |
| `TituloIA` | El h1 del hero | Más de una vez por página |
| `usePlaceholderAnimado` (hook) | Placeholder que se escribe solo en el campo del hero | Formularios largos; reemplazar la etiqueta |

9. **`ds/` no tiene lógica de negocio:** no importa `@/lib/*` (salvo `@/lib/utils`), no usa `fetch` ni `localStorage`. Los datos llegan por props.
10. **Una sola vista de resultado:** `src/components/resultado/ResultadoDiagnostico.tsx` la usan el demo (`EjemploSection`, con `ejemplo`) y el resultado real del agente (`DiagnosticoSection`). Prohibido duplicarla. *Por qué:* lo que la persona ve en el ejemplo es exactamente lo que recibirá.
11. **Datos ficticios siempre etiquetados:** toda vista que renderice `EJEMPLO_DIAGNOSTICO` lleva `Banner variant="ejemplo"` con `BANNER_EJEMPLO` y el badge `EJEMPLO` (lo hacen `ResultadoDiagnostico ejemplo` y `TarjetaNivel ejemplo`).

### Composición de página

12. **Ritmo vertical:** cada sección es una `Section`; alterna `background="base"` y `"alt"`; usa `border` cuando dos secciones del mismo fondo se tocan.
13. **Anchos y huecos:** `wide` (1152 px) para secciones y navegación; títulos y párrafos limitados a `max-w-2xl`/`max-w-xl` (ya lo hace `SectionHeader`). Sin huecos: una cuadrícula de N tarjetas llena todas sus celdas (si sobra una, úsala para la definición o un mensaje clave), dos columnas vecinas tienen altura similar y los listados largos de altura variable van en filas (etiqueta + contenido), no en tarjetas sueltas.
14. **Jerarquía:** un `h1` por página (el hero o el `PageHeader`); `h2` por sección; `h3`/`h4` dentro.
15. **El producto se muestra, no se describe:** ilustra con piezas reales (`TarjetaNivel`, `ChatVistaPrevia`, `AnalisisVistaPrevia`), no con íconos genéricos ni stock.
16. **Un efecto protagonista por página.** El resto del movimiento es sutil (fade-in de 20 px).

### Microcopy y tono

17. **Español colombiano, institucional pero cercano:** tutea ("tu municipio"), frases cortas, sin jerga técnica innecesaria, sin anglicismos de marketing.
18. **Disclosure de IA = aviso + competencia + límite, siempre juntos.** Ej.: "Estás conversando con un asistente de IA (piloto). Evalúa solo lo que digas; puede equivocarse." Presenta los límites como propios de la IA generativa, no como defectos (`docs/investigacion/03-confianza-marco-institucional.md`).
19. **Alcance del resultado:** siempre el texto oficial `getTexto('alcance')` al pie del resultado.
20. **Sin fuente primaria no se publica una cifra** (`docs/estandares/contenido-y-fuentes.md`). Los textos largos y cifras viven en `src/lib/contenido`, no en el JSX.
21. **Textos oficiales del iceberg EXACTOS** (CLAUDE.md §4): vienen del resultado; la UI no los reescribe. En inglés se muestra la traducción no oficial de `src/lib/i18n/matriz.ts` (por id), con la nota "Unofficial translation".
21b. **Dos idiomas (ES fuente, EN traducción).** Ningún texto visible va escrito en un componente: los de interfaz viven en `src/lib/i18n/ui.ts` (`UI.es` / `UI.en`, el tipo obliga a que EN tenga las mismas claves) y el contenido verificado en `src/lib/contenido` (+ `traducciones/en.ts`). Server components reciben `idioma` por prop desde la página; client components usan `useIdioma()`. Las primitivas de `ds/` no conocen el idioma: sus textos por defecto (p. ej. "Fuente:", "Cerrar") se sobrescriben por props. El idioma se guarda en la cookie `idioma` (toggle `SelectorIdioma` en la navbar).

### Accesibilidad

22. **Contraste AA verificado** para cada par de tokens (tabla abajo; `check:ds` falla si un par baja del mínimo). Las barras de relleno ámbar (2.3:1 sobre papel) son decorativas: siempre van con su valor en texto (`5/9`).
23. **Foco visible:** contorno verde de 2 px (`:focus-visible`) en todo el sitio; no lo quites.
24. **Teclado:** `Tabs` (←/→, Inicio/Fin), `Disclosure` (Enter/Espacio, ↑/↓), `Dialog` (foco atrapado, Esc). Todo botón solo con ícono lleva `aria-label`.
25. **Semántica:** `role="progressbar"` con valores en `ProgressBar`; `aria-current="step"` en `Etapas`; `role="log"` en el chat; `role="note"` en avisos; el color nunca es la única señal.
26. **Movimiento reducido:** `MotionProvider` (`reducedMotion="user"`) + regla global en `globals.css`; `FondoMontanas` queda quieta y `TituloIA` aparece completo.

| Token | Uso | Mínimo | Peor caso (fondo) |
|---|---|---|---|
| `foreground` | Texto | 4.5 | 11.21 (sage) |
| `muted` | Texto | 4.5 | 6.50 (sage) |
| `subtle` | Texto | 4.5 | 4.84 (sage) |
| `green-ink` | Texto | 4.5 | 5.42 (sage) |
| `blue-ink` | Texto | 4.5 | 4.57 (sage) |
| `amber-ink` | Texto | 4.5 | 5.00 (sage) |
| `red-ink` | Texto | 4.5 | 5.34 (sage) |
| `violet-ink` | Texto | 4.5 | 6.26 (sage) |
| `border-strong` | Borde de control | 3 | 3.32 (sage) |
| `green` / `blue` / `red` / `violet` | Íconos y bordes | 3 | 3.89 (`red` sobre sage) |
| `on-accent` sobre `ink` / `green` / `blue` / `red` / `violet` | Botón y badges sólidos | 4.5 | 4.60 (red) |
| `foreground` sobre `amber` | Badge sólido ámbar | 4.5 | 5.45 |
| `green` sobre `background` | Anillo de foco | 3 | 6.14 |

(Tabla completa con los 72 pares: `node scripts/check-ds.mjs --tabla`. En vivo: `/ds/fundamentos`.)

### Animación

27. **Duraciones:** `MOTION.fast` 150 ms (hover), `base` 300 ms (abrir/cerrar), `slow` 600 ms (entradas); curva `ease-out-soft`. `motion.ts` y `--motion-*` deben coincidir (lo verifica `check:ds`).
28. **Entradas con `Reveal`**, nunca `motion.div` suelto en páginas.
29. **Efectos pesados** (canvas, WebGL): carga solo en el cliente, máximo 30 fps, pausa fuera de pantalla y con la pestaña oculta, degradan si el equipo es lento, `aria-hidden`. Medido: `FondoMontanas` a 60 fps de página con CPU ×4.

---

## 3. Checklist antes de abrir un PR

- [ ] `npm run check:ds`, `npm run lint` y `npm run build` pasan.
- [ ] No agregué colores, tamaños ni radios fuera de los tokens.
- [ ] Usé primitivas de `@/components/ds`; si creé una nueva, tiene ficha en `/ds` (ver §6).
- [ ] Revisé la vista en escritorio (1440) y móvil (390) con el navegador integrado.
- [ ] Probé con teclado (Tab, flechas en Tabs/Disclosure, Esc en Dialog) y con movimiento reducido.
- [ ] Los datos ficticios llevan banner y badge EJEMPLO; las cifras llevan fuente.
- [ ] El aviso de IA tiene aviso + competencia + límite.
- [ ] Todo texto nuevo está en `UI.es` y `UI.en` (o en `src/lib/contenido` con su traducción); revisé la vista en los dos idiomas.
- [ ] Actualicé este estándar y su historial si cambié una regla.

## 4. Pruebas automáticas

`npm run check:ds` (`scripts/check-ds.mjs`):

| Paso | Verifica | Falla si |
|---|---|---|
| 1. Colores | `src/app/**`, `src/components/**` salvo `ui/` y `ds/` | hay hex, `rgb()`/`hsl()`, `-[#…]`, paleta por defecto (`text-slate-400`), `white`/`black`, tokens retirados (`teal`, `glass`, `*-light`), `style={{ color… }}`, colores de `matriz.ts` o `ui/button` en páginas. `PENDIENTES_MIGRACION` lista deuda conocida y falla si un archivo listado ya está limpio (trinquete). |
| 2. Catálogo | exports de `src/components/ds/index.ts` | algún componente no tiene `<Specimen nombre="…">` en `src/app/ds/**` |
| 3. Pureza | `src/components/ds/**` | importa `@/lib/*` (salvo `utils`) o usa `fetch`/`localStorage` |
| 4. Contraste | pares de `src/components/ds/contraste.json` con valores de `globals.css` | un par baja de su mínimo AA |
| 5. Movimiento | `--motion-*` vs `MOTION` | no coinciden |
| 6. Tipos | `tsc --noEmit` | hay errores |

Además, Tailwind no genera la paleta por defecto (`--color-*: initial`): una clase como `text-slate-400` no produce CSS.

## 5. Qué NO hacer

- Copiar componentes de bibliotecas de pago sin licencia (p. ej. React Bits Pro). Si se compra la licencia, se instalan con su CLI y se envuelven en una primitiva de `ds/` con tokens, respaldo estático y movimiento reducido.
- Poner un segundo efecto animado en la misma pantalla que la cordillera.
- Crear "otra" tarjeta de resultado para una página nueva: usa `ResultadoDiagnostico` o `TarjetaNivel`.
- Usar `text-xl`, `p-8 md:p-12`, `max-w-[…]` sueltos cuando existe el token.
- Tipografía en línea (`style={{ fontFamily }}`) o fuentes nuevas.
- Mostrar cifras, niveles de ciudad o afirmaciones sin fuente (ver `docs/contenido/inventario-ui.md`).
- Quitar el contorno de foco o depender solo del color para comunicar estado.
- Editar `src/components/ui/**` a mano.

## 6. Cómo extenderlo

**Agregar una primitiva nueva:**

1. Crea `src/components/ds/MiPrimitiva.tsx`: tipos exportados, variantes con `cva`, tokens del DS, `cn` de `@/lib/utils`, comentario JSDoc de una línea con su propósito. Sin datos ni lógica de negocio. `'use client'` solo si usa hooks o Radix.
2. Expórtala en `src/components/ds/index.ts` en su grupo.
3. Agrega su `<Specimen nombre="MiPrimitiva" …>` en la página del grupo en `src/app/ds/<grupo>/page.tsx` (demo, variantes, estados, código, úsala/no la uses, accesibilidad) y su nombre en `src/app/ds/_catalogo/grupos.ts`.
4. Agrega su fila a la tabla de primitivas de §2 de este estándar.
5. Corre `npm run check:ds`.

**Agregar un token:** defínelo en `@theme static` de `globals.css` con comentario de uso; si es un color de texto, agrega su par a `contraste.json`; si es de tipografía, espaciado, radio, tracking o sombra, agrégalo también al `extendTailwindMerge` de `src/lib/utils.ts` (si no, `cn` lo confunde con otra utilidad); muéstralo en `/ds/fundamentos`.

**Agregar una página:** `<main id="contenido">`, `PageHeader` (o el hero si es el home), secciones con `Section` + `SectionHeader`, `Footer` al final.

## 7. Decisiones y fuentes

- ADR: `docs/decisiones/2026-11-06-design-system.md` (dirección "Cordillera", modo claro único, primitivas propias sobre shadcn temizado, efectos propios).
- Exploración de direcciones y capturas: `docs/design-system/exploracion/`.
- Confianza y disclosure de IA: `docs/investigacion/03-confianza-marco-institucional.md`.
- Ejemplo de resultado: `docs/investigacion/08-pilotaje-ux.md` §4 y `src/lib/contenido/ejemplo-resultado.ts`.
- Contenido y fuentes: `docs/estandares/contenido-y-fuentes.md`, `docs/contenido/inventario-ui.md`.
- WCAG 2.2: 1.4.3 (contraste de texto), 1.4.11 (contraste no textual), 2.3.3 (animación desde interacciones), 2.4.7 (foco visible).

## 8. Historial

| Fecha | Versión | Cambio |
|---|---|---|
| 2026-11-06 | 1.0 | Primera versión: DS "Cordillera" (modo claro), 39 primitivas, catálogo `/ds`, `check:ds`; migración completa del sitio; diagnóstico integrado en la landing. |
| 2026-11-07 | 1.2 | Toggle ES/EN (regla 21b), `usePlaceholderAnimado` en el campo del hero, textos por defecto de `SourceLink`, `CifraConFuente`, `Dialog` y `Etapas` sobrescribibles. |
| 2026-11-07 | 1.1 | Ritmo vertical más compacto (`--space-section` 64–96 px, `--space-block` 40–56 px); `SectionHeader` en dos columnas; regla 13 sobre huecos; el campo de municipio del hero inicia el chat en la landing (`iniciarDiagnostico`). |
