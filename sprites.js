let imgClosed, imgOpen;

// Sprites dibujados en una grilla pequeña para conservar bordes pixelados.
let heroSprites = {};
let enemySprites = {};

// preload() carga los archivos de imagen antes de iniciar el juego
function preload() {
    imgClosed = loadImage(BOCA_CERRADA_B64);
    imgOpen   = loadImage(BOCA_ABIERTA_B64);
    soundCat = new Audio(MAULLIDO_B64);

    // Las figuras son versiones arcade estilizadas de los héroes seleccionables.
    heroSprites.sanMartin = createPixelArtCanvas(32, 48, drawSanMartin);
    heroSprites.guemes    = createPixelArtCanvas(32, 48, drawGuemes);
    heroSprites.belgrano  = createPixelArtCanvas(32, 48, drawBelgrano);
    enemySprites.infantry = createPixelArtCanvas(32, 48, drawRoyalistInfantry);
    enemySprites.officer = createPixelArtCanvas(32, 48, drawRoyalistOfficer);
    enemySprites.boss = createPixelArtCanvas(48, 64, drawRoyalistBoss);
}

// -------------------------------------------------------------
// GENERADORES DE SPRITES PIXEL ART (Héroes de la Independencia)
// -------------------------------------------------------------
function createPixelArtCanvas(width, height, drawCallback) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawCallback(ctx, width, height);

    const sprite = createImage(width, height);
    sprite.drawingContext.drawImage(canvas, 0, 0);
    return sprite;
}

function drawPixelRows(ctx, rows, palette, pixelSize = 2) {
    rows.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
            const color = palette[row[x]];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    });
}

// 1. Granadero: shako alto, uniforme azul y banda roja.
function drawSanMartin(ctx) {
    drawPixelRows(ctx, [
        '      GGGG      ', '     GGGGGG     ', '     DDDDDD     ',
        '      DGGD      ', '      SSSS      ', '     HSSSSH     ',
        '      SSSS      ', '       DD       ', '    DDDDDDDD    ',
        '   DDUUUUUUDD   ', '   DUUURRRUUD   ', '   DUURRRRRUD   ',
        '   DUUURRRUUD   ', '   DDUUGGGUUD   ', '  DD UUUUUU DD  ',
        '  D  UUUUUU  D  ', '     UUPPUU     ', '     UUPPUU     ',
        '     PPPPPP     ', '     PP  PP     ', '     BB  BB     ',
        '     BB  BB     ', '    BBB  BBB    ', '    DDD  DDD    '
    ], { D:'#17202b', G:'#f4c542', S:'#d99a70', H:'#45291d', U:'#234c78', R:'#b8323e', P:'#ddd8c8', B:'#3a2a24' });
}

// 2. Güemes: sombrero ancho, poncho rojo y botas de campaña.
function drawGuemes(ctx) {
    drawPixelRows(ctx, [
        '    DDDDDDDD    ', '  DDDDDDDDDDDD  ', ' DDDDDDDDDDDDDD ',
        '     HHHHHH     ', '     SSSSSS     ', '    HSSSSSSH    ',
        '     SSSSSS     ', '     DDDDDD     ', '    DDDDDDDD    ',
        '   DDDRRRRDDD   ', '   DDRRRRRRDD   ', '  DDRRRRRRRRDD  ',
        '  DRRRRGGRRRRD  ', '  DDRRRRRRRRDD  ', '   DD RRRR DD   ',
        '     RRRRRR     ', '     RRRRRR     ', '     PPPPPP     ',
        '    PP    PP    ', '    PP    PP    ', '   BBB    BBB   ',
        '   BBB    BBB   ', '  BBBB    BBBB  ', '  DDDD    DDDD  '
    ], { D:'#241a19', H:'#48301f', S:'#d8a078', R:'#9f2937', G:'#e3b34e', P:'#493a2f', B:'#271c18' });
}

