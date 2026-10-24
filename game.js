let score = 0;
const SPEED = 4;
let isMoving = false;
let facingRight = false;

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

const CAMPAIGNS = {
  "San Martín": [
    { name: "Campamento del Ejército de los Andes", goal: 2, timeLimit: 35, theme: "andesCamp" },
    { name: "Cruce de la cordillera", goal: 3, timeLimit: 45, theme: "cordillera" },
    { name: "Camino a la libertad", goal: 4, timeLimit: 55, theme: "libertad" }
  ],
  Belgrano: [
    { name: "Éxodo Jujeño", goal: 2, timeLimit: 35, theme: "jujuy" },
    { name: "Defensa de Tucumán", goal: 3, timeLimit: 45, theme: "tucuman" },
    { name: "Victoria de Salta", goal: 4, timeLimit: 55, theme: "salta" }
  ],
  "Güemes": [
    { name: "Guardianes del Norte", goal: 2, timeLimit: 35, theme: "norte" },
    { name: "Emboscada en el valle", goal: 3, timeLimit: 45, theme: "valle" },
    { name: "La última resistencia", goal: 4, timeLimit: 55, theme: "resistencia" }
  ]
};
const LEVELS_PER_CAMPAIGN = 3;

let gameState = GAME_STATES.MENU;
let selectedHero = "San Martín";
let levelIndex = 0;
let lives = 3;
let totalScore = 0;
let levelGoal = CAMPAIGNS["San Martín"][0].goal;
let levelTimer = CAMPAIGNS["San Martín"][0].timeLimit;
let levelTransitionStart = 0;
let completedLevelName = "";
let enemiesDefeated = 0;

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
let gameCanvas;

function setup() {
  pixelDensity(1);
  gameCanvas = createCanvas(560, 320);
  gameCanvas.parent("game-container");
  noSmooth();
  gameCanvas.elt.style.imageRendering = "pixelated";
  gameCanvas.elt.style.border = "3px solid #9b7b46";
  gameCanvas.elt.style.boxShadow = "0 4px 12px rgba(45,55,48,0.22)";
  setGameCanvasVisible(false);

  osc = new p5.Oscillator("sine");
  env = new p5.Envelope();
  env.setADSR(0.01, 0.08, 0.1, 0.05);
  env.setRange(0.4, 0);
  osc.start();
  osc.amp(0);

  const previousLevelButton = document.getElementById("previous-level-btn");
  if (previousLevelButton) {
    previousLevelButton.addEventListener("click", goToPreviousLevel);
  }

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
  setGameCanvasVisible(true);
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

function setGameCanvasVisible(visible) {
  if (gameCanvas) {
    gameCanvas.elt.style.display = visible ? "block" : "none";
  }
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
    hudLevel.textContent = `${Math.min(levelIndex + 1, LEVELS_PER_CAMPAIGN)}/${LEVELS_PER_CAMPAIGN}`;
  }
  const previousLevelButton = document.getElementById("previous-level-btn");
  if (previousLevelButton) {
    previousLevelButton.disabled = levelIndex === 0;
  }

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
  enemiesDefeated = 0;
  projectiles = [];
  enemies = [];
  platforms = [];

  platforms.push({ x: 0, y: 280, w: 560, h: 40 });
  platforms.push({ x: 150, y: 210, w: 110, h: 18 });
  platforms.push({ x: 310, y: 165, w: 110, h: 18 });

  const enemySpawns = [
    { x: 180, y: 240, vx: 1.5, rango: 70 },
    { x: 390, y: 120, vx: -1.8, rango: 62 },
    { x: 290, y: 240, vx: 1.7, rango: 48 },
    { x: 470, y: 120, vx: -1.4, rango: 36 }
  ];
  for (let i = 0; i < level.goal; i++) {
    const spawn = enemySpawns[i % enemySpawns.length];
    enemies.push({
      ...spawn,
      w: 30,
      h: 40,
      inicio: spawn.x,
      sprite: i % 2 === 0 ? "infantry" : "officer"
    });
  }

  meta = { x: 515, y: 220, w: 24, h: 60, activo: true };
  updateHUD();
}

