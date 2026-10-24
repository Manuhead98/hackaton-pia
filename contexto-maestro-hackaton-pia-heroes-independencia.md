# Contexto maestro del proyecto — Hackatón PIA UNAHUR TIC 2026
## Héroes de la Independencia

**Propósito:** este documento unifica el estado real del proyecto base, las reglas y logros de la hackatón, y la visión funcional, visual y técnica acordada para la evolución del videojuego. Debe leerse antes de planificar o implementar cambios con OpenCode.

**Repositorio:** https://github.com/Manuhead98/hackaton-pia.git  
**Rama indicada:** `main`  
**Estado del documento:** contexto de trabajo; verificar siempre el estado actual del repositorio antes de dar por vigente una funcionalidad.

---

## 1. Cómo interpretar este documento

Este documento distingue tres cosas que no deben confundirse:

1. **Estado inicial conocido:** descripción del prototipo entregado. Puede haber cambiado desde que se escribió este documento; inspeccionar el código antes de asumir que sigue igual.
2. **Requisitos de la hackatón:** reglas y logros que deben contrastarse con `Instrucciones.md` y las consignas oficiales.
3. **Objetivo de evolución:** el videojuego que se quiere construir a partir de la base existente.

Si existe una contradicción entre este documento y las consignas oficiales, prevalecen las consignas. Si existe una diferencia entre la descripción del estado inicial y el código actual, prevalece el código inspeccionado y se debe informar la diferencia.

El archivo `AGENTS.md`, ubicado en la raíz del repositorio, contiene las reglas permanentes sobre cómo debe trabajar el agente. Este documento contiene el contexto del proyecto. Los prompts de tareas específicas pueden guardarse en `prompts/` si esa regla está configurada en `AGENTS.md`.

---

## 2. Hackatón, restricciones y reglas obligatorias

El proyecto se desarrolla para la **Hackatón PIA de UNAHUR, TIC 2026**. La consigna compartida indica que el videojuego debe realizarse con p5.js, sin otras bibliotecas, lenguajes ni dependencias, y desaconseja gráficos 3D complejos, motores físicos avanzados, multijugador online e interfaces web pesadas dentro del canvas.

### Stack acordado

- **p5.js:** canvas, ciclo de juego, dibujo, animaciones y renderizado.
- **p5.sound:** audio, si está incluido/autorizado por la base y las consignas oficiales.
- **JavaScript vanilla (ES6+):** lógica, entidades, estados, colisiones y progresión.
- **HTML/CSS nativos:** estructura de la página e interfaz sencilla.
- **Git:** control de versiones; repositorio remoto indicado arriba.

### Restricciones

- No agregar React, Vite, Phaser, GSAP, Motion ni otras bibliotecas/frameworks.
- No instalar dependencias nuevas ni cambiar herramientas de compilación sin autorización explícita de la consigna.
- No agregar backend, base de datos ni multijugador online.
- No usar un motor de física avanzado.
- Mantener la interfaz ligera y apropiada para un juego arcade.
- Revisar siempre `Instrucciones.md` y cualquier otra consigna oficial antes de tomar decisiones técnicas.
- Si un requisito parece exigir una herramienta no permitida, no implementarla con esa herramienta: proponer una alternativa compatible.

**Importante sobre el audio:** el contexto del proyecto base menciona p5.sound. Confirmar en `index.html`, `assets.js` y el código si está incluido y cómo se carga. No agregar otra biblioteca de audio. La autorización final de cualquier recurso o biblioteca debe confirmarse contra las consignas oficiales.

---

## 3. Estado inicial conocido del proyecto base

La base entregada es un prototipo pequeño pensado para una hackatón de duración limitada. La descripción inicial informa estos archivos:

| Archivo | Responsabilidad inicial descrita |
|---|---|
| `index.html` | Estructura visual, título, modal de instrucciones y botón de audio on/off. |
| `game.js` | Lógica del juego: movimiento del gato, colisión con el láser, puntaje y sonido sintetizado. |
| `sprites.js` | Arte pixel: gato con boca abierta/cerrada, láser con rayo y partículas, cuadrícula de fondo. |
| `assets.js` | Imágenes y audio codificados en Base64. |
| `Instrucciones.md` | Reglas, tabla de logros y pautas de la hackatón. |

### Comportamiento inicial descrito

Un gato se mueve con las flechas, atrapa un láser que reaparece aleatoriamente, suma puntaje y reproduce un maullido.

Según la descripción inicial, todavía no tenía:

