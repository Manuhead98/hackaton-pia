# Prompt original

## Fecha
2026-10-24

## Objetivo
Usar las pistas suministradas en la carpeta musica para reproducir música de fondo distinta según el héroe seleccionado durante todos los niveles de su campaña.

## Prompt

agregue la carpeta musica con cada nombre, la podes agregar a cada perosnaje una musiquita que suene mientras estas jugando en todos los niveles

## Resultado general
Se conectaron los MP3 existentes a sus protagonistas: San Martín, Belgrano y Güemes. La pista inicia en loop cuando comienza la partida y sigue sonando sin interrupciones entre los niveles de la campaña. El botón Audio ON/OFF controla tanto la música como los efectos existentes. La música se detiene al terminar en victoria o derrota.

## Archivos del proyecto modificados
- game.js
- index.html
- prompts/README.md
- prompts/010-musica-campanas-por-heroe.md

## Validaciones realizadas
- Se confirmó que los tres archivos son MP3 válidos y que el servidor local responde HTTP 200 para todos.
- `node --check game.js`.
- Diagnóstico del editor: sin errores en HTML ni JavaScript.
- Prueba de navegador: cada protagonista reproduce su ruta correspondiente, el elemento está en loop y no está pausado; la misma pista permanece durante el cambio de nivel.
- Se verificó que el botón alterna correctamente entre audio silenciado y activo.

## Problemas o limitaciones encontradas
- Los navegadores pueden restringir audio hasta que exista una interacción del usuario; la pista comienza al presionar “Comenzar”, que satisface esa condición.

## Pendientes relevantes
- No se generó ni sustituyó música: se usan las tres pistas ya provistas en la carpeta musica.
