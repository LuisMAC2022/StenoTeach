# Plan de migración a arquitectura modular (StenoTeach)

## Objetivo
Migrar el proyecto actual (HTML/CSS/JS inline en `index.html`) a una arquitectura modular, manteniendo el comportamiento funcional y mejorando semántica HTML5, accesibilidad (WCAG 2.1 AA) y rendimiento.

## Estructura destino

```txt
src/
  app/
    init.js
    wire-events.js
  domain/
    model.js
    parser.js
    lesson-engine.js
    progression.js
    history.js
  reducers/
    app-reducer.js
  selectors/
    stats-selectors.js
    view-selectors.js
  services/
    audio-service.js
    timer-service.js
    rng-service.js
  ui/
    dom-refs.js
    canvas-renderer.js
    history-renderer.js
    stats-renderer.js
  styles/
    tokens.css
    layout.css
    components.css
index.html
```

## Reglas de implementación

1. No romper funcionalidad existente.
2. Separar por capas: app, domain, reducers, selectors, services, ui, styles.
3. HTML5 semántico + a11y (skip link, `main` único, foco visible, labels correctos, ARIA mínimo necesario).
4. Rendimiento: eliminar CSS/JS inline, usar módulos, simplificar DOM, evitar recreación de recursos pesados.
5. Nomenclatura por responsabilidad y trazabilidad.

## Mapeo obligatorio de funciones

- `normalizeOutline`, `parseOutline`, `formatOutlineForDisplay` → `src/domain/parser.js`
- estado inicial (`currentLesson`, `currentStreak`, etc.) → `src/domain/model.js`
- lecciones y selección aleatoria → `src/domain/lesson-engine.js` + `src/services/rng-service.js`
- progresión de nivel y timeout → `src/domain/progression.js`
- historial (insertar y truncar a 10) → `src/domain/history.js`
- reducer principal → `src/reducers/app-reducer.js`
- métricas derivadas (`streak`, `best`, `timerText`) → `src/selectors/stats-selectors.js`
- datos de vista (`activeKeys`, `placeholder`, visibilidad layout) → `src/selectors/view-selectors.js`
- render de canvas (`drawRoundedRect`, `drawBoard`, `keyRects`) → `src/ui/canvas-renderer.js`
- render de historial → `src/ui/history-renderer.js`
- render de stats → `src/ui/stats-renderer.js`
- refs DOM centralizadas → `src/ui/dom-refs.js`
- audio (`ensureAudioContext`, `unlockAudio`, `playTone`) → `src/services/audio-service.js`
- timer (`clearLevel3Timer`, `restartLevel3TimerIfNeeded`) → `src/services/timer-service.js`
- listeners/event wiring → `src/app/wire-events.js`
- bootstrap inicial → `src/app/init.js`

## Contrato mínimo de acciones (reducer)

- `APP_INIT`
- `OUTLINE_CHANGED`
- `LESSON_SELECTED`
- `ATTEMPT_EVALUATED`
- `TIMEOUT_ELAPSED`
- `LEVEL_SET`
- `LAYOUT_VISIBILITY_SET`
- `HISTORY_PUSHED`
- `NEXT_LESSON_QUEUED`
- `TIMER_TICK`
- `BACKGROUND_STATE_SET`

## Orden sugerido de ejecución

1. Extraer `parser.js` y `canvas-renderer.js`.
2. Extraer `dom-refs.js`, `stats-renderer.js`, `history-renderer.js`.
3. Extraer `audio-service.js` y `timer-service.js`.
4. Mover estado inicial a `model.js`.
5. Introducir `app-reducer.js` y acciones.
6. Crear `wire-events.js` con `dispatch` central.
7. Crear `init.js` como bootstrap.
8. Separar CSS en `tokens/layout/components`.
9. Dejar `index.html` semántico y solo con imports.

## Definición de terminado (DoD)

1. Sin JS/CSS inline en `index.html`.
2. `index.html` semántico con skip link y `main` único.
3. Comportamiento funcional conservado.
4. Estado centralizado (`model + reducer`).
5. Efectos aislados en `services`.
6. Render aislado en `ui`.
7. Selectores usados para derivaciones, sin duplicación.
8. Estructura final coincide con la estructura objetivo.
9. Código legible, mantenible y modular.
10. Resumen final con decisiones, riesgos y archivos modificados.
