// ============================================================
// Week 2 hnabbasi_SQ_W2
//  Platformer with Platforms Array
// ============================================================

let platforms = [
  { x: 0,   y: 410, w: 800, h: 40 },

  { x: 60,  y: 330, w: 120, h: 16, angle: -0.08 },
  { x: 220, y: 280, w: 120, h: 16, angle: 0.08 },
  { x: 400, y: 230, w: 120, h: 16, angle: -0.1 },
  { x: 580, y: 180, w: 120, h: 16, angle: 0.1 },

  { x: 420, y: 140, w: 110, h: 16, angle: -0.08 },
  { x: 260, y: 110, w: 110, h: 16, angle: 0.08 },

  { x: 100, y: 200, w: 100, h: 16, angle: -0.12 }
];

let player = {
  x: 100,
  y: 100,

  vx: 0,
  vy: 0,

  r: 20,

  speed: 0.55,
  maxSpeed: 4.5,
  jumpForce: -12,
  friction: 0.78,

  onGround: false,
};

const GRAVITY = 0.6;

let blobT = 0;

const PLATFORM_COLOR = "#02d8f0";

let bgImage;

function preload() {
  bgImage = loadImage("assets/images/Background.jpg");
}

// ============================================================

function setup() {
  createCanvas(800, 450);
  player.y = platforms[0].y - player.r;
}

function draw() {
  image(bgImage, 0, 0, width, height);

  handleInput();
  applyPhysics();
  resolvePlatformCollisions();

  drawPlatforms();
  drawPlayer();
  drawHUD();

  blobT += 0.015;
}

// ------------------------------------------------------------

function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx += player.speed;
  }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) {
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

// ------------------------------------------------------------

function applyPhysics() {
  player.vy += GRAVITY;

  player.x += player.vx;
  player.y += player.vy;

  player.x = constrain(player.x, player.r, width - player.r);

  if (player.y > height + 100) {
    player.x = 100;
    player.y = platforms[0].y - player.r;
    player.vx = 0;
    player.vy = 0;
  }

  player.onGround = false;
}

// ------------------------------------------------------------

function resolvePlatformCollisions() {
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    let playerLeft   = player.x - player.r;
    let playerRight  = player.x + player.r;
    let playerBottom = player.y + player.r;

    let platLeft  = p.x;
    let platRight = p.x + p.w;
    let platTop   = p.y;

    let overlapsHorizontally =
      playerRight > platLeft && playerLeft < platRight;

    let landingOnTop =
      player.vy >= 0 &&
      playerBottom >= platTop &&
      playerBottom <= platTop + 20;

    if (overlapsHorizontally && landingOnTop) {
      player.y = platTop - player.r;
      player.vy = 0;
      player.onGround = true;
    }
  }
}

// ------------------------------------------------------------

function drawPlatforms() {
  fill(PLATFORM_COLOR);
  noStroke();

  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    push();

    translate(p.x + p.w / 2, p.y + p.h / 2);
    rotate(p.angle || 0);

    rectMode(CENTER);
    rect(0, 0, p.w, p.h, 6);

    pop();
  }
}

// ------------------------------------------------------------

function drawPlayer() {
  push();

  fill(0, 200, 180);
  noStroke();

  beginShape();
  let numPoints = 48;
  for (let i = 0; i < numPoints; i++) {
    let angle = (TWO_PI / numPoints) * i;

    let noiseVal = noise(cos(angle) * 0.8 + blobT, sin(angle) * 0.8 + blobT);

    let r = player.r + map(noiseVal, 0, 1, -7, 7);

    vertex(player.x + cos(angle) * r, player.y + sin(angle) * r);
  }
  endShape(CLOSE);

  fill(10);
  ellipse(player.x - 7, player.y - 5, 7, 7);
  ellipse(player.x + 7, player.y - 5, 7, 7);

  pop();
}

// ------------------------------------------------------------

function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}