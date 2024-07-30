import MovingPlatform from "./objects/movingPlatform.js";
import Ball from "./objects/ball.js";
import { createResizeCanvasObserver } from "./resizeCanvasObserver.js";
import { isTouchDevice } from "./isTouch.js";

const RESOLUTION = 1920;
const ASPECT_RATIO = 16 / 9;
const MAX_FPS = 120;

document.documentElement.style.setProperty("--aspect-ratio", ASPECT_RATIO);

const isTouch = isTouchDevice();
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
if (!isTouch) {
  leftArrow.remove();
  rightArrow.remove();
}

const gameoverScreen = document.querySelector(".gameover-screen");
const againButton = document.querySelector(".again-button");
const totalScore = document.querySelector(".total-score");

const startButtton = document.querySelector(".start-button");
const startScreen = document.querySelector(".start-screen");

if (isTouch) {
  startButtton.addEventListener("click", function () {
    const elem = document.documentElement; // or document.body

    function enterFullscreen() {
      return new Promise((resolve, reject) => {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().then(resolve).catch(reject);
        } else if (elem.mozRequestFullScreen) {
          // Firefox
          elem.mozRequestFullScreen().then(resolve).catch(reject);
        } else if (elem.webkitRequestFullscreen) {
          // Chrome, Safari, and Opera
          elem.webkitRequestFullscreen().then(resolve).catch(reject);
        } else if (elem.msRequestFullscreen) {
          // IE/Edge
          elem.msRequestFullscreen().then(resolve).catch(reject);
        } else {
          reject(new Error("Fullscreen API is not supported on this device."));
        }
      });
    }

    function lockOrientation() {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation
          .lock("landscape-primary")
          .then(function () {
            console.log("Screen orientation locked to landscape-primary");
          })
          .catch(function (error) {
            console.error("Screen orientation lock failed:", error);
          });
      } else {
        // Fallback for Safari and other browsers that don't support screen.orientation.lock
        const lockFunction =
          screen.lockOrientation ||
          screen.mozLockOrientation ||
          screen.msLockOrientation;
        if (lockFunction) {
          const success = lockFunction.call(screen, "landscape-primary");
          if (success) {
            console.log("Screen orientation locked to landscape-primary");
          } else {
            console.error("Screen orientation lock failed");
          }
        } else {
          console.log(
            "Screen Orientation API is not supported on this device."
          );
        }
      }
    }

    enterFullscreen()
      .then(lockOrientation)
      .catch(function (error) {
        console.error("Failed to enter fullscreen mode:", error);
      });
  });
}

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

let interval;

function startNewGame() {
  if (interval) {
    clearInterval(interval);
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
    rightArrow
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // game interval to process everything
  interval = setInterval(() => {
    movingPlatform.clearRect(ctx);
    ball.clearRect(ctx);
    movingPlatform.move(canvas, leftArrow, rightArrow);
    ball.move(
      canvas,
      movingPlatform.getPlatformInfo(),
      level,
      score,
      gameoverScreen,
      totalScore
    );
    movingPlatform.draw(ctx);
    ball.draw(ctx);
  }, 1000 / MAX_FPS);
}

startButtton.addEventListener("click", () => {
  startScreen.classList.add("active");
  if (isTouch) {
    setTimeout(() => {
      startNewGame();
    }, 500);
  } else {
    startNewGame();
  }
});

againButton.addEventListener("click", () => {
  gameoverScreen.classList.remove("active");
  startNewGame();
});