- Menú principal completo.
- Niveles ni progresión de dificultad.
- Pantallas de victoria/derrota.
- Contador visible de prompts/iteraciones.
- Música de fondo.

Esta lista es una fotografía del estado inicial informado, no una afirmación sobre el estado actual. **OpenCode debe inspeccionar el repositorio y verificar qué sigue pendiente antes de modificarlo.**

### Ejecución local conocida

El proyecto base fue pensado para ejecutarse abriendo `index.html` directamente o mediante VS Code Live Server. Al modificar archivos, guardar los cambios y refrescar el navegador.

Si el audio no se inicia, probar después de una interacción del usuario, porque los navegadores pueden bloquear la reproducción automática. No cambiar la forma de ejecución sin verificar primero el proyecto y las consignas.

---

## 4. Logros de la hackatón que deben considerarse

La información compartida sobre los logros indica la siguiente tabla. Verificarla contra `Instrucciones.md`, porque la documentación oficial es la fuente definitiva.

| Logro | Puntaje informado | Requisito informado |
|---|---:|---|
| **Bienvenidos** | +75 | Pantalla principal con título (25 puntos) y menú interactivo (50 puntos). |
| **Manual de supervivencia** | +100 | Sección clara con instrucciones y objetivo del juego. |
| **Too easy for me** | +150 | Al menos dos niveles o escenarios diferentes. |
| **Hable más fuerte que tengo una toalla** | +125 | Audio: efectos sonoros (+50) o música (+75). |
| **Auditoría severa** | +100 | Contador visible de prompts/iteraciones. |
| **Democracia, aún te tengo fe** | +200 | Juego más votado por los participantes. |

No asumir que un logro está conseguido por el solo hecho de haber creado parte de la interfaz. Verificar la funcionalidad real y los criterios exactos de la consigna.

### Recomendaciones relacionadas con los logros

- Crear un menú principal con título y opciones que funcionen.
- Hacer accesibles las instrucciones, los controles y el objetivo.
- Implementar al menos dos escenarios realmente diferenciados; el objetivo acordado de producto es llegar a nueve niveles.
- Incorporar efectos sonoros y, si el tiempo y los recursos lo permiten, música de fondo.
- Resolver con la organización de la hackatón cómo debe medirse el contador de prompts/iteraciones.

**Sobre el contador de prompts:** un contador dentro del juego no puede saber por sí solo cuántos mensajes se enviaron a una IA externa. No inventar un mecanismo de detección automática. Si la consigna exige mostrar el número de iteraciones, confirmar qué definición acepta la organización y usar un registro explícito y verificable. El registro de prompts en archivos Markdown puede servir como trazabilidad del trabajo, pero no equivale automáticamente a un contador actualizado dentro del juego.

---

## 5. Visión objetivo del videojuego

### Nombre provisional

**Héroes de la Independencia**

### Género y referencia

Juego 2D arcade de desplazamiento lateral, de acción **run-and-gun**, inspirado en la dinámica de juegos clásicos como *Metal Slug*, con estética pixel art retro y ambientación inspirada en la Independencia argentina.

### Concepto

El jugador elige uno de tres protagonistas históricos argentinos. Cada héroe cuenta con una campaña de tres niveles. El personaje avanza por escenarios de izquierda a derecha, se desplaza, salta obstáculos, dispara a enemigos, evita ataques y completa objetivos hasta finalizar el nivel.

La prioridad es que el resultado sea un juego compacto, divertido, claro y demostrable dentro del tiempo de la hackatón, no una simulación histórica compleja.

### Tratamiento histórico

Las figuras, las regiones y los nombres de las campañas se inspiran en la historia. Las mecánicas, los enemigos concretos, las situaciones de acción y los jefes pueden ser ficción del videojuego. No presentar elementos ficticios como hechos históricos reales.

---

## 6. Alcance acordado: tres héroes y nueve niveles

El alcance es **tres héroes con tres niveles por héroe: nueve niveles en total**. No ampliar automáticamente a cinco niveles por héroe ni sumar nuevas campañas sin una decisión explícita.

### Héroe 1 — José de San Martín

Campaña inspirada en el Ejército de los Andes y la liberación de Chile.

1. **El Ejército de los Andes**
   - Ambientación: Mendoza y el campamento del Ejército de los Andes.
   - Presenta movimiento, salto, disparo y reglas básicas.
   - Posibles elementos: campamento, caminos, cajas y primeros enemigos.

