# Prompt original

## Fecha
2026-10-24

## Objetivo
Mostrar los mensajes de victoria y derrota dentro de carteles de madera, con texto ordenado y legible.

## Prompt

bien, ahora quiero modificar las letras de victoria y derrota que salgan dentro de un cartel tipo madera que se lea prolijamente

## Resultado general
Se reemplazaron los textos sueltos por un cartel centrado de tablones de madera, marco oscuro, vetas, refuerzos y remaches. Los titulares ajustan su tamaño al ancho disponible; los mensajes son breves y quedan centrados con jerarquía clara. La instrucción para volver al menú se presenta como línea inferior del cartel.

## Archivos del proyecto modificados
- game.js
- prompts/README.md
- prompts/008-carteles-madera-final.md

## Validaciones realizadas
- `node --check game.js`.
- Errores del editor: ninguno.
- Prueba visual en el navegador en ambos estados: “¡CAMPAÑA LIBERADA!” y “¡A REAGRUPARSE!” quedan centrados y se leen completos dentro del cartel.

## Problemas o limitaciones encontradas
- Se detectó un recorte inicial por usar texto dentro de una caja con ancho fijo; se corrigió midiendo el texto, reduciendo el tamaño cuando corresponde y acortando los mensajes.

## Pendientes relevantes
- Ninguno para el pedido actual.
