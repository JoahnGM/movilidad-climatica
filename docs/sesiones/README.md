# Sesiones de trabajo (orquestación)

Cada tema del plan se trabaja en una sesión separada, en su propio worktree cortado de la rama base, con un brief completo y autocontenido. Los briefs se guardan aquí para que sean reproducibles: cualquier persona o agente puede abrir la sesión con el brief tal cual.

## Ola 1 (en paralelo, sin solapamiento de archivos)

| Sesión | Rama | Toca | No toca |
|---|---|---|---|
| Seguridad & pipeline de IA | `seguridad-ia` | `src/app/api/**`, `src/lib/**` (salvo `contenido/`), `src/components/chat/**`, `src/proxy.ts`, `next.config.ts`, `package.json`, `tests/`, `eval/`, `scripts/` | componentes de UI, `globals.css`, páginas |
| Design System | `design-system` | `src/components/**` (salvo `chat/` y `ui/`), `src/app/**` páginas y `globals.css`, `src/app/ds/**` | chat, API, `src/lib/**`, `package.json` |
| Contenido & fuentes | `contenido-fuentes` | `src/lib/contenido/**`, `docs/contenido/**` | todo JSX, API, `types.ts` |
| Pilotaje & medición | `pilotaje-medicion` | `docs/piloto/**`, `src/lib/contenido/ejemplo-resultado.ts` | todo lo demás |

Orden de merge sugerido: `base/plan-y-estandares` → `pilotaje-medicion` → `contenido-fuentes` → `design-system` → `seguridad-ia` (la última porque cambia `package.json` y el chat; resolver conflictos de `package-lock.json` ahí).

## Ola 2 (después de mergear la ola 1)

Cada una construye sobre el DS y los datos de contenido ya en `main`:
1. **Páginas de confianza y encuadre**: `/sobre`, `/ejemplo`, `/metodologia`, `/recursos`, pantalla "antes de empezar", dos modos en `/diagnostico` (incluye el formulario rápido de 18 preguntas sobre `scoring.ts`), chip experimental, política de datos en el footer.
2. **Contenido en la UI**: cifras con fuente en `ContextSection`, fichas de ciudad con 6 campos, sección de derechos y justicia climática, glosario con ejemplos, tono nuevo de `RecomendacionesSection`.
3. **Chat sobre el DS**: migrar `ChatInterface` y `DiagnosticoLoader` a las primitivas.
4. **Instrumentación**: eventos de analítica y micro-encuesta según `docs/estandares/medicion-y-feedback.md`, con `npm run check:medicion`.

## Ola 3
Taller piloto con el kit de `docs/piloto/`, y ajustes a partir de sus hallazgos.
