var level = require('./Level.js');
var bob   = require('./Bob.js');
var background = new Map();

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 2;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function GameController() {
	this.level = level;
	this.bob   = bob;

	level.controller = this;
	bob.controller   = this;
}

module.exports = new GameController();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.loadLevel = function (id, doorId, side) {
	var def = assets.levels[id];
	level.init(def);
	if (doorId !== undefined) level.setBobPositionOnDoor(doorId);
	if (side) level.setBobPositionOnSide(bob, side);
	bob.setPosition(level.bobPos); // TODO
	background = getMap(def.background);
	paper(def.bgcolor);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var nextLevel, nextDoor, inTransition, transitionCount, nextSide;
GameController.prototype.changeLevel = function (id, doorId) {
	inTransition = true;
	transitionCount = -30;
	nextLevel = id;
	nextDoor  = doorId;
	nextSide  = undefined;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.goToSideLevel = function (direction) {
	if (!level[direction]) return false;
	inTransition = true;
	transitionCount = -30;
	nextLevel = level[direction];
	nextDoor  = undefined;
	nextSide  = direction;
	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.ditherTransition = function () {
	camera(0, 0);
	draw(assets.ditherFondu, 0, transitionCount * TILE_HEIGHT);
	if (++transitionCount > 0) {
		this.loadLevel(nextLevel, nextDoor, nextSide);
		inTransition = false;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.update = function () {
	if (inTransition) return this.ditherTransition();

	bob.sx *= 0.8;

	if (btnp.up) bob.startJump();
	if (btnr.up) bob.endJump();
	if (btn.up)  bob.jump();

	if (btn.down) bob.goDown();

	// if (btn.down)  TODO going down from one way platforms
	if ( btn.right && !btn.left) bob.goRight();
	if (!btn.right &&  btn.left) bob.goLeft();

	var tile = level.getTileAt(bob.x + 4, bob.y + 4);
	bob.inWater = tile.isWater; // TODO check enter, exit (for particles, etc)

	if (btnp.A) bob.action(tile);

	bob.update();

	var scrollX = clip(bob.x - 28, 0, level.width  * TILE_WIDTH  - 64);
	var scrollY = clip(bob.y - 28, 0, level.height * TILE_HEIGHT - 64);

	cls();
	camera(scrollX, scrollY);
	background.draw();
	bob.draw();
};