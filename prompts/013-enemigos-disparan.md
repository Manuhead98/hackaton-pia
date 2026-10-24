# Prompt original

## Fecha
2026-10-24

## Objetivo
Hacer que los enemigos comunes disparen al protagonista, con proyectiles que puedan esquivarse y le quiten una vida al impactar.

## Prompt

hace que los enemigos disparen

## Resultado general
Los soldados comunes ahora disparan proyectiles dirigidos a la posición actual del protagonista, con una cadencia moderada y un breve retraso inicial para permitir reaccionar. Los disparos usan el sistema ya existente de proyectiles hostiles, colisionan con el jugador y descuentan una vida respetando el tiempo de protección. Se diferencian visualmente de las ráfagas del jefe y el manual indica que deben esquivarse.

## Archivos del proyecto modificados
- game.js
- index.html
- prompts/README.md
- prompts/013-enemigos-disparan.md

## Validaciones realizadas
- `node --check game.js` y `node --check sprites.js`.
- Errores del editor: ninguno en HTML ni JavaScript.
- Prueba en navegador: un enemigo genera un disparo apuntado hacia el jugador; al colocar un proyectil enemigo sobre el personaje, el contador baja de dos vidas a una.

## Problemas o limitaciones encontradas
- Los soldados disparan en dirección al jugador al momento de disparar; los proyectiles no corrigen su rumbo después de salir.

## Pendientes relevantes
- Ajustar cadencia o velocidad según pruebas de dificultad con jugadores.
