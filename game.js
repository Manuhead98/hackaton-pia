let gameState = 'PLAYING';
let score = 0;
let promptCount = 0;

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const FRICTION = 0.8;

let player = {
  x: 50,
  y: 200,
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

  initNivel();
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

function draw() {
  background(11, 15, 25);
  drawGrid();

  if (gameState === 'PLAYING') {
    updateInput();
    updatePlayer();
    updateProjectiles();
    updateEnemies();
    checkCollisions();
    checkMeta();
    drawEntities();
    drawHUD();
  } else if (gameState === 'GAME_OVER') {
    drawGameOver();
  } else if (gameState === 'VICTORY') {
    drawVictory();
  }

  drawPromptCounter();
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
    gameState = 'GAME_OVER';
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
        gameState = 'GAME_OVER';
      }
      break;
    }
  }
}

function checkMeta() {
  if (meta && colisionRect(player, meta)) {
    gameState = 'VICTORY';
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
  text('VIDAS: ' + player.vida, 15, 25);
  text('PUNTAJE: ' + score, 15, 45);
  text('ESTADO: ' + gameState, 15, 65);
}

function drawGameOver() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  fill('#ff0000');
  textSize(24);
  textAlign(CENTER);
  text('DERROTA', width / 2, height / 2 - 20);
  textSize(14);
  text('Presiona R para reiniciar', width / 2, height / 2 + 20);
  textAlign(LEFT);
}

function drawVictory() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  fill('#00ff00');
  textSize(24);
  textAlign(CENTER);
  text('VICTORIA', width / 2, height / 2 - 20);
  textSize(14);
  text('Presiona R para reiniciar', width / 2, height / 2 + 20);
  textAlign(LEFT);
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
  text('PROMPTS: ' + promptCount, width - 100, 25);
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

function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (gameState === 'GAME_OVER' || gameState === 'VICTORY') {
      initNivel();
      gameState = 'PLAYING';
    }
  }
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
