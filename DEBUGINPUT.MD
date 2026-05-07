# Debug: auto-ingreso del input al completar una palabra

## Resumen del problema
El flujo de **auto-evaluación al terminar de escribir** depende de esta condición en `evaluate(false)`:

- solo evalúa si `guess.length >= target.length`.

Sin embargo, `guess` se calcula con `parsed.normalized` y **mantiene el guion `-`** hasta después de la validación de longitud, mientras que `target` normalmente no lo tiene.

## Origen exacto
En `src/app/wire-events.js`:

1. Se calcula `guess` removiendo guiones:
   - `const guess = parsed.normalized.replace(/-/g, '');`
2. Se calcula `target` removiendo guiones:
   - `const target = state.currentLesson.target.replace(/-/g, '');`
3. Pero la condición de auto-evaluación usa **otra métrica**:
   - `if (!force && guess.length < target.length) return;`

Aunque aquí `guess` ya está sin guion, el problema real emerge porque `parseOutline()` en `src/domain/parser.js` conserva `-` en `normalized`, y el flujo de validación no distingue entre:
- caracteres estructurales (como `-`),
- caracteres válidos de stroke,
- y longitud semántica real del outline.

Esto provoca comportamiento inconsistente: hay casos donde el usuario “termina de escribir” según la intención del ejercicio, pero la condición de disparo automático no se alinea con esa intención.

## Razón probable
La heurística de “finalizó entrada” está basada únicamente en longitud, en vez de basarse en un criterio de *outline completo válido*.

En steno, el `-` es separador estructural, no siempre debería influir en la decisión de cuándo auto-enviar; además, la longitud por sí sola no representa completitud real.

## Solución recomendada

### Opción mínima (rápida)
Normalizar de forma consistente **antes** de cualquier decisión de longitud en todo el flujo:
- comparar y medir siempre con strings equivalentes (sin separadores estructurales).
- asegurar que el mismo criterio se use para auto-evaluar y para validar acierto/error.

### Opción robusta (recomendada)
Reemplazar la regla de longitud por una regla semántica:
1. Parsear input (`parseOutline`).
2. Determinar si el outline es “completo” según patrón de la lección/target.
3. Solo entonces disparar auto-evaluación.

Esto evita falsos positivos/negativos al escribir guiones, combinaciones vocálicas o patrones de distinta estructura.

## Propuesta concreta de cambio
- Introducir una función de utilidad (ej. `isReadyForAutoSubmit(parsed, target)`), usada por `evaluate(false)`.
- Esa función debe:
  - ignorar separadores (`-`, `/`, espacios),
  - usar el mismo esquema de normalización que la comparación final,
  - validar completitud por contenido y no solo por longitud.

## Beneficio esperado
- El auto-ingreso se vuelve predecible y consistente.
- El usuario no necesita presionar Enter cuando ya completó correctamente el outline.
- Menos errores de evaluación temprana o tardía.