// 3. Belgrano: uniforme celeste y blanco con escarapela visible.
function drawBelgrano(ctx) {
    drawPixelRows(ctx, [
        '      GGGG      ', '     GGGGGG     ', '     DDDDDD     ',
        '      HHHH      ', '      SSSS      ', '     HSSSSH     ',
        '      SSSS      ', '       DD       ', '    DDDDDDDD    ',
        '   DDUUUUUUDD   ', '   DUBBWWBBUD   ', '   DUUBBWWBUD   ',
        '   DUUBBWWBUD   ', '   DDUUUUUUDD   ', '  DD UUUUUU DD  ',
        '  D  UUUUUU  D  ', '     UUUUUU     ', '     UUUUUU     ',
        '     PPPPPP     ', '     PP  PP     ', '     BB  BB     ',
        '     BB  BB     ', '    BBB  BBB    ', '    DDD  DDD    '
    ], { D:'#1d2835', G:'#d8b35a', H:'#493026', S:'#e0ad83', U:'#305b91', B:'#80c9e8', W:'#f3f0df', P:'#ded8c6' });
}

// Enemigos ficticios del juego: infantería y oficial realista, no retratos históricos.
function drawRoyalistInfantry(ctx) {
    drawPixelRows(ctx, [
        '      GGGG      ', '    DDDDDDDD    ', '   DDDDDDDDDD   ',
        '      SSSS      ', '     HSSSSH     ', '      SSSS      ',
        '       DD       ', '    DDDDDDDD    ', '   DDRRRRRRDD   ',
        '   DRRRRRRRRD   ', '   DDUURRRRDD   ', '  DD UURRRR UU D',
        '  D  UURRRR UU D', '     RRRRRR     ', '     RRRRRR     ',
        '     PPPPPP     ', '    PP    PP    ', '    PP    PP    ',
        '   BBB    BBB   ', '   BBB    BBB   ', '  BBBB    BBBB  ',
        '  DDDD    DDDD  ', '      WWWWWWWWW ', '      WDDDDDDD  '
    ], { D:'#272432', G:'#d7b14a', S:'#d99f78', H:'#3c2922', R:'#7d2c36', U:'#263d5b', P:'#c9c3b5', B:'#342621', W:'#9ca9b1' });
}

function drawRoyalistOfficer(ctx) {
    drawPixelRows(ctx, [
        '      GGGG      ', '     DDDDDD     ', '    DDDDDDDD    ',
        '      SSSS      ', '     HSSSSH     ', '      SSSS      ',
        '       DD       ', '    DDDDDDDD    ', '   DDDGGGGDDD   ',
        '   DDUUUUUUDD   ', '   DUUGGGGUUD   ', '  DD UURRRR UU D',
        '  D  UURRRR UU D', '     UUGGUU     ', '     UUUUUU     ',
        '     UUUUUU     ', '     PPPPPP     ', '    PP    PP    ',
        '    PP    PP    ', '   BBB    BBB   ', '   BBB    BBB   ',
        '  BBBB    BBBB  ', '  DDDD    DDDD  ', '  WWWWWWWWWWW   '
    ], { D:'#202733', G:'#e0b94f', S:'#d9a17b', H:'#35241e', U:'#354c72', R:'#9b3039', P:'#d4cbbb', B:'#30231f', W:'#9ca9b1' });
}

// Jefe ficticio: comandante de la tropa realista con bicornio, charreteras y sable.
function drawRoyalistBoss(ctx) {
    drawPixelRows(ctx, [
        '        GGGGGGGG        ', '      GGGGGGGGGGGG      ',
        '    DDDDDDDDDDDDDDDD    ', '   DDDDDDDDDDDDDDDDDD   ',
        '          HHHH          ', '         SSSSSS         ',
        '        HSSSSSSH        ', '         SSSSSS         ',
        '          DDDD          ', '     DDDDDDDDDDDDDD     ',
        '    DDDGGGGGGGGDDDD    ', '   DDGUUUUUUUUUUGDD     ',
        '   DDUUGGGGGGGGUUDD     ', '   DDUURRRRRRRRUUDD     ',
        '  DD UURRRRRRRRUU DD    ', '  D  UUUUUUUUUUUU  D    ',
        '     UUGGGGGGGGUU       ', '     UUUUUUUUUUUU       ',
        '    UUUUUUUUUUUUUU      ', '    UUPPUUUUUUPPUU      ',
        '   DD PPPPPPPPPP DD     ', '      PP      PP        ',
        '      PP      PP        ', '     BBBB    BBBB       ',
        '     BBBB    BBBB       ', '    BBBBB    BBBBB      ',
        '    DDDDD    DDDDD      ', '       DDDDDDDDDD        ',
        '       DDDDDDDDDD        ', '       W          DDD   ',
        '       WW          DD   ', '       WWWWWWWWWWWWWW    '
    ], { D:'#201e20', G:'#d9b14b', H:'#38261e', S:'#d9a17b', U:'#334968', R:'#8d3038', P:'#d7c9a5', B:'#30241e', W:'#c6c6bd' });
}

