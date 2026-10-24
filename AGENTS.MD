# AGENTS.md — Héroes de la Independencia

## 1. Propósito del archivo

Este documento define las instrucciones permanentes para los agentes de IA que trabajen en este repositorio, especialmente OpenCode.

El objetivo es desarrollar un videojuego arcade 2D de desplazamiento lateral, inspirado en el género run-and-gun y ambientado en la Independencia argentina, respetando las consignas y restricciones de la Hackatón PIA 2026 de UNAHUR.

Estas instrucciones deben interpretarse junto con:

- `contexto-hackaton-pia-heroes-independencia.md`: documento de contexto funcional, técnico y visual del proyecto.
- Las consignas y los archivos de documentación originales de la hackatón.
- El código existente, que constituye la fuente de verdad sobre las funcionalidades actualmente implementadas.

Si una propuesta contradice las consignas oficiales de la hackatón, prevalecen las consignas oficiales.

## 2. Stack tecnológico obligatorio

Utilizar exclusivamente las tecnologías permitidas por la hackatón:

- **JavaScript vanilla:** lógica, reglas, estados, entidades y sistemas del juego.
- **p5.js:** canvas, ciclo de juego, renderizado, dibujo, animación e interacción gráfica.
- **HTML:** estructura de la página y elementos de interfaz cuando corresponda.
- **CSS nativo:** estilos, presentación y adaptación visual.

### Prohibiciones

No incorporar:

- React, Vue, Angular ni otros frameworks de interfaz.
- Vite, Webpack u otros bundlers o herramientas de compilación que no estén autorizados.
- Phaser, PixiJS ni otros motores de juego adicionales.
- GSAP, Motion ni bibliotecas externas de animación.
- Bibliotecas adicionales de audio, física, colisiones o interfaz.
- Dependencias nuevas de npm, salvo autorización explícita de la consigna o del responsable del proyecto.
- Otros lenguajes o tecnologías incompatibles con las reglas de la hackatón.

No modificar el stack tecnológico por conveniencia personal ni sustituir p5.js por otra herramienta.

Antes de agregar cualquier tecnología, verificar que esté permitida por las consignas oficiales. Ante la duda, no incorporarla y proponer una alternativa nativa.

## 3. Contexto funcional del videojuego

El proyecto se denomina provisionalmente **Héroes de la Independencia**.

Es un juego 2D de desplazamiento lateral y acción run-and-gun, con estética arcade retro inspirada en juegos como Metal Slug.

El jugador podrá seleccionar uno de tres protagonistas históricos argentinos:

1. José de San Martín.
2. Manuel Belgrano.
3. Martín Miguel de Güemes.

Cada protagonista tendrá tres niveles, para un total de nueve niveles.

### Campaña de José de San Martín

1. El Ejército de los Andes.
2. El cruce de la cordillera.
3. Camino a la libertad.

### Campaña de Manuel Belgrano

1. El Éxodo Jujeño.
2. La defensa de Tucumán.
3. La victoria de Salta.

### Campaña de Martín Miguel de Güemes

1. Guardianes del Norte.
2. Emboscada en el valle.
3. La última resistencia.

Los nombres y las ambientaciones se inspiran en la historia argentina. Las mecánicas, los enemigos, los enfrentamientos y los jefes pueden ser ficticios. No presentar elementos inventados del videojuego como acontecimientos históricos reales.

Para obtener más detalles sobre cada campaña, consultar el documento de contexto del proyecto.

## 4. Objetivos generales

El desarrollo debe priorizar:

1. Conseguir una versión funcional y jugable.
2. Mantener un código comprensible y fácil de modificar.
3. Reutilizar las mecánicas comunes entre héroes y niveles.
4. Diferenciar las campañas mediante escenarios, distribución, objetivos y dificultad.
5. Crear una experiencia visual coherente con la estética arcade retro.
6. Incorporar audio y efectos cuando los recursos y las consignas lo permitan.
7. Evitar funcionalidades incompletas que aparenten estar terminadas.
8. Mantener el proyecto ejecutable después de cada etapa de desarrollo.

La prioridad es entregar una experiencia sólida antes que acumular funcionalidades.

## 5. Inspección obligatoria antes de modificar

Antes de realizar cambios:

1. Inspeccionar la estructura real del repositorio.
2. Leer este archivo y el documento de contexto.
3. Leer las consignas oficiales y la documentación disponible.
4. Revisar las instrucciones adicionales existentes, incluidas las de directorios específicos.
5. Inspeccionar `index.html`, `game.js`, `sprites.js`, `assets.js` y los archivos relacionados con la tarea.
6. Identificar cómo se inicializa p5.js y cómo funciona el ciclo `setup()`/`draw()`.
7. Identificar cómo se cargan imágenes, sprites, fuentes y sonidos.
8. Revisar los controles, las entidades, las colisiones y los estados que ya estén implementados.
9. Determinar cómo se ejecuta el proyecto actualmente.
10. Identificar qué funcionalidades funcionan, cuáles fallan y cuáles todavía no existen.

No asumir que la estructura propuesta en el documento de contexto ya existe.

No afirmar que se inspeccionó un archivo si no se abrió ni se revisó su contenido.