2. **El cruce de la cordillera**
   - Ambientación: montañas, nieve, precipicios y pasos cordilleranos.
   - Aumenta el desafío mediante saltos, desniveles y obstáculos.
   - Las plataformas y los peligros deben distinguirse con claridad.

3. **Camino a la libertad**
   - Ambientación inspirada en la campaña libertadora en Chile.
   - Combina mecánicas aprendidas y cierra la campaña con un enfrentamiento final.
   - Puede incluir un jefe ficticio, sin presentarlo como personaje histórico real.

### Héroe 2 — Manuel Belgrano

Campaña inspirada en el Éxodo Jujeño y las campañas del norte.

1. **El Éxodo Jujeño**
   - Ambientación: caminos y poblados de Jujuy.
   - Puede introducir protección de civiles, recuperación de suministros o avance por el escenario.
   - Mantener un objetivo principal sencillo de comprender.

2. **La defensa de Tucumán**
   - Ambientación: accesos al poblado y posiciones defensivas.
   - Combate contra oleadas de enemigos y uso de coberturas u obstáculos.
   - Debe aumentar la intensidad respecto del primer nivel.

3. **La victoria de Salta**
   - Ambientación: campo de batalla y fortificaciones inspiradas en Salta.
   - Combina combate y avance, con un enfrentamiento final ficticio si resulta viable.

### Héroe 3 — Martín Miguel de Güemes

Campaña inspirada en la defensa del norte y la Guerra Gaucha.

1. **Guardianes del Norte**
   - Ambientación: caminos rurales y paisaje del norte argentino.
   - Introduce movilidad, evasión y ritmo de campaña.

2. **Emboscada en el valle**
   - Ambientación: valle rodeado de montañas.
   - Enemigos desde diferentes posiciones y rutas alternativas sencillas, solo si resultan viables.

3. **La última resistencia**
   - Ambientación: posición estratégica en el norte.
   - Puede requerir defender o alcanzar un punto mientras se enfrenta una oleada o convoy ficticio.
   - Funciona como cierre de la campaña de Güemes.

### Reutilización

Los nueve niveles deben ser configuraciones diferentes sobre un mismo motor. Reutilizar movimiento, disparo, enemigos, proyectiles, colisiones, HUD y estados. Variar escenarios, distribución, recursos, objetivos y parámetros de dificultad.

---

## 7. Dirección artística

### Estética principal

**Pixel art retro de arcade**, con referencias a los juegos run-and-gun clásicos.

- Personajes con siluetas legibles.
- Escenarios 2D de desplazamiento lateral.
- Paletas de colores coherentes por campaña.
- Fondos con varias capas o parallax sencillo solo si es viable.
- Plataformas, obstáculos y elementos de ambientación reconocibles.
- Proyectiles, impactos, explosiones y efectos breves.
- Interfaz arcade con título destacado, paneles claros y HUD legible.
- Animaciones básicas: caminar, saltar, disparar, recibir daño, morir y celebrar.

La legibilidad del gameplay tiene prioridad sobre la cantidad de efectos. Personajes, enemigos, proyectiles y peligros deben distinguirse del fondo.

### Identidad por campaña

- **San Martín:** Mendoza, campamento, cordillera, nieve, montañas y pasos.
- **Belgrano:** Jujuy, Tucumán, Salta, poblados, caminos y fortificaciones.
- **Güemes:** valles, montañas, caminos y paisajes del norte argentino.

No mezclar estilos visuales incompatibles sin una razón. Revisar primero los sprites y recursos disponibles. No asumir que los recursos externos pueden utilizarse libremente; verificar licencias y restricciones.

---

## 8. Flujo de pantallas

1. **Inicio:** título, identidad visual y opción clara para comenzar.
2. **Selección de héroe:** tres opciones con nombre y breve descripción.
3. **Selección de nivel:** tres niveles de la campaña seleccionada.
4. **Gameplay:** movimiento, salto, combate, enemigos, objetivos y HUD.
5. **Victoria:** nivel completado y opciones para continuar, elegir otro nivel o volver al menú.
6. **Derrota:** mensaje claro y opciones para reintentar o volver.

Todas las pantallas deben permitir avanzar o volver sin quedar atrapado en un estado. Los botones y opciones visibles deben funcionar realmente.

Si se implementa desbloqueo progresivo, permitir que durante el desarrollo se prueben los nueve niveles y que los niveles completados se puedan volver a jugar.

---

## 9. Mecánicas prioritarias

### Núcleo jugable

