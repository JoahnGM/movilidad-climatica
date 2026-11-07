# Estándares always-on

> Filosofía: **no arreglamos algo hoy y ya**. Cada tema que tocamos deja un estándar vivo que cualquier persona o agente lee antes de trabajar en ese tema, con pruebas que lo verifican y un checklist que se aplica en cada PR. Lo que se construye hoy es la base de lo que se ejecute mañana.

## Qué es un estándar

Un archivo `docs/estandares/<tema>.md` que responde, en este orden:

1. **Alcance** — qué archivos, rutas y decisiones cubre.
2. **Reglas obligatorias** — numeradas, verificables, con el *por qué* en una línea.
3. **Checklist antes de abrir un PR** — casillas que el autor marca; la revisión las vuelve a marcar.
4. **Pruebas automáticas** — qué script las corre (`npm run check:<tema>`), qué verifica cada prueba y qué falla si se rompe la regla.
5. **Qué NO hacer** — anti-patrones vistos o previsibles.
6. **Cómo extenderlo** — qué pasos seguir para agregar un caso nuevo sin romper lo existente (p. ej. agregar una cifra, un componente, un prompt, un evento de analítica).
7. **Decisiones y fuentes** — enlaces a `docs/investigacion/` y a `docs/decisiones/` (ADR cortos) que sustentan las reglas.
8. **Historial** — fecha, versión, qué cambió.

## Reglas de la convención

- `CLAUDE.md` tiene **solo el índice** de estándares (sección 13). El contenido vive aquí. No duplicar.
- Cada sesión de trabajo entrega **cuatro cosas**: la implementación, su estándar, sus pruebas y la entrada de historial. Un PR sin estándar actualizado no está terminado.
- Los estándares se escriben para ser leídos por agentes de IA: frases cortas, reglas numeradas, rutas de archivo exactas, sin ambigüedad.
- Una decisión de arquitectura o de producto que condiciona el futuro se registra como ADR en `docs/decisiones/AAAA-MM-DD-<slug>.md` (contexto · decisión · consecuencias · alternativas descartadas), máximo una página.
- Cuando una regla cambia, se actualiza el estándar **y** la prueba que la verifica, en el mismo PR.
- Lo marcado **[verificar]** en `docs/plan-feedback.md` o en `docs/investigacion/` no se publica en la plataforma hasta confirmarse en fuente primaria.

## Índice previsto

| Estándar | Archivo | Sesión que lo crea | Estado |
|---|---|---|---|
| Seguridad de la API y del pipeline | `seguridad.md` | Seguridad & IA | pendiente |
| Agentes de IA: prompts, rúbrica, evaluación, proveedor | `agentes-ia.md` | Seguridad & IA | pendiente |
| Design system | `design-system.md` | Design System | pendiente |
| Contenido y fuentes | `contenido-y-fuentes.md` | Contenido & fuentes | pendiente |
| Medición, analítica y feedback | `medicion-y-feedback.md` | Pilotaje & medición | pendiente |

## Definición de terminado (aplica a toda sesión)

- [ ] La implementación cumple el alcance del brief y nada más.
- [ ] El estándar del tema existe o fue actualizado, con las 8 secciones.
- [ ] `npm run check:<tema>` existe, pasa, y está registrado en `package.json`.
- [ ] `npm run build` y `npm run lint` pasan.
- [ ] Si hubo una decisión con consecuencias futuras, hay un ADR.
- [ ] El PR describe qué se hizo, qué quedó fuera y qué requiere validación humana.
