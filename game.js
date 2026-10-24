let catX = 50,
  catY = 160;
let laserX = 420,
  laserY = 160;
let score = 0;
const SPEED = 4;
let isMoving = false;
let facingRight = false;
let promptCount = 0;

const GAME_STATES = Object.freeze({
  MENU: "menu",
  HERO_SELECT: "hero_select",
  PLAYING: "playing",
  LEVEL_COMPLETE: "level_complete",
  VICTORY: "victory",
  GAME_OVER: "game_over"
});

const HEROES = {
  "San Martín": {
    name: "José de San Martín",
    campaign: "Ejército de los Andes",
    accent: "#00ffcc"
  },
  Belgrano: {
    name: "Manuel Belgrano",
    campaign: "Éxodo Jujeño",
    accent: "#ffd166"
  },
  Güemes: {
    name: "Martín Miguel de Güemes",
    campaign: "Guardianes del Norte",
    accent: "#ff8fab"
  }
};

const LEVELS = [
  { name: "Ejército de los Andes", goal: 6, timeLimit: 20, theme: "andes" },
  { name: "Cruce de la cordillera", goal: 10, timeLimit: 18, theme: "cordillera" },
  { name: "Guardianes del Norte", goal: 14, timeLimit: 16, theme: "norte" }
];

let gameState = GAME_STATES.MENU;
let selectedHero = "San Martín";
let levelIndex = 0;
let lives = 3;
let totalScore = 0;
let levelGoal = LEVELS[0].goal;
let levelTimer = LEVELS[0].timeLimit;
let levelTransitionStart = 0;

let osc, env;

function setup() {
  let canvas = createCanvas(560, 320);
  canvas.parent("game-container");
  noSmooth();

  osc = new p5.Oscillator("sine");
  env = new p5.Envelope();
  env.setADSR(0.01, 0.08, 0.1, 0.05);
  env.setRange(0.4, 0);
  osc.start();
  osc.amp(0);

  setScreen("title-screen");
  setStatus("Elegí a tu héroe para liberar la campaña.");
  hideHUD();
  updateHUD();
  resetLevel();
}

function selectHero(heroName) {
  selectedHero = heroName;
  setScreen("title-screen");
  setStatus(`${HEROES[heroName].name} listo para la misión.`);
  updateHUD();
}

function startGame() {
  gameState = GAME_STATES.PLAYING;
  levelIndex = 0;
  totalScore = 0;
  lives = 3;
  setScreen("title-screen");
  hideHUD();
  hideMenuPanels();
  showHUD();
  updateHUD();
  resetLevel();
  setStatus(`${HEROES[selectedHero].campaign} activa.`);
}

function hideMenuPanels() {
  const screens = document.querySelectorAll(".game-screen");
  screens.forEach((screen) => screen.classList.add("hidden"));
}

function showHUD() {
  const hud = document.getElementById("hud");
  if (hud) {
    hud.classList.remove("hidden");
  }
}

function hideHUD() {
  const hud = document.getElementById("hud");
  if (hud) {
    hud.classList.add("hidden");
  }
}

function updateHUD() {
  const hudHero = document.getElementById("hud-hero");
  const hudLives = document.getElementById("hud-lives");
  const hudScore = document.getElementById("hud-score");
  const hudLevel = document.getElementById("hud-level");

  if (hudHero) {
    hudHero.textContent = HEROES[selectedHero].name;
  }
  if (hudLives) {
    hudLives.textContent = String(lives);
  }
  if (hudScore) {
    hudScore.textContent = String(totalScore);
  }
  if (hudLevel) {
    hudLevel.textContent = `${Math.min(levelIndex + 1, LEVELS.length)}/${LEVELS.length}`;
  }

  updatePromptMeter(promptCount);
}

function resetLevel() {
  const level = currentLevel();
  levelGoal = level.goal;
  levelTimer = level.timeLimit;
  catX = 50;
  catY = 160;
  spawnLaser();
  updateHUD();
}

function currentLevel() {
  return LEVELS[levelIndex] || LEVELS[LEVELS.length - 1];
}

function spawnLaser() {
  do {
    laserX = floor(random(40, width - 60));
    laserY = floor(random(40, height - 60));
  } while (dist(catX, catY, laserX, laserY) < 120);
}