- Movimiento lateral.
- Salto.
- Disparo.
- Enemigos con comportamiento básico.
- Proyectiles e impactos.
- Vida o salud.
- Colisiones con suelo, plataformas y obstáculos.
- Cámara o desplazamiento del escenario en niveles largos, si hace falta.
- Condiciones de victoria y derrota.
- Reinicio de nivel.
- Progresión entre niveles.

### Mecánicas secundarias

Implementarlas solo cuando el núcleo sea estable:

- Enemigos con patrones distintos.
- Objetivos secundarios.
- Jefes finales ficticios.
- Efectos de impacto y explosiones.
- Puntaje, coleccionables o bonificaciones.
- Música y sonidos específicos.
- Desbloqueo de niveles.

### Controles propuestos

Primero revisar los controles existentes y conservarlos si funcionan. Como propuesta:

- Flechas izquierda/derecha o `A`/`D`: movimiento.
- `W`, flecha arriba o barra espaciadora: salto.
- `J` o `Z`: disparo.
- Pausa con una tecla acordada, solo si se implementa con un comportamiento claro.

Mostrar los controles en las instrucciones del juego.

---

## 10. Arquitectura técnica orientativa

No crear toda esta estructura de una sola vez. Primero auditar el proyecto y adaptar la arquitectura al código existente.

```text
/
├── AGENTS.md
├── contexto-hackaton-pia-heroes-independencia.md
├── Instrucciones.md
├── index.html
├── game.js
├── sprites.js
├── assets.js
├── styles.css                 # Solo si se necesita y está permitido
├── prompts/                   # Registro de prompts de desarrollo
└── src/                       # Incorporar gradualmente si conviene
    ├── main.js
    ├── game/
    │   ├── Game.js
    │   ├── GameState.js
    │   ├── InputManager.js
    │   ├── CollisionSystem.js
    │   └── Camera.js
    ├── entities/
    │   ├── Player.js
    │   ├── Enemy.js
    │   ├── Projectile.js
    │   └── Explosion.js
    ├── heroes/
    │   ├── sanMartin.js
    │   ├── belgrano.js
    │   └── guemes.js
    ├── campaigns/
    │   ├── sanMartinLevels.js
    │   ├── belgranoLevels.js
    │   └── guemesLevels.js
    ├── systems/
    │   ├── CombatSystem.js
    │   ├── AudioManager.js
    │   └── ProgressionManager.js
    └── ui/
        ├── MainMenu.js
        ├── HeroSelection.js
        ├── LevelSelection.js
        └── GameHUD.js
```

La estructura es una propuesta, no un requisito rígido. No duplicar puntos de entrada ni mantener archivos antiguos y nuevos con la misma responsabilidad sin necesidad.

### Responsabilidades sugeridas

- **Game / GameState:** coordinación global y estados.
- **Player:** estado, movimiento, salto, vida y acciones del personaje.
- **Enemy:** estado y comportamiento de enemigos.
- **Projectile:** movimiento, colisión, daño y ciclo de vida.
- **CollisionSystem:** reglas de colisión reutilizables.
- **InputManager:** lectura consistente del teclado.
- **Campaigns:** configuración declarativa de cada nivel.
- **Heroes:** configuración y recursos de cada protagonista.
- **AudioManager:** carga y reproducción de música y efectos.
- **ProgressionManager:** avance y niveles completados, si se implementa.
- **UI:** menú, selecciones e indicadores del HUD.

Separar datos y lógica cuando eso simplifique el mantenimiento. Evitar tanto un único archivo excesivamente grande como una arquitectura innecesariamente compleja.

---

## 11. Recursos, audio y ejecución

- Revisar primero `assets.js`, `sprites.js` y los recursos existentes.
- Centralizar las rutas de recursos cuando sea conveniente.
- Verificar que los archivos referenciados existan.
- No afirmar que un recurso existe sin inspeccionarlo.
- No agregar bibliotecas de audio externas.
- Si se añade música, permitir que se inicie tras una interacción explícita del usuario si el navegador lo exige.
- Si existe un control de audio, debe activar y desactivar el sonido realmente.
- Resolver errores de carga sin bloquear innecesariamente el juego por recursos opcionales.

La base se describió como ejecutable desde `index.html` o mediante Live Server. Si se incorporan módulos ES, puede ser necesario usar un servidor HTTP local. Verificarlo antes de modificar el punto de entrada y no incorporar herramientas de build no permitidas.

---

## 12. Registro de prompts e iteraciones

La hackatón incluye, según la información compartida, un logro relacionado con un contador visible de prompts/iteraciones. Debe verificarse el criterio exacto en la documentación oficial.

