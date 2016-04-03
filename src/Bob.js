var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 3;
var ANIM_SPEED  = 0.3;

function Bob(level) {
	this.level = level;

	this.x  = level.bob.x || 0;
	this.y  = level.bob.y || 0;
	this.sx = 0;
	this.sy = 0;

	// animation
	this.frame = 0;
	this.flipH = false;

	this.grounded = false;
	this.jumping  = 0;
}

module.exports = Bob;

Bob.prototype.update = function () {
	var level = this.level;

	if (!this.grounded) {
		this.sy += GRAVITY;
		this.sy = Math.min(this.sy, MAX_GRAVITY);
	}

	// round speed
	this.sx = ~~(this.sx * 100) / 100;
	this.sy = ~~(this.sy * 100) / 100;

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	var front       = 8;
	var frontOffset = 0;
	if (this.sx < 0) { front = 0; frontOffset = 8; }

	// front collision
	if (this.sx !== 0) {
		if (level.getTileAt(x + front, this.y + 1).isSolid || level.getTileAt(x + front, this.y + 7).isSolid) {
			this.sx = 0;
			x = ~~(x / TILE_WIDTH) * TILE_WIDTH + frontOffset;
		}
	}

	if (this.grounded) {
		// down
		var tileDL = level.getTileAt(x + 1, y + 9);
		var tileDR = level.getTileAt(x + 7, y + 9);
		if (tileDL.isEmpty && tileDR.isEmpty) this.grounded = false;
	} else if (this.sy > 0) {
		// air down
		var tileDL = level.getTileAt(x + 1, y + 8);
		var tileDR = level.getTileAt(x + 7, y + 8);
		if (tileDL.isSolid || tileDR.isSolid) {
			this.grounded = true;
			this.jumping = 0;
			this.sy = 0;
			y = ~~((y + 8) / TILE_HEIGHT) * TILE_HEIGHT - 8;
		} else if (tileDL.isTopSolid || tileDR.isTopSolid) {
			// TODO
			this.grounded = true;
			this.jumping = 0;
			this.sy = 0;
			y = ~~((y + 8) / TILE_HEIGHT) * TILE_HEIGHT - 8;
		}
	} else if (this.sy < 0) {
		// air up

		// TODO

	}

	this.x = x;
	this.y = y;
};

Bob.prototype.jump = function () {
	if (!this.grounded && this.jumping > 12) return;
	this.jumping++;
	this.grounded = false;
	this.sy = -3 + this.jumping * 0.08;
};

Bob.prototype.goLeft = function () {
	this.sx = -1;
	this.flipH = true;
	this.frame += ANIM_SPEED;
};

Bob.prototype.goRight = function () {
	this.sx = 1;
	this.flipH = false;
	this.frame += ANIM_SPEED;
};

Bob.prototype.draw = function () {
	var s = 255;
	if (this.sx > 0.4 || this.sx < -0.4) {
		if (this.frame >= 3) this.frame = 0;
		s = 154 + ~~this.frame;
	}
	sprite(s, this.x, this.y, this.flipH);
};