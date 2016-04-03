var level = require('./Level.js');
var bob   = require('./Bob.js');
var background = new Map();

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 2;

var scrollX = 0;
var scrollY = 0;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function GameController() {
	this.level = level;
	this.bob   = bob;

	level.controller = this;
	bob.controller   = this;
}

module.exports = new GameController();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.loadLevel = function (id, doorId) {
	var def = assets.levels[id];
	level.init(def);
	if (doorId !== undefined) level.setBobPositionOnDoor(doorId);
	bob.setPosition(level.bobPos); // TODO
	background = getMap(def.background);
	paper(def.bgcolor);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.update = function () {
	cls();
	bob.sx *= 0.8;
	if (btn.up)    bob.jump();
	// if (btn.down)  bob.sy = 1;
	if (btn.right) bob.goRight();
	if (btn.left)  bob.goLeft();
	if (btnp.A)    bob.action();
	bob.update();

	scrollX = clip(bob.x - 28, 0, level.width  * TILE_WIDTH  - 64);
	scrollY = clip(bob.y - 28, 0, level.height * TILE_HEIGHT - 64);

	camera(scrollX, scrollY);
	background.draw();
	bob.draw();
};