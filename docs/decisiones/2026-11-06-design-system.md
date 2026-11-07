# ADR: Design system "Cordillera" — modo claro, primitivas propias y diagnóstico en la landing

Fecha: 2026-11-06 · Estado: aceptada · Estándar: `docs/estandares/design-system.md`

## Contexto

El sitio del MVP usaba un tema oscuro (`#0A0C0F`/`#0A0F1E`, teal, glassmorphism, Syne) con colores literales repartidos en 64 bloques `style={{…}}`, dos fondos base distintos y componentes hechos a mano. El equipo pidió un sitio que inspire confianza, de calidad "world class" y tecnológico sin perder la línea ONG ni el tema climático, con referencias explícitas (Versine, Habu, Trepo, React Bits). Se exploraron cuatro direcciones (A Preciso, B Territorio, C Observatorio, D Cordillera; capturas en `docs/design-system/exploracion/`) y se eligió **D: Cordillera**.

## Decisión

1. **Modo claro único.** Papel cálido `#FBFAF6`, tinta verde bosque `#16352E`. Sin variante oscura. *Por qué:* el público (funcionarios municipales) proyecta en salas iluminadas, imprime y lee documentos largos; el claro sostiene mejor la sobriedad institucional. Un solo modo evita duplicar tokens y pruebas de contraste.
2. **Primitivas propias en `src/components/ds/`** sobre Radix (Accordion, Tabs, Dialog, Slot) y `cva`, en lugar de usar shadcn temizado directamente. *Por qué:* shadcn da estructura, no identidad; el sitio necesita piezas con semántica de dominio (`CifraConFuente`, `Etapas`, `Pasos`, `Banner` de ejemplo) y reglas verificables. `src/components/ui/**` se conserva y se temiza por variables (`--primary`, `--muted-foreground`…) para lo que ya lo usa.
3. **Efectos propios, no copiados.** La cordillera de partículas (`FondoMontanas`, canvas sin dependencias) y el titular con autocompletado de IA (`TituloIA`) son implementaciones originales inspiradas en React Bits Pro. No se copió código de pago. Regla: un efecto protagonista por página.
4. **Una sola vista de resultado** (`ResultadoDiagnostico`) para el demo y para el resultado real del agente.
5. **El diagnóstico vive en la landing** (sección `#diagnostico`): acceso del piloto, chat, análisis y resultado sin cambiar de página. `/diagnostico` y `/resultado` redirigen a la sección.
6. **Tipografía:** Instrument Sans (UI y títulos) + Instrument Serif itálica (acento) + Geist Mono (datos), reemplazando Syne/Inter/JetBrains Mono.

## Consecuencias

- `CLAUDE.md` §3 se actualiza para apuntar a este DS; la paleta oscura queda obsoleta.
- Las páginas nuevas de la siguiente ola (`/sobre`, `/metodologia`, `/recursos`, derechos) se construyen solo con `@/components/ds` y pasan `npm run check:ds`.
- Los iconos del iceberg (`public/icebergs/*.png`, fondo naranja) quedan visualmente desalineados con la paleta: redibujarlos es un pendiente.
- La marca (nombre "Movilidad Climática CO" y símbolo de cordillera) es provisional.
- Si se compra React Bits Pro, sus componentes entran envueltos en primitivas de `ds/` (tokens, respaldo estático, movimiento reducido).

## Alternativas descartadas

- **Mantener el tema oscuro y solo ordenarlo en tokens:** el equipo lo percibió "vibecodeado" y genérico.
- **Direcciones A/B/C:** A demasiado fintech; B sin firma visual propia; C demasiado estatal y frío. D toma lo mejor de B con una firma territorial.
- **Modo claro + oscuro:** duplica el trabajo de contraste y de revisión sin beneficio claro para el público.
- **Instalar componentes de pago copiando su código:** ilegal sin licencia.
