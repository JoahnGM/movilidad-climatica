# Evaluación parcial del Agente 2 — gemini-3-flash-preview — 2026-11-06

> **Corrida parcial y contaminada, se registra por transparencia.** 16 de 20 casos; los 4 restantes fallaron porque la clave de Google es de **nivel gratuito** (límite de 20 solicitudes/día por modelo) y en paralelo se estaba probando el chat. Las métricas por pregunta (MAE, kappa) no se conservaron: el archivo `.json` se borró antes de rehacer la corrida, que luego no se pudo repetir con este modelo por la cuota diaria. Fuente: log de consola de `npm run eval:agentes -- --proveedor gemini` (rúbrica `2026-11-06.1`, `EVAL_PAUSA_MS=6000`). La corrida completa con métricas está en el archivo de `gemini-3.5-flash` del mismo día.

## Resumen (16 casos con resultado)

| Métrica | Valor |
|---|---|
| Exactitud de nivel | 14/16 (88 %) |
| Error medio absoluto del total | 1.38 puntos |
| Sesgo del total (modelo − esperado) | +1.00 puntos |
| Latencia p50 / p95 | 5558 / 22119 ms |

## Detalle

| Caso | Nivel esperado | Total esperado | Modelo: total · nivel | Diferencia | Latencia (ms) |
|---|---|---|---|---|---|
| g01 | nivel_1 | 5 | 5 · nivel_1 | +0 | 6488 |
| g02 | nivel_1 | 9 | 9 · nivel_1 | +0 | 7850 |
| g03 | nivel_1 | 12 | 12 · nivel_1 | +0 | 3955 |
| g04 | nivel_1 | 8 | 10 · nivel_1 | +2 | 4429 |
| g05 | nivel_1 | 13 | 10 · nivel_1 | -3 | 3648 |
| g06 | nivel_2 | 14 | 15 · nivel_2 | +1 | 4687 |
| g07 | nivel_2 | 21 | 21 · nivel_2 | +0 | 4186 |
| g08 | nivel_2 | 19 | 21 · nivel_2 | +2 | 4510 |
| g09 | nivel_2 | 16 | error: cuota del nivel gratuito | — | — |
| g10 | nivel_2 | 27 | 32 · nivel_3 ✗ | +5 | 7701 |
| g11 | nivel_3 | 28 | 30 · nivel_3 | +2 | 5558 |
| g12 | nivel_3 | 33 | 33 · nivel_3 | +0 | 5505 |
| g13 | nivel_3 | 33 | 35 · nivel_3 | +2 | 5485 |
| g14 | nivel_3 | 35 | 39 · nivel_3 | +4 | 6179 |
| g15 | nivel_3 | 40 | 41 · nivel_4 ✗ | +1 | 6037 |
| g16 | nivel_4 | 41 | error: cuota del nivel gratuito | — | — |
| g17 | nivel_4 | 46 | 46 · nivel_4 | +0 | 7647 |
| g18 | nivel_4 | 48 | error: cuota del nivel gratuito | — | — |
| g19 | nivel_4 | 52 | 52 · nivel_4 | +0 | 22119 |
| g20 | nivel_4 | 44 | error: cuota del nivel gratuito | — | — |
