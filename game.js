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
    accent: "#00ffcc",
    music: "musica/sanmartin.mp3"
  },
  Belgrano: {
    name: "Manuel Belgrano",
    campaign: "Éxodo Jujeño",
    accent: "#ffd166",
    music: "musica/belgrano.mp3"
  },
  Güemes: {
    name: "Martín Miguel de Güemes",
    campaign: "Guardianes del Norte",
    accent: "#ff8fab",
    music: "musica/guemes.mp3"
  }
};

const CAMPAIGNS = {
  "San Martín": [
    { name: "Campamento del Ejército de los Andes", goal: 2, timeLimit: 35, theme: "andesCamp" },
    { name: "Cruce de la cordillera", goal: 3, timeLimit: 45, theme: "cordillera" },
    { name: "Camino a la libertad", goal: 4, timeLimit: 55, theme: "libertad", boss: "Comandante realista" }
  ],
  Belgrano: [
    { name: "Éxodo Jujeño", goal: 2, timeLimit: 35, theme: "jujuy" },
    { name: "Defensa de Tucumán", goal: 3, timeLimit: 45, theme: "tucuman" },
    { name: "Victoria de Salta", goal: 4, timeLimit: 55, theme: "salta", boss: "Comandante realista" }
  ],
  "Güemes": [
    { name: "Guardianes del Norte", goal: 2, timeLimit: 35, theme: "norte" },
    { name: "Emboscada en el valle", goal: 3, timeLimit: 45, theme: "valle" },
    { name: "La última resistencia", goal: 4, timeLimit: 55, theme: "resistencia", boss: "Comandante realista" }
  ]
};
const LEVELS_PER_CAMPAIGN = 3;

let gameState = GAME_STATES.MENU;
let selectedHero = "San Martín";
let levelIndex = 0;
let lives = 2;
let totalScore = 0;
let levelGoal = CAMPAIGNS["San Martín"][0].goal;
let levelTimer = CAMPAIGNS["San Martín"][0].timeLimit;
let levelTransitionStart = 0;
let completedLevelName = "";
let enemiesDefeated = 0;
let finalBoss = null;

let player = {
  x: 50,
  y: 100,
  w: 30,
  h: 40,
  vx: 0,
  vy: 0,
  vida: 2,
  vidaMax: 2,
  direccion: 1,
  enSuelo: false,
  cooldownDisparo: 0,
  damageCooldown: 0,
  color: "#00ffcc"
};

let projectiles = [];
let enemyProjectiles = [];
let enemies = [];
let platforms = [];
let meta = null;
let osc, env;
let gameCanvas;
let campaignMusic = null;
let gameAudioMuted = false;

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
  startCampaignMusic();
  levelIndex = 0;
  totalScore = 0;
  score = 0;
  lives = 2;
  setScreen("title-screen");
  hideMenuPanels();
  showHUD();
  updateHUD();
  resetLevel();
  setStatus(`${HEROES[selectedHero].campaign} activa.`);
}

function startCampaignMusic() {
  const musicPath = HEROES[selectedHero]?.music;
  if (!musicPath || gameAudioMuted) return;

  if (campaignMusic && campaignMusic.src !== new URL(musicPath, document.baseURI).href) {
    campaignMusic.pause();
    campaignMusic.currentTime = 0;
    campaignMusic = null;
  }

  if (!campaignMusic) {
    campaignMusic = new Audio(musicPath);
    campaignMusic.loop = true;
    campaignMusic.preload = "auto";
    campaignMusic.volume = 0.35;
  }

  const playback = campaignMusic.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {
      setStatus("La música no pudo iniciarse. Activá el audio y volvé a comenzar.");
    });
  }
}

function stopCampaignMusic() {
  if (campaignMusic) {
    campaignMusic.pause();
    campaignMusic.currentTime = 0;
  }
}

function setGameAudioMuted(muted) {
  gameAudioMuted = Boolean(muted);
  if (campaignMusic) campaignMusic.muted = gameAudioMuted;
  if (typeof soundCat !== "undefined" && soundCat) soundCat.muted = gameAudioMuted;

  if (gameAudioMuted) {
    if (osc) osc.amp(0, 0.05);
  } else if (gameState === GAME_STATES.PLAYING) {
    startCampaignMusic();
  }
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
  updateBossHealthUI();
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
  player.vida = lives;
  player.direccion = 1;
  player.cooldownDisparo = 0;
  player.damageCooldown = 0;
  score = 0;
  enemiesDefeated = 0;
  projectiles = [];
  enemyProjectiles = [];
  enemies = [];
  finalBoss = null;
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
      shotCooldown: 1 + Math.random() * 1.2,
      shotInterval: 2.6 + Math.random() * 0.8,
      sprite: i % 2 === 0 ? "infantry" : "officer"
    });
  }

  if (level.boss) {
    finalBoss = {
      name: level.boss,
      x: 426,
      y: 214,
      w: 54,
      h: 66,
      vx: -0.9,
      minX: 394,
      maxX: 472,
      groundY: 214,
      vy: 0,
      movement: "patrol",
      movementTimer: 2.2,
      shotCooldown: 1.5,
      chargeDirection: -1,
      hp: 12,
      maxHp: 12,
      defeated: false,
      sprite: "boss"
    };
  }

  meta = { x: 515, y: 220, w: 24, h: 60, activo: true };
  updateHUD();
}

