var Level = require('./Level.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 2;

var scrollX = 0;
var scrollY = 0;

paper(6);

var level = new Level(getMap("geo0"));
var background = getMap("bg0");

// var bobPosition = level.find(255)[0];
// level.remove(bobPosition.x, bobPosition.y);

// Map.prototype.getAt = function (x, y) {
// 	return this.get(~~(x / TILE_WIDTH), ~~(y / TILE_HEIGHT));
// };

function Bob(x, y) {
	this.x  = x || 0;
	this.y  = y || 0;
	this.sx = 0;
	this.sy = 0;

	this.grounded = false;
	this.jumping  = 0;
}

Bob.prototype.update = function () {
	if (!this.grounded) {
		this.sy += GRAVITY;
		this.sy = Math.min(this.sy, MAX_GRAVITY);
	}

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	// check collision
	if (!this.grounded && this.sy > 0) {
		var tileD = level.getAt(this.x, this.y + 8);
		if (tileD.isTopSolid) {
			this.grounded = true;
			this.jumping = 0;
			this.sy = 0;
			y = ~~((this.y + 8) / TILE_HEIGHT) * TILE_HEIGHT - 8;
		}
	}

	this.x = x;
	this.y = y;
};

Bob.prototype.jump = function () {
	if (!this.grounded && this.jumping > 12) return;
	this.jumping++;
	this.grounded = false;
	this.sy = -3 + this.jumping * 0.08;
}

Bob.prototype.draw = function () {
	sprite(153, this.x, this.y);
};


var bob = new Bob(level.bob.x, level.bob.y);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	cls();
	bob.sx *= 0.8;
	// bob.sy *= 0.8;
	if (btn.up)    bob.jump();
	// if (btn.down)  bob.sy = 1;
	if (btn.right) bob.sx = 1;
	if (btn.left)  bob.sx = -1;
	bob.update();

	scrollX = clip(bob.x - 32, 0, level.width  * TILE_WIDTH  - 64);
	scrollY = clip(bob.y - 32, 0, level.height * TILE_HEIGHT - 64);

	camera(scrollX, scrollY);
	background.draw();
	bob.draw();
};
