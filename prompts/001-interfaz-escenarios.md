# Prompt original

## Fecha
2026-10-24

## Objetivo
Desarrollar la parte de interfaz, arte y escenarios del juego Héroes de la Independencia, manteniendo la base funcional del prototipo en p5.js.

## Prompt

Desarrollador B — Interfaz, arte y escenarios

Rama feature/ui-escenarios

Responsabilidad: que el juego tenga identidad visual y un flujo claro para el jugador.

Tareas prioritarias:
- Pantalla de título y menú inicial.
- Selección de los tres héroes.
- HUD: nombre del héroe, vidas, puntaje y nivel.
- Fondos y estética pixel art para los escenarios.
- Pantallas de victoria y derrota, coordinadas con el gameplay.
- Efectos de sonido o música si el resto ya está resuelto.

Archivos sugeridos: sprites.js, styles.css si existe y módulos propios de interfaz. Si index.html o game.js son compartidos, acordar quién los modifica.

Se debe respetar la base del juego y mantenerlo funcional, pero con una identidad visual más clara, un flujo de juego con menú y selección, y una presentación acorde a la temática de los héroes de la Independencia.

## Resultado general
Se implementó la fase visual y de flujo del juego: menú inicial, selección de héroes, HUD, niveles con fondos diferenciados, pantalla de victoria y derrota, y mejoras de estética. La lógica base del juego se mantiene operativa y compatibilizada con la nueva interfaz.

## Archivos del proyecto modificados
- index.html
- game.js
- sprites.js
- prompts/README.md
- prompts/001-interfaz-escenarios.md

## Validaciones realizadas
- Chequeo de sintaxis del archivo JavaScript con Node: `node --check game.js`.
- Revisión del flujo de pantallas y estados en la lógica del juego para asegurar que no se rompa el prototipo base.

## Problemas o limitaciones encontradas
- El proyecto original está basado en un prototipo mínimo sin arquitectura de UI separada; por eso se reutilizó el mismo flujo de p5.js para no romper compatibilidad.
- El audio de fondo no se agregó porque la base del juego aún tiene un audio mínimo y la tarea prioriza la interfaz visual y la progresión del jugador.

## Pendientes relevantes
- Completar audio más avanzado si el equipo del gameplay resuelve la parte sonora.
- Pulir detalles de animación y balance del gameplay en etapas posteriores.