// Función auxiliar para renderizar al Héroe seleccionado en pantalla
function drawHeroPixel(heroKey, x, y, isMoving, facingRight) {
    const spriteKey = {
        'San Martín': 'sanMartin',
        Belgrano: 'belgrano',
        'Güemes': 'guemes'
    }[heroKey] || heroKey;
    const heroImage = heroSprites[spriteKey] || heroSprites.sanMartin;
    if (!heroImage) return;

    push();
    translate(x, y);
    const w = 40;
    const h = 60;

    if (facingRight) {
        scale(-1, 1);
        translate(-w, 0);
    }

    image(heroImage, 0, 0, w, h);
    pop();
}

function drawEnemyPixel(enemy) {
    const enemyImage = enemySprites[enemy.sprite] || enemySprites.infantry;
    if (!enemyImage) return;

    const spriteWidth = enemy.sprite === 'boss' ? 64 : 36;
    const spriteHeight = enemy.sprite === 'boss' ? 80 : 54;
    const spriteX = enemy.x - (spriteWidth - enemy.w) / 2;
    const spriteY = enemy.y - (spriteHeight - enemy.h);

    push();
    if (enemy.vx < 0) {
        translate(spriteX + spriteWidth, spriteY);
        scale(-1, 1);
        image(enemyImage, 0, 0, spriteWidth, spriteHeight);
    } else {
        image(enemyImage, spriteX, spriteY, spriteWidth, spriteHeight);
    }
    pop();
}

const SCENARIO_THEMES = {
    andesCamp: { sky:'#799ab0', far:'#647e82', near:'#405b50', earth:'#725d42', sun:'#f4c56a' },
    cordillera: { sky:'#8bb7cf', far:'#768b9b', near:'#4c6575', earth:'#7d877d', sun:'#f6efd9' },
    libertad: { sky:'#78a9bd', far:'#637f84', near:'#435e50', earth:'#8d704d', sun:'#f2c66c' },
    jujuy: { sky:'#e8ad70', far:'#a8614d', near:'#7b493e', earth:'#bd8050', sun:'#ffe09a' },
    tucuman: { sky:'#91b9bd', far:'#718b75', near:'#45644e', earth:'#866d48', sun:'#f5d27c' },
    salta: { sky:'#88b7c3', far:'#657b70', near:'#3f624a', earth:'#96774e', sun:'#f3d17b' },
    norte: { sky:'#d99a67', far:'#a65f4d', near:'#714944', earth:'#ad7748', sun:'#ffe09a' },
    valle: { sky:'#81a9ad', far:'#74836f', near:'#4e6254', earth:'#83704b', sun:'#f2cd77' },
    resistencia: { sky:'#52697d', far:'#554f5b', near:'#393f45', earth:'#655642', sun:'#e2a75c' }
};

function pixelBlock(x, y, w, h, shade) {
    noStroke();
    fill(shade);
    rect(x, y, w, h);
}

function drawPixelCloud(x, y, shade) {
    pixelBlock(x + 8, y, 24, 8, shade);
    pixelBlock(x, y + 8, 48, 8, shade);
    pixelBlock(x + 8, y + 16, 32, 8, shade);
}

function drawPixelMountain(x, base, widthPx, heightPx, shade, highlight) {
    const step = 8;
    for (let column = 0; column < widthPx / step; column++) {
        const normalized = 1 - Math.abs((column / (widthPx / step - 1)) * 2 - 1);
        const mountainHeight = Math.max(step, Math.floor((normalized * heightPx) / step) * step);
        pixelBlock(x + column * step, base - mountainHeight, step, mountainHeight, shade);
    }
    if (highlight) {
        pixelBlock(x + widthPx * 0.42, base - heightPx, 16, 8, highlight);
        pixelBlock(x + widthPx * 0.36, base - heightPx + 8, 8, 8, highlight);
        pixelBlock(x + widthPx * 0.58, base - heightPx + 8, 8, 8, highlight);
    }
}

