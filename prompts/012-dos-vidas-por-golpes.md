# Prompt original

## Fecha
2026-10-24

## Objetivo
Dejar al protagonista con dos vidas y quitar una vida por cada golpe o colisión que lo dañe.

## Prompt

necesito que le personaje que movemos tenga  2 vidas cada golpe o colision pierde una vida

## Resultado general
El protagonista comienza con dos vidas. Cada golpe de enemigo, colisión con el jefe, proyectil hostil, caída fuera del escenario o agotamiento del tiempo descuenta una vida. La vida del jugador y el contador del HUD quedaron unificados, y los niveles no restauran vidas al reiniciarse. Tras el primer impacto queda una vida; el siguiente termina la partida. Se conserva una breve invulnerabilidad tras el daño para evitar perder ambas vidas en el mismo contacto continuo.

## Archivos del proyecto modificados
- game.js
- index.html
- prompts/README.md
- prompts/012-dos-vidas-por-golpes.md

## Validaciones realizadas
- `node --check game.js`.
- Errores del editor en HTML y JavaScript: ninguno.
- Prueba en navegador: inicio con 2/2, primer golpe actualiza a 1/2, los impactos repetidos durante el cooldown no descuentan otra vida y el golpe siguiente llega a 0 y activa GAME_OVER.

## Problemas o limitaciones encontradas
- El tiempo agotado también se trata como daño y descuenta una vida; al recibir ese daño el tiempo del nivel se repone para evitar una derrota repetida cada cuadro.

## Pendientes relevantes
- Ninguno para el pedido actual.