Además, se quiere mantener un registro de prompts de desarrollo dentro del repositorio.

### Carpeta propuesta

```text
prompts/
├── README.md
├── 001-auditoria-inicial.md
├── 002-estabilizacion-proyecto.md
└── ...
```

Cuando OpenCode reciba un prompt explícito para desarrollar, corregir, refactorizar, probar o documentar el videojuego:

1. Guardar el prompt original completo en un archivo nuevo.
2. Asignar el siguiente número correlativo.
3. Usar un nombre breve y descriptivo.
4. No sobrescribir prompts anteriores.
5. Registrar el objetivo y la fecha cuando estén disponibles.
6. Actualizar `prompts/README.md` con el estado de la tarea.
7. Después de ejecutar la tarea, agregar un informe separado con resultado, archivos modificados, pruebas y pendientes.

No registrar automáticamente cada saludo, consulta conceptual o conversación que no sea una instrucción de trabajo.

No guardar contraseñas, tokens, claves privadas ni secretos. Si OpenCode no puede verificar que el archivo se guardó, debe informarlo y no afirmar que el registro existe.

Este mecanismo registra los prompts que el agente recibe y puede identificar en su sesión. No garantiza la captura automática de mensajes de otras conversaciones o sesiones. Si la hackatón exige una auditoría íntegra, seguir el formato oficial.

El contador que se muestre dentro del juego debe basarse en una definición explícita y verificable. No suponer que el videojuego puede detectar automáticamente los mensajes enviados a una IA externa.

---

## 13. Criterios de calidad y aceptación

### Funcionamiento

- La página carga sin errores críticos.
- El flujo de pantallas es navegable.
- El personaje se mueve y salta correctamente.
- Los disparos y los impactos funcionan.
- Las colisiones no permiten atravesar el suelo por error.
- Vida, daño, victoria y derrota se reflejan correctamente.
- El reinicio restablece el estado de la partida.
- Los niveles tienen diferencias reales de escenario, distribución, dificultad u objetivos.
- Los controles están explicados.
- Los recursos y el audio funcionan cuando están implementados.

### Código

- No hay dependencias prohibidas.
- No se rompe funcionalidad existente sin justificación.
- No se duplican nueve versiones de la misma lógica.
- Los nombres son descriptivos.
- No quedan errores conocidos sin informar.
- La documentación de ejecución y prueba está actualizada.

### Entrega

El objetivo es incluir menú, instrucciones, selección de héroe y nivel, gameplay estable, audio dentro de las posibilidades, nueve niveles y registro de prompts. Si el tiempo disponible no permite completar todo con calidad, priorizar una versión jugable y demostrable y declarar honestamente lo que quedó pendiente.

---

## 14. Plan de implementación por etapas

### Etapa 0 — Auditoría

- Leer las consignas y toda la documentación.
- Inspeccionar `index.html`, `game.js`, `sprites.js`, `assets.js` y archivos relacionados.
- Explicar cómo se inicia el juego, cómo funciona el ciclo de p5.js y cómo se cargan recursos.
- Comparar el estado real con la descripción de este documento.
- Entregar un diagnóstico y plan antes de refactorizar.

**Resultado:** mapa del proyecto y plan incremental.

### Etapa 1 — Estabilizar la base

- Confirmar que el juego se ejecuta.
- Probar controles, renderizado y recursos.
- Corregir errores críticos sin cambios innecesarios.

**Resultado:** versión base funcional.

### Etapa 2 — Núcleo jugable

- Consolidar movimiento, salto, disparo y colisiones.
- Implementar o estabilizar enemigos, proyectiles, vida y daño.
- Incorporar victoria, derrota y reinicio.

**Resultado:** un nivel que se pueda jugar de principio a fin.

### Etapa 3 — Interfaz y estados

- Crear o completar menú.
- Añadir instrucciones.
- Implementar selección de héroe y nivel.
- Conectar la interfaz con los estados reales del juego.

**Resultado:** iniciar una partida desde la interfaz.

### Etapa 4 — Campañas y niveles

- Definir los héroes.
- Configurar los nueve niveles con datos reutilizables.
- Variar escenarios, enemigos, objetivos y dificultad.
- Evitar nueve implementaciones independientes.

**Resultado:** campañas con identidad propia sobre un motor común.

### Etapa 5 — Arte y audio

- Unificar la estética pixel art.
- Diferenciar campañas visualmente.
- Añadir animaciones y efectos.
- Incorporar música y efectos sonoros si los recursos lo permiten.