function drawArgentineFlag(x, y, scale = 1) {
    const unit = 4 * scale;
    pixelBlock(x, y, 2 * scale, 48 * scale, '#493f35');
    pixelBlock(x + 2 * scale, y, 30 * scale, 8 * scale, '#78bfe0');
    pixelBlock(x + 2 * scale, y + 8 * scale, 30 * scale, 8 * scale, '#f6f0dc');
    pixelBlock(x + 2 * scale, y + 16 * scale, 30 * scale, 8 * scale, '#78bfe0');
    pixelBlock(x + 14 * scale, y + 9 * scale, unit, 6 * scale, '#edc85a');
    pixelBlock(x + 12 * scale, y + 11 * scale, 8 * scale, 2 * scale, '#edc85a');
}

function drawAdobeHouse(x, y, shade, roof) {
    pixelBlock(x, y + 16, 64, 40, shade);
    pixelBlock(x - 8, y + 8, 80, 12, roof);
    pixelBlock(x + 12, y + 32, 12, 24, '#493b31');
    pixelBlock(x + 42, y + 30, 10, 12, '#4a5550');
}

function drawScenarioLandmarks(themeKey) {
    const ground = 256;
    switch (themeKey) {
        case 'andesCamp':
            drawPixelMountain(18, ground, 180, 120, '#60787c', '#e8e5d8');
            drawPixelMountain(210, ground, 210, 152, '#526c72', '#f1eee1');
            drawPixelMountain(420, ground, 170, 112, '#405c62', '#e3e4db');
            // Campamento cordillerano: tiendas, cajas y bandera.
            pixelBlock(70, 216, 72, 40, '#d6c5a0'); pixelBlock(102, 190, 8, 26, '#d6c5a0');
            pixelBlock(78, 224, 12, 32, '#75634b'); pixelBlock(118, 224, 12, 32, '#75634b');
            pixelBlock(430, 224, 44, 32, '#b28a58'); pixelBlock(438, 216, 28, 8, '#d0a96f');
            drawArgentineFlag(500, 190, 1);
            break;
        case 'cordillera':
            drawPixelMountain(0, ground, 210, 160, '#687c88', '#f3f1e5');
            drawPixelMountain(165, ground, 220, 184, '#526b7c', '#fff9e8');
            drawPixelMountain(380, ground, 220, 148, '#405969', '#e6e9e5');
            pixelBlock(0, 240, 560, 16, '#c8d1cc');
            pixelBlock(236, 224, 88, 8, '#e7e8dc'); pixelBlock(284, 208, 64, 8, '#e7e8dc');
            pixelBlock(340, 232, 84, 8, '#e7e8dc');
            drawArgentineFlag(48, 190, 1);
            break;
        case 'libertad':
            drawPixelMountain(0, ground, 180, 104, '#647d73', '#d8d7c8');
            drawPixelMountain(200, ground, 220, 128, '#536e68', '#e7e4d6');
            drawPixelMountain(415, ground, 180, 100, '#405f55', '#d5d4c5');
            pixelBlock(0, 236, 560, 20, '#a6885e');
            pixelBlock(190, 228, 64, 8, '#c6a671'); pixelBlock(286, 216, 72, 8, '#c6a671');
            drawAdobeHouse(70, 184, '#b9956c', '#8d6048');
            drawArgentineFlag(470, 188, 1);
            break;
        case 'jujuy':
            drawPixelMountain(0, ground, 200, 104, '#a85f50', '#d59368');
            drawPixelMountain(180, ground, 220, 148, '#874e48', '#c98261');
            drawPixelMountain(390, ground, 190, 120, '#70464a', '#b97559');
            drawAdobeHouse(44, 188, '#c78b58', '#81483d');
            drawAdobeHouse(132, 204, '#d09a60', '#8f5143');
            pixelBlock(0, 244, 560, 12, '#bd8856');
            drawArgentineFlag(500, 190, 1);
            break;
        case 'tucuman':
            drawPixelMountain(0, ground, 180, 88, '#778b76', '#afaa7c');
            drawPixelMountain(370, ground, 190, 104, '#5b7862', '#a5a879');
            pixelBlock(0, 230, 560, 26, '#58774e');
            // Defensa de pueblo: parapeto bajo y casas de tejas.
            drawAdobeHouse(56, 188, '#d0b27a', '#8e5947');
            drawAdobeHouse(142, 196, '#c9a66e', '#814e43');
            pixelBlock(324, 220, 120, 36, '#8a8061');
            pixelBlock(316, 212, 136, 8, '#b1a17b');
            drawArgentineFlag(478, 184, 1);
            break;
        case 'salta':
            drawPixelMountain(0, ground, 180, 108, '#788b75', '#c0b584');
            drawPixelMountain(360, ground, 200, 120, '#55745d', '#b0ae7d');
            pixelBlock(0, 238, 560, 18, '#688352');
            // Fachada colonial con torre y campanario, estilo de videojuego.
            pixelBlock(198, 196, 132, 60, '#dfc798');
            pixelBlock(182, 188, 164, 12, '#9c5f45');
            pixelBlock(210, 178, 24, 18, '#dfc798'); pixelBlock(294, 178, 24, 18, '#dfc798');
            pixelBlock(216, 168, 12, 12, '#9c5f45'); pixelBlock(300, 168, 12, 12, '#9c5f45');
            pixelBlock(254, 222, 20, 34, '#58483a');
            pixelBlock(244, 206, 12, 14, '#6e8a88'); pixelBlock(276, 206, 12, 14, '#6e8a88');
            drawArgentineFlag(480, 186, 1);
            break;
        case 'norte':
            drawPixelMountain(0, ground, 180, 112, '#ac694e', '#d99a69');
            drawPixelMountain(160, ground, 230, 148, '#85544c', '#c6815f');
            drawPixelMountain(390, ground, 190, 116, '#68464a', '#af7058');
            pixelBlock(0, 244, 560, 12, '#ab794e');
            pixelBlock(82, 224, 50, 8, '#d2a56a'); pixelBlock(398, 228, 64, 8, '#d2a56a');
            drawArgentineFlag(500, 190, 1);
            break;
        case 'valle':
            drawPixelMountain(0, ground, 220, 140, '#786f5c', '#ba9a6c');
            drawPixelMountain(340, ground, 220, 152, '#596b5c', '#a98e68');
            pixelBlock(0, 236, 560, 20, '#7e795e');
            drawPixelCloud(226, 60, '#d9ded0');
            pixelBlock(116, 222, 48, 8, '#aa956b'); pixelBlock(360, 216, 56, 8, '#aa956b');
            drawArgentineFlag(48, 190, 1);
            break;
        case 'resistencia':
            drawPixelMountain(0, ground, 200, 132, '#5d5960', '#8c7b69');
            drawPixelMountain(360, ground, 210, 144, '#464e55', '#817365');
            pixelBlock(0, 240, 560, 16, '#665b48');
            pixelBlock(168, 204, 224, 52, '#756b58');
            pixelBlock(156, 192, 16, 64, '#91816a'); pixelBlock(388, 192, 16, 64, '#91816a');
            pixelBlock(148, 184, 32, 12, '#a18e72'); pixelBlock(380, 184, 32, 12, '#a18e72');
            pixelBlock(212, 220, 24, 36, '#4a433a'); pixelBlock(324, 220, 24, 36, '#4a433a');
            drawArgentineFlag(280, 164, 1);
            break;
    }
}

