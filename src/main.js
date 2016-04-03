var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY = 0.5;
var MAX_GRAVITY = 2;

var scrollX = 0;
var scrollY = 0;
var level = getMap("mario");
// level.setSpritesheet(assets.spritesheet_BAK);
paper(6);

var bobPosition = level.find(153)[0];
level.remove(bobPosition.x, bobPosition.y);

Map.prototype.getAt = function (x, y) {
	return this.get(~~(x / TILE_WIDTH), ~~(y / TILE_HEIGHT));
};

function Sprite() {
	this.x = 0;
	this.y = 0;
	this.sx = 0;
	this.sy = 0;

	this.grounded = false;
}

Sprite.prototype.update = function () {
	if (!this.grounded) {
		this.sy += GRAVITY;
		this.sy = Math.min(this.sy, MAX_GRAVITY);
	}

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	// check collision
	if (!this.grounded && this.sy > 0) {
		var tileD = level.getAt(this.x, this.y + 8);
		if (tileD && tileD.sprite === 0) {
			this.grounded = true;
			this.sy = 0;
			y = ~~((this.y + 8) / TILE_HEIGHT) * TILE_HEIGHT - 8;
		}
	}

	this.x = x;
	this.y = y;
};

Sprite.prototype.jump = function () {
	// if (!this.grounded) return;
	this.grounded = false;
	this.sy = -3;
}

Sprite.prototype.draw = function () {
	sprite(153, this.x, this.y);
};



var bob = new Sprite();
bob.x = bobPosition.x * TILE_WIDTH;
bob.y = bobPosition.y * TILE_HEIGHT;

// spritesheet(assets.spritesheet_BAK);
// console.log(bob)

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
	level.draw();
	bob.draw();
};
