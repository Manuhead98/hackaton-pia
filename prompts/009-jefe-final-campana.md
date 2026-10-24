# Prompt original

## Fecha
2026-10-24

## Objetivo
Incorporar un jefe final ficticio de tropas realistas en el tercer nivel de cada campaña, con sprite diferenciado y barra de vida.

## Prompt

me gustaria que cada nivel 3 de la campaña tenga un jefe final , que sea de la tropa realista el jefe que tenga barra de vida de ultima

## Resultado general
Se añadió un comandante realista ficticio como jefe en el tercer nivel de las tres campañas. Tiene sprite pixel art propio, movimiento de patrulla, 12 puntos de vida y barra de vida en el HUD. Cada disparo reduce un punto; al derrotarlo se oculta la barra, se otorga puntaje y se habilita la salida una vez eliminados también los adversarios regulares. El manual indica cómo enfrentar al jefe.

## Archivos del proyecto modificados
- game.js
- sprites.js
- index.html
- prompts/README.md
- prompts/009-jefe-final-campana.md

## Validaciones realizadas
- `node --check game.js` y `node --check sprites.js`.
- Diagnóstico del editor: sin errores en HTML ni JavaScript.
- Prueba en navegador para San Martín, Belgrano y Güemes: en sus niveles 3 aparece el comandante y la barra indica 12/12.
- Simulación de disparo: la vida baja a 11/12 y el valor accesible ARIA se actualiza; tras 12 impactos el jefe cae y la barra se oculta.
- Prueba de condición de salida: la campaña solo avanza una vez derrotado el jefe y cumplido el objetivo normal.

## Problemas o limitaciones encontradas
- El comandante es un adversario ficticio inspirado en la tropa realista; no representa a una persona histórica real.
- El jefe patrulla y tiene más resistencia, sin un ataque a distancia especial en esta versión.

## Pendientes relevantes
- Podrían agregarse patrones de ataque o animación del comandante en una iteración posterior.