function drawScenarioBackdrop(themeKey, label) {
    const theme = SCENARIO_THEMES[themeKey] || SCENARIO_THEMES.andesCamp;
    background(theme.sky);

    noStroke();
    fill(theme.sun);
    rect(448, 38, 24, 24);
    drawPixelCloud(66, 52, '#d5e0d9');
    drawPixelCloud(320, 76, '#d5e0d9');

    drawPixelMountain(0, 226, width, 90, theme.far, null);
    drawScenarioLandmarks(themeKey);

    // Capa de suelo y pequeños bloques de pasto/piedra para mantener el pixel art.
    pixelBlock(0, 256, width, 64, theme.earth);
    for (let x = 0; x < width; x += 32) {
        const variation = (x / 32) % 3;
        pixelBlock(x, 256 + variation * 4, 16, 4, theme.near);
        pixelBlock(x + 20, 270 + ((variation + 1) % 3) * 4, 8, 4, theme.far);
    }

    // Mantener el nombre visible en una plaqueta arcade sin cubrir el escenario.
    fill('#18252b');
    rect(12, 12, 260, 24);
    fill('#f4edda');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(label.toUpperCase(), 20, 24);
}

function drawPatrioticGate(gate, isOpen) {
    const x = gate.x - 9;
    const y = gate.y - 8;

    // Arco de madera con remaches: la salida ya no es un rectángulo verde.
    pixelBlock(x, y + 10, 8, 58, '#67472e');
    pixelBlock(x + 34, y + 10, 8, 58, '#67472e');
    pixelBlock(x - 4, y + 4, 50, 10, '#875e39');
    pixelBlock(x + 4, y + 14, 8, 4, '#c39b5e');
    pixelBlock(x + 30, y + 14, 8, 4, '#c39b5e');

    // Cortina con colores patrios, iluminada al completar la misión.
    pixelBlock(x + 12, y + 22, 18, 40, isOpen ? '#78bfe0' : '#526d78');
    pixelBlock(x + 12, y + 34, 18, 8, '#f6f0dc');
    if (isOpen) {
        pixelBlock(x + 18, y + 36, 6, 4, '#e2b94e');
        pixelBlock(x + 10, y + 18, 22, 4, '#f1cf76');
    }

    pixelBlock(x + 1, y + 68, 14, 6, '#5b4631');
    pixelBlock(x + 27, y + 68, 14, 6, '#5b4631');

    // Pequeña banderita argentina en la parte superior del arco.
    pixelBlock(x + 20, y - 16, 2, 20, '#594835');
    pixelBlock(x + 22, y - 16, 20, 6, '#78bfe0');
    pixelBlock(x + 22, y - 10, 20, 6, '#f6f0dc');
    pixelBlock(x + 22, y - 4, 20, 6, '#78bfe0');
    pixelBlock(x + 30, y - 10, 4, 4, '#e2b94e');

    fill(isOpen ? '#244d6b' : '#4d4638');
    textAlign(CENTER, BOTTOM);
    textSize(8);
    text(isOpen ? 'AVANZAR' : 'CERRADO', x + 21, y - 18);
}