function updateBossHealthUI() {
  const panel = document.getElementById("boss-health-panel");
  const title = document.getElementById("boss-health-name");
  const fill = document.getElementById("boss-health-fill");
  const value = document.getElementById("boss-health-value");
  const track = panel?.querySelector('[role="progressbar"]');
  if (!panel || !title || !fill || !value) return;

  const bossIsActive = Boolean(finalBoss && !finalBoss.defeated);
  panel.classList.toggle("hidden", !bossIsActive);
  if (!bossIsActive) return;

  const healthRatio = Math.max(0, finalBoss.hp / finalBoss.maxHp);
  title.textContent = finalBoss.name;
  fill.style.width = `${healthRatio * 100}%`;
  value.textContent = `${Math.max(0, finalBoss.hp)}/${finalBoss.maxHp}`;
  fill.classList.toggle("low", healthRatio <= 0.3);
  track?.setAttribute("aria-valuenow", String(Math.max(0, finalBoss.hp)));
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
    stopCampaignMusic();
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
  damagePlayer();
}

function playDisparoSound() {
  if (osc && !gameAudioMuted) {
    osc.freq(random(400, 800));
    env.play(osc);
  }
}

function playImpactSound() {
  if (osc && !gameAudioMuted) {
    osc.freq(random(150, 300));
    env.play(osc);
  }
}

function playCatchSound() {
  if (osc && !gameAudioMuted) {
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
  if (player.damageCooldown > 0) {
    player.damageCooldown = Math.max(0, player.damageCooldown - deltaTime / 1000);
  }

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

  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const projectile = enemyProjectiles[i];
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    if (projectile.x < -20 || projectile.x > width + 20 || projectile.y < -20 || projectile.y > height + 20) {
      enemyProjectiles.splice(i, 1);
      continue;
    }
    if (colisionRect(projectile, player)) {
      enemyProjectiles.splice(i, 1);
      damagePlayer();
    }
  }
}

function updateEnemies() {
  for (let e of enemies) {
    e.x += e.vx;
    if (Math.abs(e.x - e.inicio) > e.rango) {
      e.vx *= -1;
    }

    e.shotCooldown -= deltaTime / 1000;
    if (e.shotCooldown <= 0) {
      fireEnemyShot(e);
      e.shotCooldown = e.shotInterval;
    }
  }

  if (finalBoss && !finalBoss.defeated) updateFinalBoss();
}

function fireEnemyShot(enemy) {
  const originX = enemy.x + enemy.w / 2;
  const originY = enemy.y + enemy.h / 2;
  const targetX = player.x + player.w / 2;
  const targetY = player.y + player.h / 2;
  const angle = Math.atan2(targetY - originY, targetX - originX);
  const speed = 2.8;

  enemyProjectiles.push({
    x: originX,
    y: originY,
    w: 8,
    h: 7,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    kind: "infantry"
  });
}

function updateFinalBoss() {
  const boss = finalBoss;
  const frameScale = Math.min(deltaTime / (1000 / 60), 2);
  boss.shotCooldown -= deltaTime / 1000;
  boss.movementTimer -= deltaTime / 1000;

  if (boss.shotCooldown <= 0) {
    fireBossVolley();
    boss.shotCooldown = 1.8;
  }

  if (boss.movementTimer <= 0 && boss.movement !== "leap") {
    if (boss.movement === "patrol") {
      boss.movement = "aim";
      boss.movementTimer = 0.65;
    } else if (boss.movement === "aim") {
      boss.movement = "charge";
      boss.chargeDirection = player.x < boss.x ? -1 : 1;
      boss.vx = boss.chargeDirection * 3.6;
      boss.movementTimer = 0.55;
    } else if (boss.movement === "charge") {
      boss.movement = "leap";
      boss.vy = -8.5;
      boss.vx = boss.chargeDirection * 1.5;
      boss.movementTimer = 1.1;
    } else {
      boss.movement = "patrol";
      boss.vx = boss.chargeDirection * -1.2;
      boss.movementTimer = 1.6;
    }
  }

  boss.x += boss.vx * frameScale;
  if (boss.x <= boss.minX || boss.x >= boss.maxX) {
    boss.x = constrain(boss.x, boss.minX, boss.maxX);
    boss.vx *= -1;
    if (boss.movement === "charge") boss.movementTimer = 0;
  }

  if (boss.movement === "leap") {
    boss.vy += GRAVITY * frameScale;
    boss.y += boss.vy * frameScale;
    if (boss.y >= boss.groundY) {
      boss.y = boss.groundY;
      boss.vy = 0;
      boss.movement = "patrol";
      boss.vx = boss.chargeDirection * -1.2;
      boss.movementTimer = 1.5;
    }
  }
}

