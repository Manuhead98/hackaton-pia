# Prompt original

## Fecha
2026-10-24

## Objetivo
Hacer que el jefe final dispare al jugador y tenga más variedad de movimientos en combate.

## Prompt

el jefe de cada nivel hacelo que dispare y tenga mas movimientos

## Resultado general
El jefe ahora alterna patrulla, apuntado, carga y salto; durante el apuntado muestra una advertencia breve. Dispara ráfagas de tres proyectiles que apuntan a la posición actual del jugador. Los proyectiles restan vida al impactar y tienen límites de pantalla; un cooldown de daño evita perder varias vidas en frames consecutivos. Se añadieron destellos para la carga, barra de vida conservada y una indicación en el manual de cómo esquivar.

## Archivos del proyecto modificados
- game.js
- index.html
- prompts/README.md
- prompts/011-jefe-ataques-y-movimientos.md

## Validaciones realizadas
- `node --check game.js` y `node --check sprites.js`.
- Diagnóstico del editor: sin errores.
- Prueba en navegador: se verificó secuencia de apuntado/carga y entrada a salto, creación de tres proyectiles por ráfaga, daño de proyectil al jugador y cooldown de invulnerabilidad.
- Simulación del salto: el jefe sube y vuelve al suelo.

## Problemas o limitaciones encontradas
- La cadencia del ataque y los cambios de movimiento se basan en deltaTime del juego y pueden variar levemente con el rendimiento del navegador.
- El jefe tiene patrones de movimiento y disparo básicos; todavía no hay animación dedicada por cada estado.

## Pendientes relevantes
- Ajustar daño o cadencia del jefe tras una prueba de juego humano, si resulta demasiado fácil o difícil.
