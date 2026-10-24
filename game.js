let gameState = 'MENU';
let score = 0;
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
  color: '#00ffcc'
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

  resetLevel();
}

function resetLevel() {
  const level = currentLevel();
  levelGoal = level.goal;
  levelTimer = level.timeLimit;
  initNivel();
  updateHUD();
}

function initNivel() {
  player.x = 50;
  player.y = 100;
  player.vx = 0;
  player.vy = 0;
  player.vida = player.vidaMax;
  player.direccion = 1;
  player.cooldownDisparo = 0;
  projectiles = [];
  enemies = [];
  platforms = [];
  score = 0;

  platforms.push({ x: 0, y: 280, w: 560, h: 40 });
  platforms.push({ x: 150, y: 200, w: 100, h: 20 });
  platforms.push({ x: 300, y: 160, w: 100, h: 20 });

  enemies.push({ x: 200, y: 240, w: 30, h: 40, vx: 2, rango: 80, inicio: 200 });
  enemies.push({ x: 400, y: 120, w: 30, h: 40, vx: -2, rango: 60, inicio: 400 });

  meta = { x: 520, y: 220, w: 30, h: 60, activo: true };
}

function currentLevel() {
  return LEVELS[levelIndex] || LEVELS[LEVELS.length - 1];
}

function advanceLevel() {
  if (levelIndex < LEVELS.length - 1) {
    levelIndex += 1;
    gameState = GAME_STATES.LEVEL_COMPLETE;
    levelTransitionStart = millis();
  } else {
    gameState = GAME_STATES.VICTORY;
  }
}

function loseLife() {
  lives -= 1;

  if (lives <= 0) {
    gameState = GAME_STATES.GAME_OVER;
    return;
  }

  resetLevel();
  gameState = GAME_STATES.PLAYING;
}

