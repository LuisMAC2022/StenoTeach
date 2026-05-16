# AGENT 1 — Métricas de precisión y rachas

## Objetivo
Implementar nuevas métricas de desempeño enfocadas en precisión, sin eliminar la prueba de tiempo del nivel 3.

## Alcance técnico
- Estado y dominio de progreso.
- Selectores de estadísticas.
- Render de estadísticas.
- Marcado HTML de panel de estadísticas.

## Cambios requeridos
1. **Modelo de estado** (`src/domain/model.js`)
   - Agregar:
     - `correctAttempts` (number)
     - `completedStreaks` (number)
     - `sumCompletedStreaks` (number)

2. **Lógica de progresión** (`src/domain/progression.js`)
   - En acierto:
     - Incrementar `currentStreak`.
     - Incrementar `correctAttempts`.
     - Actualizar `bestStreak`.
   - En error:
     - Si `currentStreak > 0`, cerrar racha:
       - `completedStreaks += 1`
       - `sumCompletedStreaks += currentStreak`
     - Reiniciar `currentStreak`.
   - Mantener intacta la lógica de nivel 3 con temporizador.

3. **Selector de stats** (`src/selectors/stats-selectors.js`)
   - Exponer:
     - `accuracyPct` (0–100)
     - `avgStreak`
   - Fórmulas:
     - `accuracyPct = attempts > 0 ? (correctAttempts / attempts) * 100 : 0`
     - `avgStreak = completedStreaks > 0 ? (sumCompletedStreaks / completedStreaks) : currentStreak`

4. **UI de estadísticas**
   - `index.html`: agregar outputs para:
     - Accuracy (%)
     - Average streak
   - `src/ui/dom-refs.js`: mapear nuevos nodos.
   - `src/ui/stats-renderer.js`: renderizar ambos campos.

## Criterios de aceptación
- Se mantiene “Best streak”.
- Se muestra “Accuracy (%)” y “Average streak”.
- Nivel 3 sigue mostrando timer y timeout como hoy.
- No se introducen librerías externas.

## Calidad
- Código simple y legible.
- Sin romper comportamiento existente de historial y niveles.
