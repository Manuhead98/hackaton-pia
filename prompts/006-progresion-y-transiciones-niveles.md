# Prompt original

## Fecha
2026-10-24

## Objetivo
Permitir volver a niveles anteriores, mejorar el flujo entre niveles y sustituir la puerta verde genérica por una salida visual temática y comprensible.

## Prompt

bueno mira necesito que pueda ir para atras en los niveles, y que los desarrolles un poco mas como pasa de un nivel a otro ahora mismo genera solo una puerta verde

## Resultado general
Se añadió un botón “Nivel anterior” al HUD y la tecla B para volver al nivel previo de la campaña; en el primer nivel el botón queda deshabilitado. La transición ya no salta automáticamente en 1,2 segundos: ahora presenta una tarjeta con el nivel superado, el siguiente destino y la ruta de campaña, permite continuar con Enter y avanza automáticamente tras 4,5 segundos. La puerta verde se reemplazó por un arco de madera con bandera argentina que pasa de cerrado a abierto al cumplir el objetivo. Se corrigió la meta para contar enemigos derrotados y se generan 2, 3 y 4 enemigos en las etapas, respectivamente, con indicadores visibles de progreso.

## Archivos del proyecto modificados
- game.js
- sprites.js
- index.html
- prompts/README.md
- prompts/006-progresion-y-transiciones-niveles.md

## Validaciones realizadas
- `node --check game.js` y `node --check sprites.js`.
- Errores del editor: ninguno en HTML o JavaScript.
- Prueba de navegador: se verificó que los objetivos/spawns son 2/2, 3/3 y 4/4; cruzar la salida cambia al estado de transición; el botón devuelve al escenario anterior y queda deshabilitado en el primero.
- Se comprobó visualmente el HUD de objetivo y la salida temática en gameplay.

## Problemas o limitaciones encontradas
- El avance automático al siguiente escenario ocurre tras 4,5 segundos, pero Enter permite iniciarlo de inmediato.
- Volver al nivel anterior reinicia ese nivel, manteniendo las vidas disponibles y el puntaje total acumulado.

## Pendientes relevantes
- Ajustar la distribución de plataformas/enemigos de cada nivel si se busca que el recorrido físico también cambie más, además del fondo y la cantidad de adversarios.
