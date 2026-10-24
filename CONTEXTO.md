# Contexto del Proyecto - Hackatón PIA UNAHUR TIC 2026

## 1. Estado actual del proyecto

Tenés una base mínima de hackatón (~3 horas) con un prototipo en **p5.js + p5.sound**.

### Archivos disponibles

| Archivo | Rol |
|---------|-----|
| `index.html` | Shell visual, título, modal de instrucciones, botón audio on/off |
| `game.js` | Lógica: movimiento del gato, colisión con láser, puntaje, sonido sintetizado |
| `sprites.js` | Arte píxel: gato (boca abierta/cerrada), láser con rayo y partículas, grid de fondo |
| `assets.js` | Imágenes y audio en Base64 |
| `Instrucciones.md` | Reglas, tabla de logros y pautas del hackatón |

### Estado actual del juego

Un gato se mueve con flechas, atrapa un láser que reaparece aleatoriamente, suma puntaje y suena un maullido. **No tiene:**
- Menú principal
- Niveles ni progresión de dificultad
- Pantallas de victoria/derrota
- Contador de prompts/iteraciones
- Música de fondo

---

## 2. Requisitos obligatorios para puntuar (Logros)

| Logro | Puntaje | Requisito |
|-------|---------|-----------|
| "Bienvenidos" | +75 pts | Pantalla principal con título (25 pts) y menú interactivo (50 pts) |
| "Manual de supervivencia" | +100 pts | Sección clara con instrucciones y objetivo |
| "Too easy for me" | +150 pts | Al menos 2 niveles o escenarios diferentes |
| "Hable más fuerte que tengo una toalla" | +125 pts | Audio: SFX (+50 pts) o música (+75 pts) |
| "Auditoría severa" | +100 pts | Contador de prompts/iteraciones visibles |
| "Democracia, aún te tengo fe" | +200 pts | Juego más votado por los participantes |

---

## 3. Restricciones

- Todo debe ser puro **p5.js** (sin otras bibliotecas, lenguajes o dependencias)
- No gráficos 3D complejos ni motores físicos avanzados
- No multijugador online ni interfaces web pesadas dentro del canvas
- Regla de oro: divertirse

---

## 4. Recomendaciones de implementación

1. **Máquina de estados:** Agregar `gameState` (`MENU`, `PLAYING`, `LEVEL_COMPLETE`, `GAME_OVER`) para separar pantallas.
2. **Niveles:** Cambiar velocidad del láser, cantidad de objetivos o tiempo por nivel.
3. **Contador de prompts:** Variable `promptCount` visible en pantalla, incrementada cada vez que se pide un cambio a la IA.
4. **Audio:** Música de fondo en bucle + SFX de captura.
5. **Modularización:** Separar en `ui.js`, `levels.js`, `audio.js` si el equipo crece.
6. **Responsividad:** El canvas es fijo 560x320; probar en distintas pantallas.
7. **Git:** Inicializar repo para llevar registro de cambios y hacer rollback si la IA rompe algo.

---

## 5. Flujo de etapas del proyecto (sugerido para 3 horas)

| Etapa | Tiempo | Qué hacer |
|-------|--------|-----------|
| 1. Planeación y roles | 30 min | Definir director de proyecto, quién pide a la IA, quién revisa código. Elegir temática. |
| 2. Menú y estados | 45 min | Pantalla principal con título, botón "Comenzar", "Opciones", "Salir". Implementar `gameState`. |
| 3. Niveles y dificultad | 45 min | Al menos 2 niveles con progresión. Pantalla de transición. |
| 4. Audio y FX | 30 min | Música de fondo + sonido de captura. Botón mute/unmute. |
| 5. Contador de prompts y pulido | 30 min | Contador visible, ajustes de colisión, game over, victoria. |
| 6. Testing y presentación | 30 min | Jugar, corregir bugs, preparar demo y votación. |

---

## 6. Stack recomendado

- **Motor:** p5.js + p5.sound (obligatorio por reglas del hackatón)
- **Lenguaje:** JavaScript vanilla (ES6+)
- **HTML/CSS:** Shell y menús (ya viene en `index.html`)
- **Assets:** Base64 (embebido en `assets.js`) o imágenes/MP3 externos
- **Control de versiones:** Git + GitHub
- **IA Copiloto:** Cualquier LLM (GPT, Claude, DeepSeek, Gemini)
- **Deploy opcional:** Vercel o Netlify

---

## 7. Cómo levantar el proyecto localmente

1. Ve a la carpeta `Juego base (descargar)` y hacé doble clic en **`index.html`**.
2. O usá VS Code con la extensión **Live Server** (botón "Go Live") para recarga automática.
3. Cada vez que modifiques un archivo, **guardá (Ctrl+S) y refrescá la pestaña** del navegador.
4. Si el audio no suena, hacé clic en cualquier parte del juego primero (los navegadores bloquean el AudioContext hasta que el usuario interactúa).

---

## 8. Repositorio remoto

- URL: `https://github.com/Manuhead98/hackaton-pia.git`
- Rama: `main`
