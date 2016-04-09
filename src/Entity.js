var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];

var GRAVITY     = 0.1;
var MAX_GRAVITY = 1;

var a = assets.entities.onion;
var walk   = [a.walk0, a.walk1, a.walk2, a.walk3, a.walk4];
var attack = [a.attack0, a.attack1, a.attack2, a.attack3, a.attack4, a.attack5];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Entity() {
	this.x      = 0;
	this.y      = 0;
	this.width  = 8;
	this.height = 8;

	// rendering & animation
	this.flipH  = false;
	this.frame  = 0;
	this.animSpeed = 0.12;
	this.anim   = walk;

	// entity specific
	this.sx = 0;
	this.sy = 0;
	this.grounded = false;
	this.speed = 0.2;
	this.direction = 1;
}

module.exports = Entity;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.setPosition = function (i ,j) {
	this.x = i * TILE_WIDTH;
	this.y = j * TILE_HEIGHT;
	return this;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.update = function (level, bob) {
	if (this.grounded) {
		this.sx = this.speed * this.direction;
	} else {
		this.sy += GRAVITY;
		this.sy = Math.min(this.sy, MAX_GRAVITY);
	}

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	// check level boundaries
	var maxX = level.width * TILE_WIDTH - this.width; // TODO don't need to be calculated each frames
	if (x < 0)    {x = 0;    this.collideFront(); }
	if (x > maxX) {x = maxX; this.collideFront(); }

	var front       = 8;
	var frontOffset = 0;
	if (this.sx < 0) { front = 0; frontOffset = 8; }

	//---------------------------------------------------------
	// horizontal collisions (check 2 front point)
	if (level.getTileAt(x + front, this.y + 1).isSolid || level.getTileAt(x + front, this.y + 7).isSolid) {
		this.collideFront();
		x = ~~(x / TILE_WIDTH) * TILE_WIDTH + frontOffset;
	}

	//---------------------------------------------------------
	// vertical collisions
	if (this.grounded) {
		// check if there is still floor under Entity's feets
		var tileDL = level.getTileAt(x + 1, y + this.height + 1);
		var tileDR = level.getTileAt(x + 6, y + this.height + 1);
		if (tileDL.isEmpty && tileDR.isEmpty) {
			this.grounded = false;
			this.sx = 0;
		}
	} else if (this.sy > 0) {
		// Entity is falling. Check what is underneath
		var tileDL = level.getTileAt(x + 1, y + this.height);
		var tileDR = level.getTileAt(x + 6, y + this.height);
		if (tileDL.isSolid || tileDR.isSolid) {
			// collided with solid ground
			this._ground();
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
		} else if (tileDL.isTopSolid || tileDR.isTopSolid) {
			// collided with one-way thru platform. Check if Entity where over the edge the frame before.
			var targetY = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
			if (this.y <= targetY) {
				this._ground();
				y = targetY;
			}
		}
	} else if (this.sy < 0) {
		// Entity is moving upward. Check for ceiling collision
		var tileUL = level.getTileAt(x + 1, y);
		var tileUR = level.getTileAt(x + 6, y);
		if (tileUL.isSolid || tileUR.isSolid) {
			this.sy = 0;
			// this.jumpCounter += 2;
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT + 8;
		}
	}

	// fetch position
	this.x = x;
	this.y = y;
	this.animate();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.collideFront = function () {
	// make entity turn around
	this.direction *= -1;
	this.flipH = this.direction === -1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype._ground = function () {
	this.grounded = true;
	this.sy = 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.animate = function () {
	this.frame += this.animSpeed;
	if (this.frame >= this.anim.length) this.frame = 0;
	var img = this.anim[~~this.frame];
	draw(img, this.x, this.y - 8, this.flipH);
};
