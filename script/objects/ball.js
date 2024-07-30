class Ball {
  constructor(x, y, radius, color) {
    this._x = x;
    this._y = y;
    this._radius = radius;
    this._color = color;
    this._speed = 6;
    this._maxSpeed = 15;
    this._direction = [
      -Math.random() * (Math.PI / 6) - Math.PI / 6,
      -Math.random() * (Math.PI / 6) - (Math.PI / 3) * 2,
    ][Math.floor(Math.random() * 2)];
  }

  borderCollision(canvas) {
    if (this._x + this._width > canvas.width) {
      this._x = canvas.width - this._width;
    }
    if (this._x < 0) {
      this._x = 0;
    }
  }

  move(canvas, platform, level, score, gameoverScreen, totalScore) {
    this._x += Math.cos(this._direction) * this._speed;
    this._y += Math.sin(this._direction) * this._speed;
    if (this._x > canvas.width - this._radius) {
      this._x = canvas.width - this._radius;
      this._direction = Math.PI - this._direction;
    }
    if (this._x < this._radius) {
      this._x = this._radius;
      this._direction = Math.PI - this._direction;
    }
    if (this._y < this._radius) {
      this._y = this._radius;
      this._direction = Math.PI * 2 - this._direction;
    }
    if (
      this._x + this._radius > platform.x &&
      this._x - this._radius < platform.x + platform.width &&
      this._y + this._radius > platform.y &&
      this._y < platform.y + platform.height
    ) {
      this._y = platform.y - this._radius;
      this._direction =
        Math.PI * 2 - this._direction + Math.random() * 0.2 - 0.1;
      this._speed += 0.2;
      if (this._speed > this._maxSpeed) {
        this._speed = this._maxSpeed;
      }
      score.innerHTML = "score: " + (+score.textContent.slice(7) + 1);
      level.innerHTML = "level: " + String(Math.floor(this._speed) - 2);
    }
		if (this._y - this._radius > canvas.height) {
			gameoverScreen.classList.add("active");
			totalScore.innerHTML = score.textContent.slice(7)
		}
  }

	clearRect(ctx) {
		ctx.fillStyle = "white";
		ctx.fillRect(this._prevX - this._radius - 5, this._prevY - this._radius - 5, this._radius * 2 + 10, this._radius * 2 + 10);
	}

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this._color;
		ctx.lineWidth = 5;
    ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI, false);
    ctx.stroke();
		this._prevX = this._x;
		this._prevY = this._y;
  }
}

export default Ball;