// Dibujar al Pop Cat usando las imágenes de assets con animación de boca
function drawCatPixel(x, y, isMoving, facingRight) {
    push();
    translate(x, y);
    
    let w = 60; // Ancho de la imagen en pantalla
    let h = 60; // Alto de la imagen en pantalla

    // Soporte para espejar la imagen si camina hacia el otro lado
    if (facingRight) {
        scale(-1, 1);
        translate(-w, 0);
    }

    // Elegir qué imagen mostrar según si se está moviendo
    let currentImg = imgClosed;
    if (isMoving) {
        if (floor(frameCount / 6) % 2 === 0) {
            currentImg = imgOpen;
        } else {
            currentImg = imgClosed;
        }
    }

    // Dibujar la imagen en el canvas
    image(currentImg, 0, 0, w, h);
    pop();
}

// Matriz y funciones para el Puntero Láser (por código)
const SPRITE_LASER = [
    [0,0,3,3,3,3,0,0],
    [0,3,1,1,1,1,3,0],
    [3,1,1,2,2,1,1,3],
    [3,1,2,2,2,2,1,3],
    [3,1,2,2,2,2,1,3],
    [3,1,1,2,2,1,1,3],
    [0,3,1,1,1,1,3,0],
    [0,0,3,3,3,3,0,0]
];

function drawPixel(x, y, colorCode) {
    fill(colorCode);
    noStroke();
    rect(x * 3, y * 3, 3, 3);
}

