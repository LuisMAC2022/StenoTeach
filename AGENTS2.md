# AGENT 2 — Layout centrado y visualización contextual de estadísticas

## Objetivo
Mejorar el posicionamiento para una interfaz más balanceada: foco central al ingresar input y estadísticas visibles cuando se detiene la actividad.

## Alcance técnico
- Estructura semántica HTML.
- Estilos de layout responsivo.
- Estado de interacción (actividad/pausa).

## Cambios requeridos
1. **Estado UI**
   - Extender estado con banderas de interacción en `src/domain/model.js` o derivarlas en selector:
     - `isUserTyping`
     - `lastInputAt`

2. **Eventos e inactividad** (`src/app/wire-events.js`)
   - Al escribir, activar modo foco (`isUserTyping = true`).
   - Detectar inactividad (ej. 1200–2000 ms) para pasar a modo resumen (`isUserTyping = false`).

3. **Selector de vista** (`src/selectors/view-selectors.js`)
   - Exponer estado visual:
     - `focusMode`
     - `summaryMode`

4. **HTML semántico** (`index.html`)
   - Mantener estructura semántica (`header`, `main`, `section`, `article`, `aside`).
   - Asegurar que el panel principal de práctica sea el foco visual en `focusMode`.
   - Mantener `skip-link` y navegación por teclado.

5. **CSS** (`src/styles/layout.css`, `src/styles/components.css`)
   - `focusMode`: reducir protagonismo visual de estadísticas sin eliminar accesibilidad.
   - `summaryMode`: aumentar legibilidad y prominencia de estadísticas.
   - Mejorar balance general en desktop/tablet/mobile.
   - Mantener contraste AA y foco visible.

## Criterios de aceptación
- Al teclear: UI centrada en input/canvas, mínima distracción.
- Al pausar: estadísticas relevantes se perciben claramente.
- Sin bloqueos de teclado ni pérdida de accesibilidad.
- Performance: sin JS innecesario, sin dependencias externas.

## Requisitos de accesibilidad
- No ocultar contenido crítico a lectores de pantalla.
- Evitar ARIA redundante.
- Respetar estructura de encabezados y `main` único.