Si falta información necesaria, buscarla en el repositorio antes de preguntar. Preguntar únicamente cuando exista una decisión importante que no pueda resolverse con las consignas, el código o el contexto disponible.

## 6. Preservación del proyecto existente

El repositorio parte de un proyecto base de la hackatón. Por lo tanto:

- Preservar las funcionalidades que ya funcionan.
- No reemplazar archivos completos cuando una modificación localizada sea suficiente.
- No eliminar archivos, recursos, funciones ni configuraciones sin una justificación concreta.
- No cambiar el punto de entrada del proyecto sin verificar las consecuencias.
- No modificar la forma de ejecución sin comprobar primero cómo funciona la versión original.
- No introducir cambios generales que no sean necesarios para la tarea solicitada.
- No realizar refactorizaciones masivas como primera medida.
- No sobrescribir trabajo existente sin inspeccionarlo.

Antes de una refactorización importante, explicar qué problema resuelve y qué partes del código afectará.

Si una modificación requiere reorganizar varios archivos, realizarla de manera incremental y comprobar que el proyecto continúe funcionando.

## 7. Arquitectura y organización del código

Utilizar una arquitectura modular, simple y proporcional a la complejidad real del videojuego.

No es obligatorio crear todas las clases o carpetas propuestas en el documento de contexto. Crear módulos cuando exista una responsabilidad concreta que lo justifique.

### Principios obligatorios

- Separar las responsabilidades cuando mejore la comprensión del código.
- Evitar concentrar toda la lógica en un único archivo si el proyecto comienza a crecer.
- Evitar dividir artificialmente funciones pequeñas en demasiados archivos.
- Reutilizar código común entre campañas.
- Separar las configuraciones de los niveles de las mecánicas que los ejecutan.
- Evitar duplicación de lógica.
- Evitar variables globales innecesarias.
- Evitar dependencias circulares.
- Utilizar nombres descriptivos y consistentes.
- Mantener las funciones y clases acotadas a responsabilidades comprensibles.
- Documentar las decisiones no obvias, sin llenar


## 8. Registro obligatorio de prompts y trazabilidad del desarrollo

### Objetivo

Mantener un registro local, ordenado y versionado de los prompts utilizados durante el desarrollo del videojuego, para documentar las decisiones, facilitar la continuidad del trabajo y cumplir con los requisitos de registro del uso de IA que establezca la hackatón.

### Estructura

Crear, si todavía no existe, la siguiente carpeta en la raíz del repositorio:

```text
prompts/
├── README.md
├── 001-auditoria-inicial.md
├── 002-estabilizacion-proyecto.md
└── ...
```

Cada archivo debe contener un prompt principal de trabajo. Los números deben ser correlativos y los nombres descriptivos, breves y sin espacios.

### Regla de registro

Cada vez que el usuario proporcione un nuevo prompt con el que solicite realizar una tarea de desarrollo en este proyecto:

1. Guardar el texto original completo del prompt en un archivo independiente dentro de `prompts/`.
2. Asignar el siguiente número correlativo disponible, sin sobrescribir registros anteriores.
3. Crear un nombre de archivo que describa brevemente la tarea.
4. Registrar la fecha de trabajo cuando esté disponible y el objetivo del prompt.
5. Conservar el contenido original del prompt sin cambiar su intención ni omitir requisitos.
6. Después de registrar el prompt, ejecutar la tarea solicitada, salvo que el usuario haya pedido únicamente redactar, revisar o almacenar el prompt.
7. Actualizar `prompts/README.md` con el número, nombre del archivo, objetivo y estado de la tarea, cuando corresponda.

### Registro del resultado

Cuando la tarea se haya ejecutado, actualizar el registro correspondiente con un apartado adicional que incluya:

- Resultado general.
- Archivos del proyecto modificados.
- Validaciones realizadas.
- Problemas o limitaciones encontradas.
- Pendientes relevantes.

Distinguir entre el prompt original y el informe posterior de ejecución. No alterar retroactivamente el texto original.

### Qué debe registrarse

Registrar los prompts que el usuario entrega explícitamente para desarrollar, corregir, refactorizar, probar o documentar el videojuego.

No registrar automáticamente cada mensaje conversacional, saludo, pregunta conceptual o consulta que no sea una instrucción de trabajo para el agente.

Si el usuario pide generar un prompt pero todavía no solicita ejecutarlo, guardar el prompt preparado como tal únicamente cuando el contexto indique que será parte del registro de trabajo del proyecto.

### Seguridad y privacidad

No incorporar credenciales, contraseñas, tokens, claves privadas ni otros secretos al registro. Si el texto contiene secretos, advertirlo y generar una versión segura para el archivo, explicando qué se omitió.

### Integridad del historial

No borrar ni reemplazar registros anteriores para reutilizar sus números. Si un prompt se corrige antes de ejecutarse, conservar la versión original o documentar claramente la revisión, según corresponda.

No afirmar que un prompt fue guardado si no se verificó que el archivo exista.

### Importante

Este registro documenta los prompts que el agente recibe y puede identificar en el contexto de trabajo. No garantiza la captura automática de mensajes de otras conversaciones, otras sesiones o interfaces que el agente no pueda consultar. Si la consigna oficial exige un registro íntegro de todas las interacciones con IA, verificar y complementar este mecanismo con el formato de registro requerido por la organización.