// Dibuja el láser con rayo proyectado, destellos y auras de luz
function drawLaserPixel(x, y) {
    push();

    // 1. ORIGEN DEL LÁSER (Esquina superior derecha fuera de la pantalla)
    let originX = width + 20;
    let originY = -20;
    
    // Centro del impacto del láser
    let targetX = x + 12;
    let targetY = y + 12;

    // 2. RAYO / HAZ LUMINOSO PROYECTADO
    let beamAlpha = map(sin(frameCount * 0.3), -1, 1, 70, 110);
    
    stroke(255, 0, 85, beamAlpha * 0.4);
    strokeWeight(6);
    line(originX, originY, targetX, targetY);

    stroke(255, 200, 220, beamAlpha);
    strokeWeight(2);
    line(originX, originY, targetX, targetY);

    // 3. EFECTO DE IMPACTO EN EL SUELO (PUNTO Y AURAS)
    translate(x, y);

    let pulseSize = 26 + sin(frameCount * 0.2) * 6;
    noStroke();
    fill(255, 0, 85, 40);
    ellipse(12, 12, pulseSize * 1.5, pulseSize * 1.5);

    fill(255, 0, 85, 90);
    ellipse(12, 12, pulseSize, pulseSize);

    for (let row = 0; row < SPRITE_LASER.length; row++) {
        for (let col = 0; col < SPRITE_LASER[row].length; col++) {
            let val = SPRITE_LASER[row][col];
            if (val === 1) drawPixel(col, row, '#ff0055');
            if (val === 2) drawPixel(col, row, '#ffffff');
            if (val === 3) drawPixel(col, row, '#ff66aa');
        }
    }

    for (let i = 0; i < 3; i++) {
        let angle = (frameCount * 0.1) + (i * TWO_PI / 3);
        let px = 12 + cos(angle) * 14;
        let py = 12 + sin(angle) * 14;
        fill(255, 150, 200, 180);
        rect(px, py, 2, 2);
    }

    pop();
}

// Fondo Grid Cyberpunk
function drawBackgroundGrid() {
    stroke(0, 255, 204, 15);
    strokeWeight(1);
    for (let x = 0; x < width; x += 16) line(x, 0, x, height);
    for (let y = 0; y < height; y += 16) line(0, y, width, y);
}
// let imgClosed, imgOpen;

// // preload() carga los archivos de imagen antes de iniciar el juego
// function preload() {
//     imgClosed = loadImage(BOCA_CERRADA_B64);
//     imgOpen   = loadImage(BOCA_ABIERTA_B64);
//     soundCat = new Audio(MAULLIDO_B64);
// }

// const SCENARIO_THEMES = {
//     andes: {
//         sky: "#0a1220",
//         mist: "#00ffcc",
//         ground: "#112233",
//         accent: "#ffd166",
//         mountain: "#29415f",
//         detail: "#77d7ff"
//     },
//     cordillera: {
//         sky: "#141b2a",
//         mist: "#63c7ff",
//         ground: "#2b2a3a",
//         accent: "#ff8fab",
//         mountain: "#3e4c6d",
//         detail: "#ffd166"
//     },
//     norte: {
//         sky: "#1b0f17",
//         mist: "#ffbf69",
//         ground: "#2d1d1d",
//         accent: "#ff7e5f",
//         mountain: "#5d3d43",
//         detail: "#ffd9a8"
//     }
// };

// // Dibujar al Pop Cat usando las imágenes de assets con animación de boca
// function drawCatPixel(x, y, isMoving, facingRight) {
//     push();
//     translate(x, y);
    
//     let w = 60; // Ancho de la imagen en pantalla
//     let h = 60; // Alto de la imagen en pantalla

//     // Soporte para espejar la imagen si camina hacia el otro lado
//     if (facingRight) {
//         scale(-1, 1);
//         translate(-w, 0);
//     }

//     // Elegir qué imagen mostrar según si se está moviendo
//     let currentImg = imgClosed;
//     if (isMoving) {
//         if (floor(frameCount / 6) % 2 === 0) {
//             currentImg = imgOpen;
//         } else {
//             currentImg = imgClosed;
//         }
//     }

//     // Dibujar la imagen en el canvas
//     image(currentImg, 0, 0, w, h);
//     pop();
// }

// // Matriz y funciones para el Puntero Láser (por código)
// const SPRITE_LASER = [
//     [0,0,3,3,3,3,0,0],
//     [0,3,1,1,1,1,3,0],
//     [3,1,1,2,2,1,1,3],
//     [3,1,2,2,2,2,1,3],
//     [3,1,2,2,2,2,1,3],
//     [3,1,1,2,2,1,1,3],
//     [0,3,1,1,1,1,3,0],
//     [0,0,3,3,3,3,0,0]
// ];