function currentLevel() {
  const campaign = CAMPAIGNS[selectedHero] || CAMPAIGNS["San Martín"];
  return campaign[levelIndex] || campaign[campaign.length - 1];
}

function advanceLevel() {
  completedLevelName = currentLevel().name;
  if (levelIndex < LEVELS_PER_CAMPAIGN - 1) {
    levelIndex += 1;
    gameState = GAME_STATES.LEVEL_COMPLETE;
    levelTransitionStart = millis();
    setStatus(`${completedLevelName} superado. Preparando la siguiente etapa.`);
    updateHUD();
  } else {
    gameState = GAME_STATES.VICTORY;
    setStatus("Victoria: la campaña fue liberada.");
    hideHUD();
  }
}

function beginCurrentLevel() {
  resetLevel();
  gameState = GAME_STATES.PLAYING;
  showHUD();
  setStatus(`Comienza ${currentLevel().name}.`);
}

function goToPreviousLevel() {
  if (levelIndex <= 0) {
    setStatus("Ya estás en el primer escenario de la campaña.");
    return;
  }

  levelIndex -= 1;
  beginCurrentLevel();
  updateHUD();
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
        enemiesDefeated += 1;
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

  if (meta && colisionRect(player, meta) && enemiesDefeated >= levelGoal) {
    advanceLevel();
  }
}

function drawEntities() {
  drawHeroPixel(selectedHero, player.x - 5, player.y - 20, Math.abs(player.vx) > 0.3, player.direccion < 0);

  fill("#ffff00");
  for (let pr of projectiles) {
    rect(pr.x, pr.y, pr.w, pr.h);
  }

  for (let e of enemies) {
    drawEnemyPixel(e);
  }

  fill("#444444");
  for (let p of platforms) {
    rect(p.x, p.y, p.w, p.h);
  }

  if (meta) drawPatrioticGate(meta, enemiesDefeated >= levelGoal);
}

function drawMissionObjective() {
  noStroke();
  fill("#244d6b");
  rect(12, 42, 174, 20);
  fill("#f7f0dc");
  textSize(10);
  textFont("Georgia");
  textAlign(LEFT, CENTER);
  text(`ADVERSARIOS: ${enemiesDefeated}/${levelGoal}`, 18, 52);
}

function drawLevelTransition() {
  noStroke();
  fill("#244d6b");
  rect(36, 66, 488, 190);
  fill("#c3a15d");
  rect(42, 72, 476, 178);
  fill("#f7f0dc");
  rect(48, 78, 464, 166);

  drawArgentineFlag(74, 98, 1);
  drawArgentineFlag(454, 98, 1);

  fill("#244d6b");
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textSize(18);
  text("¡TRAMO SUPERADO!", width / 2, 105);

  fill("#785b32");
  textSize(10);
  text(completedLevelName, width / 2, 128);
  text("PRÓXIMO DESTINO", width / 2, 151);

  fill("#173b59");
  textSize(14);
  text(currentLevel().name, width / 2, 169);

  stroke("#b99b5b");
  strokeWeight(3);
  line(228, 192, 332, 192);
  noStroke();
  for (let index = 0; index < LEVELS_PER_CAMPAIGN; index++) {
    fill(index <= levelIndex ? "#75b9d5" : "#c8b98e");
    rect(224 + index * 54, 186, 14, 14);
  }

  fill("#244d6b");
  textSize(9);
  text("ENTER: continuar     B: volver al nivel anterior", width / 2, 222);
}

