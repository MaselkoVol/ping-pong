class MovingPlatform {
  constructor(x, y, width, height, color, isTouch, leftArrow, rightArrow) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._color = color;
    this._isMovingRight = false;
    this._isMovingLeft = false;
    this._accelerationX = 0;
    this._maxAccelerationX = 10;
    this._accelerationXSpeed = 0.3;

    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
    if (isTouch) {
      leftArrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this._isMovingLeft = true;
        leftArrow.classList.add("active");
      });
      leftArrow.addEventListener("touchend", () => {
        this._isMovingLeft = false;
        leftArrow.classList.remove("active");
      });
      rightArrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this._isMovingRight = true;
        rightArrow.classList.add("active");
      });
      rightArrow.addEventListener("touchend", () => {
        this._isMovingRight = false;
        rightArrow.classList.remove("active");
      });
    }
  }

  getPlatformInfo() {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
    };
  }

  keyDown(event) {
    switch (event.code) {
      case "ArrowRight":
      case "KeyD":
        this._isMovingRight = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this._isMovingLeft = true;
        break;
    }
  }
  keyUp(event) {
    switch (event.code) {
      case "ArrowRight":
      case "KeyD":
        this._isMovingRight = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        this._isMovingLeft = false;
        break;
    }
  }
  borderCollision(canvas) {
    if (this._x + this._width > canvas.width) {
      this._x = canvas.width - this._width;
    }
    if (this._x < 0) {
      this._x = 0;
    }
  }

  move(canvas) {
    if (this._accelerationX > this._maxAccelerationX) {
      this._accelerationX = this._maxAccelerationX;
    } else if (this._accelerationX < -this._maxAccelerationX) {
      this._accelerationX = -this._maxAccelerationX;
    }

    if (this._isMovingLeft) {
      if (this._accelerationX > 0) this._accelerationX /= 2;
      this._x += this._accelerationX;
      this._accelerationX -= this._accelerationXSpeed;
    } else if (this._isMovingRight) {
      if (this._accelerationX < 0) this._accelerationX /= 2;
      this._x += this._accelerationX;
      this._accelerationX += this._accelerationXSpeed;
    } else if (Math.abs(this._accelerationX) <= this._accelerationXSpeed) {
      this._accelerationX = 0;
    } else if (this._accelerationX > 0) {
      this._x += this._accelerationX;
      this._accelerationX -= this._accelerationXSpeed;
    } else if (this._accelerationX < 0) {
      this._x += this._accelerationX;
      this._accelerationX += this._accelerationXSpeed;
    }

    this.borderCollision(canvas);
  }

  draw(ctx) {
    ctx.fillStyle = this._color;
    ctx.fillRect(this._x, this._y, this._width, this._height);
  }
}

export default MovingPlatform;