// function drawPixel(x, y, colorCode) {
//     fill(colorCode);
//     noStroke();
//     rect(x * 3, y * 3, 3, 3);
// }

// function drawScenarioBackdrop(themeKey, label) {
//     const theme = SCENARIO_THEMES[themeKey] || SCENARIO_THEMES.andes;
//     background(theme.sky);

//     noStroke();
//     fill(color(theme.mist), 35);
//     for (let i = 0; i < 9; i++) {
//         const px = (i * 66) + ((frameCount * 0.25) % 24);
//         const py = 20 + (i % 3) * 30;
//         rect(px, py, 42, 10, 2);
//     }

//     fill(theme.mountain);
//     rect(0, 170, 70, 90);
//     rect(70, 140, 90, 120);
//     rect(200, 185, 85, 82);
//     rect(320, 155, 120, 106);
//     rect(470, 175, 90, 92);

//     fill(theme.ground);
//     rect(0, 245, width, 80);

//     fill(color(theme.accent), 90);
//     for (let i = 0; i < 12; i++) {
//         rect(i * 50 + 10, 252 + (i % 3) * 8, 18, 8);
//     }

//     fill(theme.detail);
//     textAlign(LEFT, TOP);
//     textSize(12);
//     text(label.toUpperCase(), 18, 18);

//     drawBackgroundGrid();
// }

// // Dibuja el láser con rayo proyectado, destellos y auras de luz
// function drawLaserPixel(x, y) {
//     push();

//     // 1. ORIGEN DEL LÁSER (Esquina superior derecha fuera de la pantalla)
//     let originX = width + 20;
//     let originY = -20;
    
//     // Centro del impacto del láser
//     let targetX = x + 12;
//     let targetY = y + 12;

//     // 2. RAYO / HAZ LUMINOSO PROYECTADO
//     // Variación sutil de intensidad para simular el parpadeo del diodo
//     let beamAlpha = map(sin(frameCount * 0.3), -1, 1, 70, 110);
    
//     // Resplandor exterior del rayo (ancho y translúcido)
//     stroke(255, 0, 85, beamAlpha * 0.4);
//     strokeWeight(6);
//     line(originX, originY, targetX, targetY);

//     // Núcleo del rayo (fino y brillante)
//     stroke(255, 200, 220, beamAlpha);
//     strokeWeight(2);
//     line(originX, originY, targetX, targetY);

//     // 3. EFECTO DE IMPACTO EN EL SUELO (PUNTO Y AURAS)
//     translate(x, y);

//     // Aura exterior pulsante (Glow neón)
//     let pulseSize = 26 + sin(frameCount * 0.2) * 6;
//     noStroke();
//     fill(255, 0, 85, 40);
//     ellipse(12, 12, pulseSize * 1.5, pulseSize * 1.5);

//     fill(255, 0, 85, 90);
//     ellipse(12, 12, pulseSize, pulseSize);

//     // Renderizado del punto píxel art central
//     for (let row = 0; row < SPRITE_LASER.length; row++) {
//         for (let col = 0; col < SPRITE_LASER[row].length; col++) {
//             let val = SPRITE_LASER[row][col];
//             if (val === 1) drawPixel(col, row, '#ff0055');
//             if (val === 2) drawPixel(col, row, '#ffffff'); // Centro blanco encandilante
//             if (val === 3) drawPixel(col, row, '#ff66aa');
//         }
//     }

//     // 4. MICRO-PARTÍCULAS DE DESTELLO (Chispas alrededor del punto)
//     for (let i = 0; i < 3; i++) {
//         let angle = (frameCount * 0.1) + (i * TWO_PI / 3);
//         let px = 12 + cos(angle) * 14;
//         let py = 12 + sin(angle) * 14;
//         fill(255, 150, 200, 180);
//         rect(px, py, 2, 2);
//     }

//     pop();
// }

// // Fondo Grid Cyberpunk
// function drawBackgroundGrid() {
//     stroke(0, 255, 204, 15);
//     strokeWeight(1);
//     for (let x = 0; x < width; x += 16) line(x, 0, x, height);
//     for (let y = 0; y < height; y += 16) line(0, y, width, y);
// }