**Resultado:** experiencia audiovisual coherente.

### Etapa 6 — Registro y validación final

- Mantener el registro de prompts.
- Probar las pantallas, controles, victoria, derrota y reinicio.
- Verificar recursos, consola y dependencias.
- Revisar los logros oficiales de la hackatón.
- Preparar documentación y demostración.

**Resultado:** versión estable y demostrable.

---

## 15. Instrucciones operativas para OpenCode

Antes de editar:

1. Leer este documento, `AGENTS.md`, las consignas oficiales y cualquier instrucción adicional.
2. Inspeccionar los archivos relacionados con la tarea.
3. Consultar las skills disponibles si son relevantes y respetar sus instrucciones compatibles con la hackatón.
4. Identificar el comportamiento actual y los riesgos.

Durante la tarea:

- Trabajar con cambios pequeños y verificables.
- Preservar lo que funciona.
- No instalar dependencias ni agregar tecnologías no autorizadas.
- No hacer refactorizaciones amplias sin necesidad.
- No añadir funcionalidades que amplíen el alcance sin autorización.
- No inventar archivos, APIs ni resultados.

Después de la tarea:

- Ejecutar las comprobaciones disponibles.
- Explicar qué archivos cambiaron y por qué.
- Indicar cómo probar el resultado.
- Separar las comprobaciones estáticas de las pruebas ejecutadas en el navegador.
- Informar limitaciones y pendientes.
- No afirmar que se probaron funcionalidades que no se ejecutaron.
- Registrar el prompt y su resultado de acuerdo con la sección de trazabilidad y las instrucciones de `AGENTS.md`.

Formato recomendado de respuesta:

1. Diagnóstico breve.
2. Plan.
3. Cambios realizados.
4. Validación y resultados.
5. Archivos afectados.
6. Cómo probar.
7. Pendientes conocidos.

No detenerse en un análisis interminable: una vez entendido el alcance, avanzar con una implementación concreta y validar los cambios.

---

## 16. Fuera de alcance salvo decisión explícita

- React u otros frameworks de interfaz.
- Vite u otros bundlers no autorizados.
- Phaser, GSAP, Motion u otros motores o bibliotecas.
- Backend, API, base de datos o autenticación.
- Multijugador online.
- Sistemas complejos de inventario, tienda o progresión persistente.
- Cinco niveles por héroe: el alcance acordado es tres.
- Nueve motores de juego independientes.
- Realismo histórico estricto en cada mecánica: la intención es una experiencia arcade inspirada en la historia, diferenciando ficción y hechos históricos.

---

## 17. Decisiones abiertas

Resolver durante el desarrollo sin bloquear la auditoría inicial:

- Resolución lógica definitiva del canvas.
- Si los recursos serán sprites existentes, dibujo procedural o combinación.
- Si los menús se dibujarán en canvas o usarán HTML/CSS.
- Controles definitivos después de inspeccionar la base.
- Longitud de los niveles y modelo de cámara.
- Parámetros de vida, daño, velocidad y dificultad.
- Desbloqueo progresivo o acceso libre durante pruebas.
- Qué niveles tendrán objetivos secundarios o jefes ficticios.
- Música y efectos sonoros disponibles y permitidos.
- Definición exacta del contador de prompts requerido por la hackatón.

Elegir la alternativa más sencilla que cumpla las reglas, pueda probarse y sea viable dentro del tiempo disponible.

---

## 18. Resumen ejecutivo

El proyecto parte de un prototipo de p5.js descrito como un gato que se mueve, atrapa un láser, suma puntos y reproduce un maullido. La tarea inicial de OpenCode es verificar el estado real del repositorio y las consignas antes de modificarlo.

La dirección de producto acordada es evolucionar hacia **Héroes de la Independencia**, un videojuego arcade 2D run-and-gun con estética pixel art retro, tres protagonistas —José de San Martín, Manuel Belgrano y Martín Miguel de Güemes— y tres niveles por protagonista, nueve en total.

El stack acordado es **p5.js + p5.sound si está permitido/incluido + JavaScript vanilla + HTML/CSS nativos**, sin frameworks ni dependencias nuevas. El proyecto debe priorizar un núcleo jugable, una interfaz clara, audio cuando sea viable, al menos dos escenarios diferenciados para los logros y una trazabilidad honesta de los prompts.

**Principio rector:** verificar antes de asumir, comprender antes de modificar, construir primero una experiencia estable y después ampliarla sin incumplir las reglas de la hackatón.
