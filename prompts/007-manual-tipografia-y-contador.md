# Prompt original

## Fecha
2026-10-24

## Objetivo
Reemplazar las instrucciones de la hackatón por un manual jugable con controles, objetivo y final; quitar el contador de prompts de la interfaz y renovar las tipografías con una estética argentina patria, clásica y dimensional.

## Prompt

necesito que me cambies las instrucciones por las del juego que sirvan para jugar que botones tocar y como hacer y el objetivo y el fin, depsues sacame el contador de prompts y las fonts que usa para todo, estaria bueno que sean otras con mas profundidad y dimension y mas argentinas

## Resultado general
Se sustituyó el texto heredado de la hackatón por instrucciones prácticas: selección de héroe, controles, objetivo de derrotar a los adversarios y cruzar la salida, avance con Enter, retorno con B/botón, derrota por vidas/tiempo y final de campaña. Se eliminó el contador de prompts y todas sus referencias del menú y del gameplay. La interfaz ahora usa tipografía serif clásica para títulos y sans-serif legible para el cuerpo, con sombras de varias capas, relieve en títulos y botones, y tonos celeste/blanco/azul/oro. El canvas usa Georgia para textos de objetivos y pantallas.

## Archivos del proyecto modificados
- index.html
- game.js
- prompts/README.md
- prompts/007-manual-tipografia-y-contador.md

## Validaciones realizadas
- `node --check game.js` y `node --check sprites.js`.
- Diagnóstico del editor: sin errores en HTML ni JavaScript.
- Revisión en navegador: contenido completo del manual, no hay botón de ayuda en el encabezado, el contador ya no está presente, y se verificaron las familias CSS calculadas para cuerpo y título.

## Problemas o limitaciones encontradas
- Se usan familias locales con alternativas del sistema en lugar de descargar fuentes externas, para evitar dependencias nuevas y que el juego siga funcionando sin conexión.

## Pendientes relevantes
- La apariencia exacta de las fuentes puede variar entre sistemas operativos según qué familias tipográficas estén instaladas.
