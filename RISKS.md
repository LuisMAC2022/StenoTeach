# Riesgo de cambio por módulo

> Visibilidad del grafo de imports: **parcial**. Este análisis cubre imports `import ... from ...` estáticos dentro de `src/**/*.js`. No confirma imports dinámicos, referencias desde HTML/CSS, ni acoplamientos en runtime fuera de ese patrón.

### src/app/wire-events.js
**Riesgo:** Alto
**Señales detectadas:**
- Es el orquestador principal del flujo de la app (bootstrapping funcional): inicializa eventos, dispara `APP_INIT` y selecciona la primera lección.
- Mezcla múltiples responsabilidades en un solo archivo: manejo de eventos DOM, evaluación de intentos, dispatch de estado, coordinación de render, integración de audio, temporizador, parser y selección de lecciones.
- Toca efectos externos: listeners sobre `window` y elementos DOM, `setTimeout`, y servicios con side effects (audio/timer).
- Cambios aquí impactan directamente transición de estado, render y timing del juego.
**Dependientes:**
- `src/app/init.js`
**Zona opaca:**
- No se puede evaluar el impacto en métricas de UX/negocio (p. ej., dificultad percibida o retención) sin reglas de producto y telemetría.

### src/reducers/app-reducer.js
**Riesgo:** Alto
**Señales detectadas:**
- Núcleo de transición de estado global (shared state): consolida casi todas las acciones del sistema.
- Parte crítica del flujo de inicialización/ejecución (toda acción pasa por este módulo durante runtime).
- Acopla responsabilidades de dominio diferentes en un único punto: progreso, historial, timer, UI flags, lección actual.
- Invoca lógica de dominio transversal (`evaluateProgression`, `pushHistory`), por lo que errores propagan inconsistencias.
**Dependientes:**
- `src/app/wire-events.js`
**Zona opaca:**
- No se puede validar compatibilidad hacia atrás de contratos de acciones sin especificación formal/event sourcing de negocio.

### src/domain/progression.js
**Riesgo:** Alto
**Señales detectadas:**
- Contiene reglas de negocio centrales de progresión de nivel y rachas (alto impacto transversal).
- Gestiona estado compartido del dominio (`currentStreak`, `bestStreak`, `difficultyLevel`, etc.).
- Una modificación incorrecta puede romper la coherencia entre niveles, timer y estadísticas derivadas.
**Dependientes:**
- `src/reducers/app-reducer.js`
**Zona opaca:**
- No se puede verificar si los umbrales (10 aciertos, 3 errores, etc.) son invariantes de negocio o heurísticas temporales.

### src/domain/model.js
**Riesgo:** Medio
**Señales detectadas:**
- Define la forma del estado inicial (tipo/contrato implícito) usado por reducer y arranque.
- Es una “fuente de verdad” para campos consumidos por selectores y renderers; cambios de esquema pueden romper múltiples rutas.
- Participa en bootstrapping vía `initialState`.
**Dependientes:**
- `src/app/init.js`
- `src/reducers/app-reducer.js`
**Zona opaca:**
- Sin tipado estático ni validaciones de esquema, no se puede medir con certeza qué consumidores externos esperan cada campo.

### src/domain/parser.js
**Riesgo:** Medio
**Señales detectadas:**
- Define transformación canónica de input del usuario a estructura de dominio (`normalized`, `active`, segmentos).
- Es reutilizado por múltiples módulos (3 dependientes), actuando como contrato de parsing/formato.
- Cambios semánticos en normalización pueden desalinear evaluación, render de teclado y presentación.
**Dependientes:**
- `src/app/wire-events.js`
- `src/selectors/view-selectors.js`
- `src/ui/canvas-renderer.js`
**Zona opaca:**
- No se puede comprobar cobertura de edge cases lingüísticos/estenográficos sin set de pruebas de dominio.

### src/services/timer-service.js
**Riesgo:** Medio
**Señales detectadas:**
- Maneja estado compartido a nivel de módulo (`timerId` singleton).
- Toca efectos externos de tiempo (`setInterval`, `clearInterval`) y coordina timeout crítico del nivel 3.
- Errores producen condiciones de carrera (timers duplicados o no limpiados).
**Dependientes:**
- `src/app/wire-events.js`
**Zona opaca:**
- No hay contexto para validar expectativas exactas de sincronización bajo tab en background o throttling del navegador.

### src/services/audio-service.js
**Riesgo:** Medio
**Señales detectadas:**
- Mantiene estado global/singleton de audio (`audioCtx`, `audioUnlocked`).
- Toca APIs externas del navegador (`AudioContext`) y políticas de interacción de usuario.
- Un cambio puede bloquear feedback sonoro o generar consumo inesperado de recursos.
**Dependientes:**
- `src/app/wire-events.js`
**Zona opaca:**
- Sin matriz de compatibilidad de navegadores/entornos, no se puede evaluar el riesgo real por plataforma.

## Ranking (mayor → menor riesgo)
1. `src/app/wire-events.js`
2. `src/reducers/app-reducer.js`
3. `src/domain/progression.js`
4. `src/domain/model.js`
5. `src/domain/parser.js`
6. `src/services/timer-service.js`
7. `src/services/audio-service.js`
