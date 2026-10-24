let gameState = 'MENU';
let score = 0;
const SPEED = 4;
let isMoving = false;
let facingRight = false;
let promptCount = 0;

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const FRICTION = 0.8;

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

let player = {
  x: 50,
  y: 100,
  w: 30,
  h: 40,
  vx: 0,
  vy: 0,
  vida: 3,
  vidaMax: 3,
  direccion: 1,
  enSuelo: false,
  cooldownDisparo: 0,
  color: "#00ffcc"
};

let projectiles = [];
let enemies = [];
let platforms = [];
let meta = null;
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
  player.color = HEROES[heroName].accent;
  setScreen("title-screen");
  setStatus(`${HEROES[heroName].name} listo para la misión.`);
  updateHUD();
}

function startGame() {
  gameState = GAME_STATES.PLAYING;
  levelIndex = 0;
  totalScore = 0;
  score = 0;
  lives = 3;
  setScreen("title-screen");
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
  player.x = 50;
  player.y = 100;
  player.vx = 0;
  player.vy = 0;
  player.vida = player.vidaMax;
  player.direccion = 1;
  player.cooldownDisparo = 0;
  score = 0;
  projectiles = [];
  enemies = [];
  platforms = [];

  platforms.push({ x: 0, y: 280, w: 560, h: 40 });
  platforms.push({ x: 150, y: 210, w: 110, h: 18 });
  platforms.push({ x: 310, y: 165, w: 110, h: 18 });

  enemies.push({ x: 180, y: 240, w: 30, h: 40, vx: 1.5, rango: 80, inicio: 180 });
  enemies.push({ x: 390, y: 120, w: 30, h: 40, vx: -1.8, rango: 72, inicio: 390 });

  meta = { x: 515, y: 220, w: 24, h: 60, activo: true };
  updateHUD();
}

function currentLevel() {
  return LEVELS[levelIndex] || LEVELS[LEVELS.length - 1];
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

function playDisparoSound() {
  if (osc) {
    osc.freq(random(400, 800));
    env.play(osc);
  }
}

function playImpactSound() {
  if (osc) {
    osc.freq(random(150, 300));
    env.play(osc);
  }
}

function playCatchSound() {
  if (osc) {
    osc.freq(random(600, 900));
    env.play(osc);
  }
}

function updateInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx = -MOVE_SPEED;
    player.direccion = -1;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx = MOVE_SPEED;
    player.direccion = 1;
  } else {
    player.vx *= FRICTION;
  }

  if ((keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) && player.enSuelo) {
    player.vy = JUMP_FORCE;
    player.enSuelo = false;
  }

  if ((keyIsDown(74) || keyIsDown(90)) && player.cooldownDisparo <= 0) {
    disparar();
    player.cooldownDisparo = 20;
  }

  if (player.cooldownDisparo > 0) player.cooldownDisparo--;
}

function updatePlayer() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  player.enSuelo = false;
  for (let p of platforms) {
    if (colisionRect(player, p)) {
      if (player.vy > 0 && player.y + player.h - player.vy <= p.y + 4) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.enSuelo = true;
      } else if (player.vy < 0 && player.y - player.vy >= p.y + p.h - 4) {
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > width) player.x = width - player.w;
  if (player.y > height + 40) {
    player.vida = 0;
    loseLife();
  }
}

function disparar() {
  projectiles.push({
    x: player.x + (player.direccion > 0 ? player.w : 0),
    y: player.y + player.h / 3,
    vx: player.direccion * 8,
    w: 10,
    h: 6,
    activo: true
  });
  playDisparoSound();
}

function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let pr = projectiles[i];
    pr.x += pr.vx;
    if (pr.x < 0 || pr.x > width || !pr.activo) {
      projectiles.splice(i, 1);
    }
  }
}

function updateEnemies() {
  for (let e of enemies) {
    e.x += e.vx;
    if (Math.abs(e.x - e.inicio) > e.rango) {
      e.vx *= -1;
    }
  }
}

function colisionRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function checkCollisions() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let pr = projectiles[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      let e = enemies[j];
      if (colisionRect(pr, e)) {
        enemies.splice(j, 1);
        projectiles.splice(i, 1);
        score += 100;
        totalScore += 1;
        playImpactSound();
        break;
      }
    }
  }

  for (let e of enemies) {
    if (colisionRect(player, e)) {
      player.vida--;
      player.x = 50;
      player.y = 100;
      if (player.vida <= 0) {
        loseLife();
      }
      break;
    }
  }

  if (meta && colisionRect(player, meta) && score >= levelGoal) {
    advanceLevel();
  }
}

function drawEntities() {
  fill(player.color);
  rect(player.x, player.y, player.w, player.h);

  fill("#ffff00");
  for (let pr of projectiles) {
    rect(pr.x, pr.y, pr.w, pr.h);
  }

  fill("#ff0000");
  for (let e of enemies) {
    rect(e.x, e.y, e.w, e.h);
  }

  fill("#444444");
  for (let p of platforms) {
    rect(p.x, p.y, p.w, p.h);
  }

  fill("#00ff00");
  if (meta) rect(meta.x, meta.y, meta.w, meta.h);
}

function drawHUD() {
  fill("#00ffcc");
  textSize(12);
  textFont("Courier New");
  textAlign(LEFT, TOP);
  text(`HÉROE: ${HEROES[selectedHero].name}`, 15, 18);
  text(`VIDAS: ${lives}`, 15, 34);
  text(`PUNTAJE: ${totalScore}`, 15, 50);
  text(`META: ${Math.max(levelGoal - score, 0)}`, 15, 66);
  text(`TIEMPO: ${Math.max(0, ceil(levelTimer))}s`, 15, 82);
}

function drawPromptCounter() {
  fill("#00ffcc");
  textSize(12);
  textFont("Courier New");
  textAlign(RIGHT, TOP);
  text(`PROMPTS: ${promptCount}`, width - 15, 20);
}

function seedFromTopDownCatchMode() {
  const level = currentLevel();
  drawScenarioBackdrop(level.theme, level.name);
  drawBackgroundGrid();
  noFill();
  stroke("#00ffcc55");
  rect(0, 0, width, height);
}

function draw() {
  const level = currentLevel();
  drawScenarioBackdrop(level.theme, level.name);

  if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.HERO_SELECT) {
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

  updateInput();
  updatePlayer();
  updateProjectiles();
  updateEnemies();
  checkCollisions();
  drawEntities();
  drawHUD();
  drawPromptCounter();

  if (player.vida <= 0) {
    loseLife();
  }

  levelTimer -= 0.016;
  if (levelTimer <= 0) {
    loseLife();
  }

  if (score >= levelGoal && meta) {
    advanceLevel();
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === GAME_STATES.MENU) {
      gameState = GAME_STATES.HERO_SELECT;
      setScreen("hero-screen");
      setStatus("Seleccioná a tu campeón.");
      return;
    }

    if (gameState === GAME_STATES.HERO_SELECT) {
      startGame();
      return;
    }

    if (gameState === GAME_STATES.VICTORY || gameState === GAME_STATES.GAME_OVER) {
      gameState = GAME_STATES.MENU;
      setScreen("title-screen");
      setStatus("Elegí a tu héroe para liberar la campaña.");
      hideHUD();
      return;
    }
  }

  if (key === "1") {
    selectedHero = "San Martín";
    player.color = HEROES["San Martín"].accent;
    updateHUD();
  } else if (key === "2") {
    selectedHero = "Belgrano";
    player.color = HEROES.Belgrano.accent;
    updateHUD();
  } else if (key === "3") {
    selectedHero = "Güemes";
    player.color = HEROES.Güemes.accent;
    updateHUD();
  }

  if (key === "p" || key === "P") {
    registerPrompt();
  }
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "P") {
    registerPrompt();
  }
});