function drawWoodenEndCard(isVictory) {
  const cardX = 70;
  const cardY = 76;
  const cardWidth = 420;
  const cardHeight = 168;
  const headline = isVictory ? "¡CAMPAÑA LIBERADA!" : "¡A REAGRUPARSE!";
  const message = isVictory
    ? "La misión por la patria fue cumplida."
    : "Reuní fuerzas y volvé a intentarlo.";

  // Sombra, marco y tablones horizontales para que se lea como cartel de madera.
  noStroke();
  fill(31, 38, 34, 155);
  rect(cardX + 8, cardY + 9, cardWidth, cardHeight);
  fill("#573a24");
  rect(cardX, cardY, cardWidth, cardHeight);
  fill("#98683b");
  rect(cardX + 7, cardY + 7, cardWidth - 14, cardHeight - 14);

  for (let plank = 0; plank < 4; plank++) {
    const plankY = cardY + 12 + plank * 35;
    fill(plank % 2 === 0 ? "#b07b45" : "#a47140");
    rect(cardX + 12, plankY, cardWidth - 24, 30);
    fill(255, 224, 174, 32);
    rect(cardX + 18, plankY + 4, cardWidth - 36, 2);
    fill(69, 43, 27, 70);
    rect(cardX + 18, plankY + 28, cardWidth - 36, 2);
  }

  // Refuerzos de hierro y remaches en las esquinas.
  fill("#d4b36b");
  rect(cardX + 14, cardY + 14, 5, cardHeight - 28);
  rect(cardX + cardWidth - 19, cardY + 14, 5, cardHeight - 28);
  for (const [boltX, boltY] of [
    [cardX + 12, cardY + 12], [cardX + cardWidth - 18, cardY + 12],
    [cardX + 12, cardY + cardHeight - 18], [cardX + cardWidth - 18, cardY + cardHeight - 18]
  ]) {
    fill("#f0d88e");
    circle(boltX, boltY, 6);
    fill("#76512f");
    circle(boltX, boltY, 2);
  }

  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(BOLD);
  let headlineSize = isVictory ? 24 : 27;
  textSize(headlineSize);
  while (textWidth(headline) > cardWidth - 76 && headlineSize > 17) {
    headlineSize -= 1;
    textSize(headlineSize);
  }
  stroke("#573a24");
  strokeWeight(4);
  fill("#fff1c8");
  text(headline, width / 2, cardY + 53);

  noStroke();
  textStyle(NORMAL);
  fill("#fff3d5");
  textSize(13);
  text(message, width / 2, cardY + 96);

  fill("#f0d88e");
  textStyle(BOLD);
  textSize(11);
  text("ENTER  ·  VOLVER AL MENÚ", width / 2, cardY + 135);
  textStyle(NORMAL);
}

function seedFromTopDownCatchMode() {
  const level = currentLevel();
  drawScenarioBackdrop(level.theme, level.name);
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
    drawLevelTransition();
    if (millis() - levelTransitionStart > 4500) {
      beginCurrentLevel();
    }
    return;
  }

  if (gameState === GAME_STATES.VICTORY || gameState === GAME_STATES.GAME_OVER) {
    drawWoodenEndCard(gameState === GAME_STATES.VICTORY);
    return;
  }

  updateInput();
  updatePlayer();
  updateProjectiles();
  updateEnemies();
  checkCollisions();
  drawEntities();
  drawMissionObjective();

  if (player.vida <= 0) {
    loseLife();
  }

  levelTimer -= 0.016;
  if (levelTimer <= 0) {
    loseLife();
  }

}

function keyPressed() {
  if ((key === "b" || key === "B" || key === "[") &&
      (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.LEVEL_COMPLETE)) {
    goToPreviousLevel();
    return false;
  }

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

    if (gameState === GAME_STATES.LEVEL_COMPLETE) {
      beginCurrentLevel();
      return;
    }

    if (gameState === GAME_STATES.VICTORY || gameState === GAME_STATES.GAME_OVER) {
      gameState = GAME_STATES.MENU;
      setGameCanvasVisible(false);
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

}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