function advanceLevel() {
  if (levelIndex < LEVELS.length - 1) {
    levelIndex += 1;
    gameState = GAME_STATES.LEVEL_COMPLETE;
    levelTransitionStart = millis();
    setStatus(`Nivel superado: ${currentLevel().name}.`);
    updateHUD();
  } else {
    gameState = GAME_STATES.VICTORY;
    setStatus("Victoria: la campaña fue liberada.");
    hideHUD();
  }
}

function loseLife() {
  lives -= 1;
  updateHUD();

  if (lives <= 0) {
    gameState = GAME_STATES.GAME_OVER;
    setStatus("Derrota: la misión fue rechazada.");
    hideHUD();
    return;
  }

  resetLevel();
  gameState = GAME_STATES.PLAYING;
  setStatus(`Vidas restantes: ${lives}. Reintentá.`);
}

function registerPrompt() {
  promptCount += 1;
  updatePromptMeter(promptCount);
}

function playCatchSound() {
  let freq = random(600, 900);
  osc.freq(freq);
  env.play(osc);
}

function draw() {
  const level = currentLevel();
  drawScenarioBackdrop(level.theme, level.name);

  if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.HERO_SELECT) {
    drawBackgroundGrid();
    stroke("#00ffcc55");
    noFill();
    rect(0, 0, width, height);
    return;
  }

  if (gameState === GAME_STATES.LEVEL_COMPLETE) {
    noStroke();
    fill("#00ffcc");
    textSize(18);
    textAlign(CENTER, CENTER);
    text("NIVEL COMPLETADO", width / 2, height / 2);
    textSize(12);
    text(`Siguiente escenario: ${currentLevel().name}`, width / 2, height / 2 + 22);

    if (millis() - levelTransitionStart > 1200) {
      resetLevel();
      gameState = GAME_STATES.PLAYING;
      showHUD();
      setStatus(`Entrando a ${currentLevel().name}.`);
    }
    return;
  }

  if (gameState === GAME_STATES.VICTORY || gameState === GAME_STATES.GAME_OVER) {
    noStroke();
    fill(gameState === GAME_STATES.VICTORY ? "#00ffcc" : "#ff6b6b");
    textSize(20);
    textAlign(CENTER, CENTER);
    const title = gameState === GAME_STATES.VICTORY ? "¡VICTORIA!" : "DERROTA";
    text(title, width / 2, height / 2 - 12);
    textSize(12);
    text("Presioná Enter para volver al menú", width / 2, height / 2 + 18);
    return;
  }

  isMoving = false;
  if (keyIsDown(LEFT_ARROW)) {
    catX -= SPEED + (levelIndex * 0.2);
    isMoving = true;
    facingRight = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    catX += SPEED + (levelIndex * 0.2);
    isMoving = true;
    facingRight = false;
  }
  if (keyIsDown(UP_ARROW)) {
    catY -= SPEED + (levelIndex * 0.15);
    isMoving = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    catY += SPEED + (levelIndex * 0.15);
    isMoving = true;
  }

  catX = constrain(catX, 10, width - 70);
  catY = constrain(catY, 10, height - 70);

  drawLaserPixel(laserX, laserY);
  drawCatPixel(catX, catY, isMoving, facingRight);

  let d = dist(catX + 30, catY + 30, laserX + 12, laserY + 12);
  if (d < 30) {
    totalScore += 1;
    playCatchSound();
    spawnLaser();
    updateHUD();

    if (totalScore >= levelGoal) {
      advanceLevel();
    }
  }

  levelTimer -= 0.016;
  if (levelTimer <= 0) {
    loseLife();
  }

  noStroke();
  fill("#00ffcc");
  textFont("Courier New");
  textSize(12);
  textAlign(LEFT, TOP);
  text(`Héroe: ${HEROES[selectedHero].name}`, 15, 18);
  text(`Meta: ${Math.max(levelGoal - totalScore, 0)}`, 15, 34);
  text(`Tiempo: ${Math.max(0, ceil(levelTimer))}s`, 15, 50);
}

function keyPressed() {
  if (keyCode === ENTER && (gameState === GAME_STATES.VICTORY || gameState === GAME_STATES.GAME_OVER)) {
    gameState = GAME_STATES.MENU;
    setScreen("title-screen");
    setStatus("Elegí a tu héroe para liberar la campaña.");
    updateHUD();
    hideHUD();
    return;
  }

  if (keyCode === 80) {
    registerPrompt();
  }
}

function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "P") {
    registerPrompt();
  }
});
