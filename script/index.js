import MovingPlatform from "./objects/movingPlatform.js";
import Ball from "./objects/ball.js";
import { createResizeCanvasObserver } from "./resizeCanvasObserver.js";
import { isTouchDevice } from "./isTouch.js";

const RESOLUTION = 1920;
const ASPECT_RATIO = 16 / 9;
const MAX_FPS = 60;

document.documentElement.style.setProperty("--aspect-ratio", ASPECT_RATIO);

const isTouch = isTouchDevice();
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
if (!isTouch) {
  leftArrow.remove()
  rightArrow.remove();
}

const gameoverScreen = document.querySelector(".gameover-screen");
const againButton = document.querySelector(".again-button");
const totalScore = document.querySelector(".total-score");

const startButtton = document.querySelector(".start-button");
const startScreen = document.querySelector(".start-screen");

const score = document.querySelector(".score");
const level = document.querySelector(".level");
const canvasContainer = document.querySelector(".canvas-container");
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = RESOLUTION;
canvas.height = RESOLUTION / ASPECT_RATIO;

const resizeOberver = createResizeCanvasObserver(canvasContainer, ASPECT_RATIO);

if (canvasContainer) {
  resizeOberver.observe(document.body);
}

let loginInterval;
let renderInterval;

function startNewGame() {
  if (loginInterval) {
    clearInterval(loginInterval);
  }
  if (renderInterval) {
    clearInterval(renderInterval);
  }

  score.innerHTML = "score: 0";
  level.innerHTML = "level: 1";

  const ball = new Ball(
    canvas.width / 2,
    canvas.height / 2,
    25,
    "rgb(100,35,255)"
  );

  const PLATFORM_WIDTH = 200;
  const PLATFORM_HEIGHT = 30;
  const movingPlatform = new MovingPlatform(
    canvas.width / 2 - PLATFORM_WIDTH / 2,
    canvas.height - PLATFORM_HEIGHT - 20,
    PLATFORM_WIDTH,
    PLATFORM_HEIGHT,
    "rgb(208,137,255)",
		isTouch,
		leftArrow,
		rightArrow,
  );

  // game interval to process everything
  loginInterval = setInterval(() => {
    movingPlatform.move(canvas, leftArrow, rightArrow);
    ball.move(
      canvas,
      movingPlatform.getPlatformInfo(),
      level,
      score,
      gameoverScreen,
      totalScore
    );
  }, 1000 / 120);

  // game interval to render everything
  renderInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movingPlatform.draw(ctx);
    ball.draw(ctx);
  }, 1000 / MAX_FPS);
}

startButtton.addEventListener("click", () => {
  startScreen.classList.add("active");
  startNewGame();
});

againButton.addEventListener("click", () => {
  gameoverScreen.classList.remove("active");
  startNewGame();
});