function registerPrompt() {
  promptCount += 1;
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

function draw() {
  background(11, 15, 25);
  drawGrid();

  if (gameState === GAME_STATES.MENU) {
    drawMenu();
    drawPromptCounter();
    return;
  }

  if (gameState === GAME_STATES.HERO_SELECT) {
    drawHeroSelect();
    drawPromptCounter();
    return;
  }

  if (gameState === GAME_STATES.PLAYING) {
    updateInput();
    updatePlayer();
    updateProjectiles();
    updateEnemies();
    checkCollisions();
    checkMeta();
    drawEntities();
    drawHUD();
    drawPromptCounter();
    return;
  }

  if (gameState === GAME_STATES.LEVEL_COMPLETE) {
    drawLevelComplete();
    drawPromptCounter();
    if (millis() - levelTransitionStart > 1200) {
      resetLevel();
      gameState = GAME_STATES.PLAYING;
    }
    return;
  }

  if (gameState === GAME_STATES.VICTORY) {
    drawVictory();
    drawPromptCounter();
    return;
  }

  if (gameState === GAME_STATES.GAME_OVER) {
    drawGameOver();
    drawPromptCounter();
    return;
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
      if (player.vy > 0 && player.y + player.h - player.vy <= p.y) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.enSuelo = true;
      } else if (player.vy < 0 && player.y - player.vy >= p.y + p.h) {
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > width) player.x = width - player.w;
  if (player.y > height) {
    player.vida = 0;
    checkCollisions();
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
}

function checkMeta() {
  if (meta && colisionRect(player, meta)) {
    if (score >= levelGoal) {
      advanceLevel();
    } else {
      gameState = GAME_STATES.VICTORY;
    }
  }
}

function colisionRect(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function drawEntities() {
  fill(player.color);
  rect(player.x, player.y, player.w, player.h);

  fill('#ffff00');
  for (let pr of projectiles) {
    rect(pr.x, pr.y, pr.w, pr.h);
  }

  fill('#ff0000');
  for (let e of enemies) {
    rect(e.x, e.y, e.w, e.h);
  }

  fill('#444444');
  for (let p of platforms) {
    rect(p.x, p.y, p.w, p.h);
  }

  fill('#00ff00');
  if (meta) rect(meta.x, meta.y, meta.w, meta.h);
}

function drawHUD() {
  fill('#00ffcc');
  textSize(14);
  textFont('Courier New');
  textAlign(LEFT, TOP);
  text('Héroe: ' + HEROES[selectedHero].name, 15, 18);
  text('VIDAS: ' + lives, 15, 34);
  text('PUNTAJE: ' + totalScore, 15, 50);
  text('META: ' + Math.max(levelGoal - score, 0), 15, 66);
  text('TIEMPO: ' + Math.max(0, ceil(levelTimer)) + 's', 15, 82);
  text('ESTADO: ' + gameState, 15, 98);
}

function drawGrid() {
  stroke(0, 255, 204, 15);
  strokeWeight(1);
  for (let x = 0; x < width; x += 16) line(x, 0, x, height);
  for (let y = 0; y < height; y += 16) line(0, y, width, y);
}

function drawPromptCounter() {
  fill('#00ffcc');
  textSize(12);
  textFont('Courier New');
  textAlign(RIGHT, TOP);
  text('PROMPTS: ' + promptCount, width - 15, 20);
}

function drawMenu() {
  fill('#00ffcc');
  textSize(24);
  textAlign(CENTER, CENTER);
  text('HÉROES DE LA INDEPENDENCIA', width / 2, height / 3);
  textSize(16);
  text('Presioná Enter para comenzar', width / 2, height / 2);
  textSize(12);
  text('Desarrollador A: Gameplay | Desarrollador B: UI y Escenarios', width / 2, height / 2 + 40);
}

function drawHeroSelect() {
  fill('#00ffcc');
  textSize(20);
  textAlign(CENTER, CENTER);
  text('SELECCIONÁ TU HÉROE', width / 2, height / 4);
  textSize(14);
  let i = 0;
  for (let key in HEROES) {
    let h = HEROES[key];
    fill(h.accent);
    text((i + 1) + '. ' + h.name + ' - ' + h.campaign, width / 2, height / 3 + i * 30);
    i++;
  }
  textSize(12);
  fill('#00ffcc');
  text('Presioná 1, 2 o 3 para elegir', width / 2, height - 40);
}

function drawLevelComplete() {
  fill('#00ffcc');
  textSize(20);
  textAlign(CENTER, CENTER);
  text('NIVEL COMPLETADO', width / 2, height / 2);
  textSize(12);
  text('Siguiente escenario: ' + currentLevel().name, width / 2, height / 2 + 25);
}

function drawVictory() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);
  fill('#00ff00');
  textSize(24);
  textAlign(CENTER, CENTER);
  text('¡VICTORIA!', width / 2, height / 2 - 20);
  textSize(14);
  text('Presioná Enter para volver al menú', width / 2, height / 2 + 25);
}

function drawGameOver() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);
  fill('#ff0000');
  textSize(24);
  textAlign(CENTER, CENTER);
  text('DERROTA', width / 2, height / 2 - 20);
  textSize(14);
  text('Presioná Enter para volver al menú', width / 2, height / 2 + 25);
}

function keyPressed() {
  if (key === 'Enter' || keyCode === ENTER) {
    if (gameState === GAME_STATES.MENU) {
      gameState = GAME_STATES.HERO_SELECT;
    } else if (gameState === GAME_STATES.HERO_SELECT) {
      startGame();
    } else if (gameState === GAME_STATES.VICTORY || gameState === GAME_STATES.GAME_OVER) {
      gameState = GAME_STATES.MENU;
    }
  }

  if (key === '1') {
    selectedHero = "San Martín";
    player.color = HEROES["San Martín"].accent;
  } else if (key === '2') {
    selectedHero = "Belgrano";
    player.color = HEROES.Belgrano.accent;
  } else if (key === '3') {
    selectedHero = "Güemes";
    player.color = HEROES.Güemes.accent;
  }

  if (key === 'p' || key === 'P') {
    registerPrompt();
  }

  if (key === 'r' || key === 'R') {
    if (gameState === GAME_STATES.GAME_OVER || gameState === GAME_STATES.VICTORY) {
      gameState = GAME_STATES.MENU;
    }
  }
}

function startGame() {
  gameState = GAME_STATES.PLAYING;
  levelIndex = 0;
  totalScore = 0;
  lives = 3;
  resetLevel();
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