function fireBossVolley() {
  if (!finalBoss || finalBoss.defeated) return;

  const originX = finalBoss.x + finalBoss.w / 2;
  const originY = finalBoss.y + 24;
  const targetX = player.x + player.w / 2;
  const targetY = player.y + player.h / 2;
  const aimAngle = Math.atan2(targetY - originY, targetX - originX);
  const spread = [-0.18, 0, 0.18];

  spread.forEach((offset) => {
    const angle = aimAngle + offset;
    const speed = 3.2;
    enemyProjectiles.push({
      x: originX,
      y: originY,
      w: 9,
      h: 7,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      kind: "boss"
    });
  });
  playImpactSound();
}

function damagePlayer() {
  if (player.damageCooldown > 0 || gameState !== GAME_STATES.PLAYING) return;

  lives = Math.max(0, lives - 1);
  player.vida = lives;
  player.damageCooldown = 0.85;
  player.vx = 0;
  player.vy = -3;
  updateHUD();

  if (lives <= 0) {
    gameState = GAME_STATES.GAME_OVER;
    stopCampaignMusic();
    setStatus("Perdiste las dos vidas. La misión terminó.");
    hideHUD();
    return;
  }

  setStatus("¡Recibiste un golpe! Te queda una vida.");
}

function colisionRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function checkCollisions() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let pr = projectiles[i];
    if (finalBoss && !finalBoss.defeated && colisionRect(pr, finalBoss)) {
      finalBoss.hp -= 1;
      projectiles.splice(i, 1);
      playImpactSound();
      if (finalBoss.hp <= 0) {
        finalBoss.hp = 0;
        finalBoss.defeated = true;
        totalScore += 5;
        setStatus(`${finalBoss.name} derrotado. La salida patriótica está abierta.`);
        updateHUD();
      }
      updateBossHealthUI();
      continue;
    }

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
      damagePlayer();
      break;
    }
  }

  if (finalBoss && !finalBoss.defeated && colisionRect(player, finalBoss)) {
    damagePlayer();
  }

  const regularEnemiesCleared = enemiesDefeated >= levelGoal;
  const bossCleared = !finalBoss || finalBoss.defeated;
  if (meta && colisionRect(player, meta) && regularEnemiesCleared && bossCleared) {
    advanceLevel();
  }
}

function drawEntities() {
  drawHeroPixel(selectedHero, player.x - 5, player.y - 20, Math.abs(player.vx) > 0.3, player.direccion < 0);

  fill("#ffff00");
  for (let pr of projectiles) {
    rect(pr.x, pr.y, pr.w, pr.h);
  }

  noStroke();
  for (const shot of enemyProjectiles) {
    fill(shot.kind === "boss" ? "#6d271f" : "#7d3030");
    rect(shot.x, shot.y, shot.w, shot.h);
    fill(shot.kind === "boss" ? "#e5b54e" : "#d8b768");
    rect(shot.x + 2, shot.y + 2, 4, 3);
  }

  for (let e of enemies) {
    drawEnemyPixel(e);
  }

  if (finalBoss && !finalBoss.defeated) {
    if (finalBoss.movement === "aim") {
      fill("#fff0bd");
      textFont("Georgia");
      textSize(9);
      textAlign(CENTER, BOTTOM);
      text("¡APUNTA!", finalBoss.x + finalBoss.w / 2, finalBoss.y - 5);
    } else if (finalBoss.movement === "charge") {
      noStroke();
      fill("#b84432");
      rect(finalBoss.x - finalBoss.chargeDirection * 20, finalBoss.y + 36, 12, 5);
      rect(finalBoss.x - finalBoss.chargeDirection * 34, finalBoss.y + 44, 8, 4);
    }
    drawEnemyPixel(finalBoss);
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
  const bossRemaining = finalBoss && !finalBoss.defeated ? " · JEFE EN PIE" : "";
  text(`ADVERSARIOS: ${enemiesDefeated}/${levelGoal}${bossRemaining}`, 18, 52);
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
    if (player.damageCooldown <= 0) {
      levelTimer = currentLevel().timeLimit;
      loseLife();
    }
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
      stopCampaignMusic();
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

