# AGENT 3 — Modos de práctica: layout learning y vocabulary practice

## Objetivo
Agregar modos de práctica conmutables para alternar entre aprendizaje de layout y práctica de vocabulario.

## Alcance técnico
- Estado global y reducer.
- Motor de selección de lecciones.
- UI de selección de modo.
- Integración con flujo actual.

## Cambios requeridos
1. **Estado y acciones**
   - En `src/domain/model.js`, agregar `practiceMode` con valores:
     - `layout_learning`
     - `vocabulary_practice`
   - En `src/reducers/app-reducer.js`, agregar acción `MODE_SET`.

2. **Motor de lecciones** (`src/domain/lesson-engine.js`)
   - Separar datasets/estrategias por modo.
   - Exponer función tipo `pickLessonByMode(mode, poolConfig)`.

3. **Flujo principal** (`src/app/wire-events.js`)
   - Al encolar siguiente lección, usar `practiceMode`.
   - Mantener compatibilidad con progresión de niveles.

4. **UI de modo** (`index.html`, `src/ui/dom-refs.js`)
   - Añadir control accesible:
     - Preferencia: `fieldset` + `legend` + radio buttons.
   - Etiquetas claras en inglés o español consistentes con el resto del producto.

5. **Integración de estadísticas**
   - Verificar si stats son globales o por modo.
   - Si son por modo, definir estrategia (reset al cambiar o segmentación por modo).

## Criterios de aceptación
- Usuario puede cambiar modo en tiempo real.
- Cambia la fuente/estrategia de lecciones sin romper input-eval-next.
- No se rompe timer de nivel 3.
- UI accesible por teclado y lector de pantalla.

## Consideraciones de diseño
- Mantener JS mínimo.
- Estructura semántica y mantenible.
- Evitar complejidad accidental en reducer/progression.
